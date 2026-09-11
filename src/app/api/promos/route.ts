import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const promo = await db.getPromoSettings();
    return NextResponse.json({ success: true, promo });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch promo settings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization') || req.cookies.get('genm_session')?.value;
    const user = getSessionUser(token);
    if (user && user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const updated = await db.savePromoSettings(body);
    return NextResponse.json({ success: true, promo: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save promo settings' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  return POST(req);
}
