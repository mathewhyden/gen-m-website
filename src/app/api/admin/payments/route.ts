import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const payments = db.getPayments();
    return NextResponse.json({ success: true, count: payments.length, payments });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch payments' }, { status: 500 });
  }
}
