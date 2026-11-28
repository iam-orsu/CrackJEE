import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { AUTH_CONSTANTS } from '../config/constants';
import { FacultyRepository } from '../repositories/FacultyRepository';
import type { GoogleProfile } from './GoogleAuthService';
import { AppError } from '../utils/AppError';

interface GoogleFacultyAccount {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  googleSub: string | null;
  avatarUrl: string | null;
  mobile?: string | null;
  mobileVerified?: boolean;
}

/** Handles faculty/mentor authentication and account provisioning. */
export class FacultyAuthService {
  constructor(
    private readonly facultyRepo: FacultyRepository = new FacultyRepository(),
  ) {}

  public async loginWithGoogle(profile: GoogleProfile) {
    if (!profile.emailVerified) {
      throw new AppError(403, 'Your Google email address is not verified. Verify it and try again.');
    }

    const email = profile.email.trim().toLowerCase();
    const linkedAccount = await this.facultyRepo.findByGoogleSub(profile.sub);

    let faculty: GoogleFacultyAccount;
    if (linkedAccount) {
      if (linkedAccount.email !== email) {
        throw new AppError(403, 'This Google account is linked to a different faculty email.');
      }
      faculty = linkedAccount.avatarUrl === profile.picture
        ? linkedAccount
        : await this.facultyRepo.linkGoogleSub(linkedAccount.id, profile.sub, profile.picture);
    } else {
      const existing = await this.facultyRepo.findByEmail(email);
      if (!existing) {
        if (!this.isAutoProvisionEnabled()) {
          throw new AppError(
            403,
            'No faculty account exists for this Google email. Ask your program administrator to create one.',
          );
        }
        const passwordHash = await bcrypt.hash(crypto.randomBytes(32).toString('hex'), AUTH_CONSTANTS.BCRYPT_ROUNDS);
        faculty = await this.facultyRepo.create({
          name: profile.name || email,
          email,
          passwordHash,
          googleSub: profile.sub,
          avatarUrl: profile.picture,
        });
      } else if (existing.googleSub && existing.googleSub !== profile.sub) {
        throw new AppError(
          403,
          'This faculty email is already linked to a different Google account.',
        );
      } else if (!existing.googleSub) {
        faculty = await this.facultyRepo.linkGoogleSub(existing.id, profile.sub, profile.picture);
      } else {
        faculty = existing.avatarUrl === profile.picture
          ? existing
          : await this.facultyRepo.linkGoogleSub(existing.id, profile.sub, profile.picture);
      }
    }

    if (!faculty.isActive) {
      throw new AppError(403, 'Faculty account has been deactivated. Contact the administrator.');
    }

    return this.issueSession(faculty);
  }

  private isAutoProvisionEnabled(): boolean {
    return process.env.GOOGLE_FACULTY_AUTO_PROVISION !== 'false';
  }

  private issueSession(faculty: { id: string; name: string; email: string; avatarUrl?: string | null; mobile?: string | null; mobileVerified?: boolean }) {
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
        avatarUrl: faculty.avatarUrl ?? null,
        mobile: faculty.mobile ?? null,
        mobileVerified: faculty.mobileVerified ?? false,
      },
    };
  }

  public async verifyMobile(facultyId: string, mobile: string) {
    const existing = await this.facultyRepo.findById(facultyId);
    if (!existing) throw new AppError(404, 'Faculty account not found');

    await this.assertMobileAvailable(facultyId, mobile);

    return this.facultyRepo.updateAccount(facultyId, { mobile, mobileVerified: true });
  }

  public async assertMobileAvailable(facultyId: string, mobile: string): Promise<void> {
    const facultyOwner = await this.facultyRepo.findByMobile(mobile);
    if (facultyOwner && facultyOwner.id !== facultyId) {
      throw new AppError(409, 'This mobile number is already linked to another faculty account.');
    }
  }

  public async listAccounts() {
    const rows = await this.facultyRepo.listAllWithCounts();
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      isActive: r.isActive,
      googleLinked: r.googleSub !== null,
      avatarUrl: r.avatarUrl ?? null,
      paperCount: r._count.papers,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  public async createAccount(input: { name: string; email: string; password?: string }) {
    const email = input.email.trim().toLowerCase();
    const existing = await this.facultyRepo.findByEmail(email);
    if (existing) {
      throw new AppError(409, 'A faculty account with this email already exists');
    }

    const passwordHash = input.password
      ? await bcrypt.hash(input.password, AUTH_CONSTANTS.BCRYPT_ROUNDS)
      : await bcrypt.hash(crypto.randomBytes(32).toString('hex'), AUTH_CONSTANTS.BCRYPT_ROUNDS);

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
