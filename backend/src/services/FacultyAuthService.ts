import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AUTH_CONSTANTS } from '../config/constants';
import { FacultyRepository } from '../repositories/FacultyRepository';
import { AppError } from '../utils/AppError';

/** Handles faculty/mentor authentication and account provisioning. */
export class FacultyAuthService {
  constructor(private readonly facultyRepo: FacultyRepository = new FacultyRepository()) {}

  public async login(email: string, password: string) {
    const normalized = email.trim().toLowerCase();
    const faculty = await this.facultyRepo.findByEmail(normalized);

    const hashToCompare = faculty ? faculty.passwordHash : AUTH_CONSTANTS.DUMMY_BCRYPT_HASH;
    const valid = await bcrypt.compare(password, hashToCompare);

    if (!faculty || !valid) {
      throw new AppError(401, 'Invalid email or password');
    }
    if (!faculty.isActive) {
      throw new AppError(403, 'Faculty account has been deactivated. Contact the administrator.');
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) throw new AppError(500, 'Server misconfiguration');

    const token = jwt.sign(
      { facultyId: faculty.id, role: 'faculty' },
      secret,
      { algorithm: 'HS256', expiresIn: `${AUTH_CONSTANTS.FACULTY_COOKIE_MAX_AGE_S}s` },
    );
    const expiresAt = new Date(Date.now() + AUTH_CONSTANTS.FACULTY_COOKIE_MAX_AGE_S * 1000).toISOString();

    return {
      token,
      expiresAt,
      faculty: {
        id: faculty.id,
        name: faculty.name,
        email: faculty.email,
      },
    };
  }

  public async listAccounts() {
    const rows = await this.facultyRepo.listAllWithCounts();
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      isActive: r.isActive,
      paperCount: r._count.papers,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  public async createAccount(input: { name: string; email: string; password: string }) {
    const email = input.email.trim().toLowerCase();
    const existing = await this.facultyRepo.findByEmail(email);
    if (existing) {
      throw new AppError(409, 'A faculty account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(input.password, AUTH_CONSTANTS.BCRYPT_ROUNDS);
    const created = await this.facultyRepo.create({
      name: input.name,
      email,
      passwordHash,
    });
    return {
      id: created.id,
      name: created.name,
      email: created.email,
      isActive: created.isActive,
      paperCount: 0,
      createdAt: created.createdAt.toISOString(),
    };
  }

  public async updateAccount(
    id: string,
    patch: { name?: string; isActive?: boolean; password?: string },
  ) {
    const existing = await this.facultyRepo.findById(id);
    if (!existing) throw new AppError(404, 'Faculty account not found');

    const updateData: { name?: string; isActive?: boolean; passwordHash?: string } = {};
    if (patch.name !== undefined) updateData.name = patch.name.trim();
    if (patch.isActive !== undefined) updateData.isActive = patch.isActive;
    if (patch.password !== undefined) {
      updateData.passwordHash = await bcrypt.hash(patch.password, AUTH_CONSTANTS.BCRYPT_ROUNDS);
    }

    const updated = await this.facultyRepo.updateAccount(id, updateData);
    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      isActive: updated.isActive,
      createdAt: updated.createdAt.toISOString(),
    };
  }
}
