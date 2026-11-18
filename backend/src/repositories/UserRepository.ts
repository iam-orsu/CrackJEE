import type { PrismaClient } from '@prisma/client';
import { prisma as defaultPrisma } from '../config/database';

export class UserRepository {
  constructor(private readonly prisma: PrismaClient = defaultPrisma) {}

  public findByEmailForAuth(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
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
      },
    });
  }

  public findByGoogleSub(googleSub: string) {
    return this.prisma.user.findUnique({
      where: { googleSub },
      select: {
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
      },
    });
  }

  public linkGoogleSub(id: string, googleSub: string, avatarUrl?: string | null) {
    return this.prisma.user.update({
      where: { id },
      data: { googleSub, ...(avatarUrl ? { avatarUrl } : {}) },
      select: {
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
      },
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
    },
  ) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        class: true,
        targetExam: true,
        hasPsychometric: true,
        currentLevel: true,
        avatarUrl: true,
        isOnboarded: true,
      },
    });
  }

  public existsByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
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
  }) {
    return this.prisma.user.create({
      data: {
        ...data,
        hasPsychometric: data.hasPsychometric ?? false,
        googleSub: data.googleSub ?? null,
        avatarUrl: data.avatarUrl ?? null,
        isOnboarded: data.isOnboarded ?? false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        class: true,
        targetExam: true,
        hasPsychometric: true,
        currentLevel: true,
        avatarUrl: true,
        isOnboarded: true,
      },
    });
  }

  public findSafeById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        class: true,
        targetExam: true,
        hasPsychometric: true,
        currentLevel: true,
        avatarUrl: true,
        isOnboarded: true,
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
      select: { id: true, name: true, email: true, class: true, targetExam: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
