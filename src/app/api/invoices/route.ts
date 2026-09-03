import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId');
    const projectId = searchParams.get('projectId');

    let invoices = db.getInvoices();

    if (clientId) {
      invoices = invoices.filter(i => i.clientId === clientId);
    }
    if (projectId) {
      invoices = invoices.filter(i => i.projectId === projectId);
    }

    return NextResponse.json({ success: true, count: invoices.length, invoices });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch invoices' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.clientName || !body.clientEmail) {
      return NextResponse.json({ error: 'Client name and email are required' }, { status: 400 });
    }

    const invoice = db.createInvoice(body);
    return NextResponse.json({ success: true, invoice }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create invoice' }, { status: 500 });
  }
}
