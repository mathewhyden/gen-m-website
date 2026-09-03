import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization') || req.cookies.get('genm_session')?.value;
  const user = getSessionUser(token);

  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const { password: _, ...safeUser } = user;
  return NextResponse.json({ authenticated: true, user: safeUser });
}
