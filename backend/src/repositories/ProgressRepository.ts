import { Prisma, type PrismaClient } from '@prisma/client';
import { prisma as defaultPrisma } from '../config/database';

export type GlobalLeaderboardRow = {
  examType: string;
  subject: string;
  top: number;
  avg: number;
  topAvg: number | null;
  count: number;
};

export type MyLeaderboardRow = {
  examType: string;
  subject: string;
  best: number;
  mine: number;
};

function toNumOrNull(val: unknown): number | null {
  if (val === null || val === undefined) return null;
  const n = Number(val);
  return Number.isFinite(n) ? n : null;
}

/**
 * Isolates all MySQL analytics aggregation queries for progress, leaderboards, and platform averages.
 */
export class ProgressRepository {
  constructor(private readonly prisma: PrismaClient = defaultPrisma) {}

  public async getGlobalOverallMockStats(): Promise<{ platformAvg: number | null; topAvg: number | null }> {
    const rows = await this.prisma.$queryRaw<Array<{ avg: unknown; top: unknown }>>(Prisma.sql`
      WITH per_exam AS (
        SELECT e.\`userId\` AS \`userId\`, r.\`totalScore\` * 100.0 / r.\`maxScore\` AS pct
        FROM \`MockExamResult\` r
        JOIN \`MockExam\` e ON e.\`id\` = r.\`examId\`
        WHERE e.\`status\` = 'submitted' AND r.\`maxScore\` > 0
      )
      SELECT
        (SELECT CAST(FLOOR(AVG(pct) + 0.5) AS DOUBLE) FROM per_exam) AS \`avg\`,
        (SELECT CAST(FLOOR(MAX(ua) + 0.5) AS DOUBLE) FROM (SELECT AVG(pct) AS ua FROM per_exam GROUP BY \`userId\`) t) AS \`top\`
    `);

    return {
      platformAvg: toNumOrNull(rows[0]?.avg),
      topAvg: toNumOrNull(rows[0]?.top),
    };
  }

  public async getUserOverallMockAvg(userId: string): Promise<number | null> {
    const rows = await this.prisma.$queryRaw<Array<{ mine: unknown }>>(Prisma.sql`
      SELECT CAST(FLOOR(AVG(r.\`totalScore\` * 100.0 / r.\`maxScore\`) + 0.5) AS DOUBLE) AS \`mine\`
      FROM \`MockExamResult\` r
      JOIN \`MockExam\` e ON e.\`id\` = r.\`examId\`
      WHERE e.\`status\` = 'submitted' AND r.\`maxScore\` > 0 AND e.\`userId\` = ${userId}
    `);
    return toNumOrNull(rows[0]?.mine);
  }

  private scoredRowsSql(userId: string | null): Prisma.Sql {
    const userFilter = userId ? Prisma.sql`WHERE e.\`userId\` = ${userId}` : Prisma.empty;
    const jeeMax = Prisma.sql`CASE WHEN r.\`maxScore\` > 0 THEN ROUND(r.\`maxScore\` / 3.0) ELSE 100 END`;
    return Prisma.sql`
      SELECT parts.\`examType\` AS \`examType\`,
             parts.\`subject\` AS \`subject\`,
             parts.\`userId\` AS \`userId\`,
             CASE WHEN parts.\`max\` > 0 THEN FLOOR(parts.\`score\` / parts.\`max\` * 100 + 0.5) ELSE 0 END AS \`pct\`
      FROM (
        SELECT e.\`examType\` AS \`examType\`, e.\`userId\` AS \`userId\`, 'Physics' AS \`subject\`,
               CAST(r.\`physicsScore\` AS DOUBLE) AS \`score\`,
               CAST(CASE WHEN e.\`examType\` = 'NEET' THEN 180 ELSE ${jeeMax} END AS DOUBLE) AS \`max\`
        FROM \`MockExamResult\` r JOIN \`MockExam\` e ON e.\`id\` = r.\`examId\` ${userFilter}
        UNION ALL
        SELECT e.\`examType\`, e.\`userId\`, 'Chemistry',
               CAST(r.\`chemistryScore\` AS DOUBLE),
               CAST(CASE WHEN e.\`examType\` = 'NEET' THEN 180 ELSE ${jeeMax} END AS DOUBLE)
        FROM \`MockExamResult\` r JOIN \`MockExam\` e ON e.\`id\` = r.\`examId\` ${userFilter}
        UNION ALL
        SELECT e.\`examType\`, e.\`userId\`,
               CASE WHEN e.\`examType\` = 'NEET' THEN 'Biology' ELSE 'Mathematics' END,
               CAST(CASE WHEN e.\`examType\` = 'NEET' THEN r.\`biologyScore\` ELSE r.\`mathScore\` END AS DOUBLE),
               CAST(CASE WHEN e.\`examType\` = 'NEET' THEN 360 ELSE ${jeeMax} END AS DOUBLE)
        FROM \`MockExamResult\` r JOIN \`MockExam\` e ON e.\`id\` = r.\`examId\` ${userFilter}
      ) parts
    `;
  }

  public async getGlobalLeaderboardRows(): Promise<GlobalLeaderboardRow[]> {
    const rows = await this.prisma.$queryRaw<
      Array<{ examType: string; subject: string; top: unknown; avg: unknown; count: unknown; topAvg: unknown }>
    >(Prisma.sql`
      WITH scored AS (
        ${this.scoredRowsSql(null)}
      ),
      overall AS (
        SELECT \`examType\`,
               \`subject\`,
               CAST(MAX(\`pct\`) AS DOUBLE) AS \`top\`,
               CAST(FLOOR(AVG(\`pct\`) + 0.5) AS DOUBLE) AS \`avg\`,
               CAST(COUNT(*) AS SIGNED) AS \`count\`
        FROM scored
        GROUP BY \`examType\`, \`subject\`
      ),
      top_avgs AS (
        SELECT \`examType\`,
               \`subject\`,
               CAST(FLOOR(MAX(\`ua\`) + 0.5) AS DOUBLE) AS \`topAvg\`
        FROM (
          SELECT \`examType\`, \`subject\`, \`userId\`, AVG(\`pct\`) AS \`ua\`
          FROM scored
          GROUP BY \`examType\`, \`subject\`, \`userId\`
        ) u
        GROUP BY \`examType\`, \`subject\`
      )
      SELECT o.\`examType\` AS \`examType\`,
             o.\`subject\` AS \`subject\`,
             o.\`top\` AS \`top\`,
             o.\`avg\` AS \`avg\`,
             o.\`count\` AS \`count\`,
             t.\`topAvg\` AS \`topAvg\`
      FROM overall o
      LEFT JOIN top_avgs t
        ON t.\`examType\` = o.\`examType\` AND t.\`subject\` = o.\`subject\`
    `);

    return rows.map((r) => ({
      examType: r.examType,
      subject: r.subject,
      top: Number(r.top ?? 0),
      avg: Number(r.avg ?? 0),
      count: Number(r.count ?? 0),
      topAvg: toNumOrNull(r.topAvg),
    }));
  }

  public async getUserLeaderboardRows(userId: string): Promise<MyLeaderboardRow[]> {
    const rows = await this.prisma.$queryRaw<
      Array<{ examType: string; subject: string; best: unknown; mine: unknown }>
    >(Prisma.sql`
      SELECT p.\`examType\` AS \`examType\`,
             p.\`subject\` AS \`subject\`,
             CAST(MAX(p.\`pct\`) AS DOUBLE) AS \`best\`,
             CAST(FLOOR(AVG(p.\`pct\`) + 0.5) AS DOUBLE) AS \`mine\`
      FROM (${this.scoredRowsSql(userId)}) p
      GROUP BY p.\`examType\`, p.\`subject\`
    `);

    return rows.map((r) => ({
      examType: r.examType,
      subject: r.subject,
      best: Number(r.best ?? 0),
      mine: Number(r.mine ?? 0),
    }));
  }

  public async getPlatformAveragesByExamType(
    examType: string,
  ): Promise<Array<{ userId: string; avgPct: number }>> {
    const rows = await this.prisma.$queryRaw<Array<{ userId: string; avgPct: unknown }>>(Prisma.sql`
      SELECT e.\`userId\` AS \`userId\`,
             CAST(AVG(r.\`totalScore\` * 100.0 / r.\`maxScore\`) AS DOUBLE) AS \`avgPct\`
      FROM \`MockExamResult\` r
      JOIN \`MockExam\` e ON e.\`id\` = r.\`examId\`
      WHERE e.\`status\` = 'submitted' AND e.\`examType\` = ${examType} AND r.\`maxScore\` > 0
      GROUP BY e.\`userId\`
    `);

    return rows.map((r) => ({
      userId: r.userId,
      avgPct: Math.round(Number(r.avgPct ?? 0) * 10) / 10,
    }));
  }
}
