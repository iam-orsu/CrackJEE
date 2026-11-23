import type { PrismaClient } from '@prisma/client';
import { prisma as defaultPrisma } from '../config/database';

/** Full auth-facing row: includes the password hash and the Google subject. */
const AUTH_USER_SELECT = {
  id: true,
  name: true,
  email: true,
  class: true,
  targetExam: true,
  hasPsychometric: true,
  currentLevel: true,
  passwordHash: true,
  googleSub: true,
  avatarUrl: true,
  isOnboarded: true,
  mobile: true,
  mobileVerified: true,
  emailVerified: true,
} as const;

/** Row returned once a Google account is linked — no password hash. */
const LINKED_USER_SELECT = {
  id: true,
  name: true,
  email: true,
  class: true,
  targetExam: true,
  hasPsychometric: true,
  currentLevel: true,
  googleSub: true,
  avatarUrl: true,
  isOnboarded: true,
  mobile: true,
  mobileVerified: true,
  emailVerified: true,
} as const;

/** Row safe to hand back to the client — no credentials of any kind. */
const SAFE_USER_SELECT = {
  id: true,
  name: true,
  email: true,
  class: true,
  targetExam: true,
  hasPsychometric: true,
  currentLevel: true,
  avatarUrl: true,
  isOnboarded: true,
  mobile: true,
  mobileVerified: true,
  emailVerified: true,
} as const;

export class UserRepository {
  constructor(private readonly prisma: PrismaClient = defaultPrisma) {}

  public findByEmailForAuth(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: AUTH_USER_SELECT,
    });
  }

  public findByGoogleSub(googleSub: string) {
    return this.prisma.user.findUnique({
      where: { googleSub },
      select: AUTH_USER_SELECT,
    });
  }

  public linkGoogleSub(id: string, googleSub: string, avatarUrl?: string | null) {
    return this.prisma.user.update({
      where: { id },
      data: { googleSub, emailVerified: true, ...(avatarUrl ? { avatarUrl } : {}) },
      select: LINKED_USER_SELECT,
    });
  }

  public updateProfile(
    id: string,
    data: {
      class?: string;
      targetExam?: string;
      currentLevel?: string;
      hasPsychometric?: boolean;
      isOnboarded?: boolean;
      mobile?: string | null;
      mobileVerified?: boolean;
      emailVerified?: boolean;
    },
  ) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: SAFE_USER_SELECT,
    });
  }

  public existsByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
  }

  public findByMobile(mobile: string) {
    return this.prisma.user.findUnique({
      where: { mobile },
      select: { id: true },
    });
  }

  public create(data: {
    name: string;
    email: string;
    passwordHash: string;
    class: string;
    targetExam: string;
    hasPsychometric?: boolean;
    currentLevel: string;
    googleSub?: string | null;
    avatarUrl?: string | null;
    isOnboarded?: boolean;
    mobile?: string | null;
    mobileVerified?: boolean;
    emailVerified?: boolean;
  }) {
    return this.prisma.user.create({
      data: {
        ...data,
        hasPsychometric: data.hasPsychometric ?? false,
        googleSub: data.googleSub ?? null,
        avatarUrl: data.avatarUrl ?? null,
        isOnboarded: data.isOnboarded ?? false,
        mobile: data.mobile ?? null,
        mobileVerified: data.mobileVerified ?? false,
        emailVerified: data.emailVerified ?? false,
      },
      select: SAFE_USER_SELECT,
    });
  }

  public findSafeById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        ...SAFE_USER_SELECT,
        createdAt: true,
      },
    });
  }

  public existsById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    });
  }

  public findAllForAdmin() {
    return this.prisma.user.findMany({
      select: { id: true, name: true, email: true, class: true, targetExam: true, mobile: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
