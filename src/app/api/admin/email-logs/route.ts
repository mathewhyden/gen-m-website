import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const emailLogs = await db.getEmailLogs();
    return NextResponse.json({ success: true, count: emailLogs.length, emailLogs });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch email logs' }, { status: 500 });
  }
}
