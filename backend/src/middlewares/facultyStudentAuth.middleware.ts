import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AUTH_CONSTANTS } from '../config/constants';
import { isCookieSecure } from '../config/env';
import { FacultyStudentRepository } from '../repositories/FacultyStudentRepository';

export const FACULTY_STUDENT_COOKIE = AUTH_CONSTANTS.FACULTY_STUDENT_COOKIE;
export const FACULTY_STUDENT_COOKIE_MAX_AGE_S = AUTH_CONSTANTS.FACULTY_STUDENT_COOKIE_MAX_AGE_S;

export interface FacultyStudentAuthRequest extends Request {
  facultyStudent?: {
    studentId: string;
    facultyId: string;
    batchId: string;
    name: string;
    rollNumber: string;
  };
}

function studentCookieFlags(maxAgeSeconds: number): string {
  const secure = isCookieSecure() ? ' Secure;' : '';
  return `Path=/api/v1/faculty-student; HttpOnly;${secure} SameSite=Strict; Max-Age=${maxAgeSeconds}`;
}

export function setFacultyStudentCookie(res: Response, token: string): void {
  res.append('Set-Cookie', `${FACULTY_STUDENT_COOKIE}=${token}; ${studentCookieFlags(FACULTY_STUDENT_COOKIE_MAX_AGE_S)}`);
}

export function clearFacultyStudentCookie(res: Response): void {
  res.append('Set-Cookie', `${FACULTY_STUDENT_COOKIE}=; ${studentCookieFlags(0)}`);
}

function studentTokenFrom(req: Request): string | null {
  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) return header.slice(7);
  for (const part of (req.headers.cookie ?? '').split(';')) {
    const [name, ...value] = part.trim().split('=');
    if (name === FACULTY_STUDENT_COOKIE && value.length > 0) return decodeURIComponent(value.join('='));
  }
  return null;
}

const defaultStudentRepo = new FacultyStudentRepository();

/** Middleware restricting routes to active `role: 'faculty_student'` sessions. */
export function requireFacultyStudent(repo: FacultyStudentRepository = defaultStudentRepo) {
  return async (req: FacultyStudentAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const token = studentTokenFrom(req);
    if (!token) {
      res.status(401).json({ success: false, error: 'Student login required' });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ success: false, error: 'Server misconfiguration' });
      return;
    }

    let payload: { studentId?: string; facultyId?: string; batchId?: string; role?: string };
    try {
      payload = jwt.verify(token, secret, { algorithms: ['HS256'] }) as {
        studentId?: string;
        facultyId?: string;
        batchId?: string;
        role?: string;
      };
    } catch {
      res.status(401).json({ success: false, error: 'Invalid or expired student session' });
      return;
    }

    if (payload.role !== 'faculty_student' || !payload.studentId) {
      res.status(403).json({ success: false, error: 'Student portal access only' });
      return;
    }

    try {
      const student = await repo.findByIdGlobal(payload.studentId);
      if (!student || !student.isActive) {
        res.status(403).json({ success: false, error: 'Student account is inactive or not found' });
        return;
      }
      req.facultyStudent = {
        studentId: student.id,
        facultyId: student.facultyId,
        batchId: student.batchId,
        name: student.name,
        rollNumber: student.rollNumber,
      };
      next();
    } catch (err) {
      next(err);
    }
  };
}
