import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? [{ emit: 'stdout', level: 'error' }, { emit: 'stdout', level: 'warn' }]
    : [{ emit: 'stdout', level: 'error' }],
});
