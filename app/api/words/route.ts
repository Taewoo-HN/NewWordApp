import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') ?? '1');
  const limit = parseInt(searchParams.get('limit') ?? '20');
  const search = searchParams.get('search') ?? '';
  const memorized = searchParams.get('memorized');
  const offset = (page - 1) * limit;

  const db = getDb();

  let where = 'WHERE 1=1';
  const params: (string | number)[] = [];

  if (search) {
    where += ' AND (word LIKE ? OR meaning_kr LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }
  if (memorized !== null) {
    where += ' AND is_memorized = ?';
    params.push(memorized === 'true' ? 1 : 0);
  }

  const total = (db.prepare(`SELECT COUNT(*) as count FROM vocabulary ${where}`).get(...params) as { count: number }).count;
  const words = db.prepare(`SELECT * FROM vocabulary ${where} ORDER BY id LIMIT ? OFFSET ?`).all(...params, limit, offset);

  return NextResponse.json({ words, total, page, limit });
}
