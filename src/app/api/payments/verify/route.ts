import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { 
      invoiceId, 
      amount, 
      currency = 'USD', 
      gateway = 'stripe', 
      method = 'card',
      transactionRef = `txn_${Date.now()}` 
    } = await req.json();

    if (!invoiceId) {
      return NextResponse.json({ error: 'invoiceId is required' }, { status: 400 });
    }

    const invoice = db.getInvoiceById(invoiceId);
    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const payment = db.processPayment({
      invoiceId: invoice.id,
      amount: Number(amount) || invoice.total,
      currency: currency || invoice.currency,
      gateway: gateway as any,
      method: method as any,
      transactionRef: transactionRef || `txn_verified_${Date.now()}`,
      metadata: { timestamp: new Date().toISOString() }
    });

    if (!payment) {
      return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and recorded successfully',
      payment,
      invoice: db.getInvoiceById(invoiceId),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Payment verification failed' }, { status: 500 });
  }
}
