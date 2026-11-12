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
        currentLevel: true,
        passwordHash: true,
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
    currentLevel: string;
  }) {
    return this.prisma.user.create({
      data,
      select: { id: true, name: true, email: true, class: true, targetExam: true, currentLevel: true },
    });
  }

  public findSafeById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, class: true, targetExam: true, currentLevel: true, createdAt: true },
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
