import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { invoiceId, gateway = 'stripe' } = await req.json();

    if (!invoiceId) {
      return NextResponse.json({ error: 'invoiceId is required' }, { status: 400 });
    }

    const invoice = db.getInvoiceById(invoiceId);
    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    if (invoice.status === 'paid') {
      return NextResponse.json({ error: 'This invoice has already been paid' }, { status: 400 });
    }

    // Generate payment order object
    const orderId = gateway === 'razorpay' 
      ? `order_rzp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
      : `pi_str_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    return NextResponse.json({
      success: true,
      order: {
        id: orderId,
        invoiceId: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        amount: invoice.total,
        currency: invoice.currency,
        clientName: invoice.clientName,
        clientEmail: invoice.clientEmail,
        gateway,
        key: gateway === 'razorpay' ? 'rzp_test_GenMStudio123' : 'pk_test_GenMStudioStripe123',
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create payment order' }, { status: 500 });
  }
}
