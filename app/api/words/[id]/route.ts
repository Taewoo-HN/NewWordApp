import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';
 
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
 
  const { id } = await params;
  const { is_memorized } = await request.json();
  const db = getDb();
 
  db.prepare(
    'UPDATE vocabulary SET is_memorized = ?, last_reviewed = CURRENT_TIMESTAMP WHERE id = ?'
  ).run(is_memorized ? 1 : 0, parseInt(id));
 
  return NextResponse.json({ success: true });
}
 