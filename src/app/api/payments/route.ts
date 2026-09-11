import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const payments = await db.getPayments();

    // Clean up any legacy auto-generated demo payments (Solara Lifestyle, Kinetix Robotics, Apex Realty Group)
    const demoClientNames = ['Solara Lifestyle', 'Kinetix Robotics', 'Apex Realty Group'];
    const hasDemo = (payments || []).some(p => p.clientName && demoClientNames.includes(p.clientName));
    
    if (hasDemo) {
      for (const p of payments) {
        if (p.clientName && demoClientNames.includes(p.clientName)) {
          await db.deletePayment(p.id);
        }
      }
      const refreshed = await db.getPayments();
      return NextResponse.json({ success: true, payments: refreshed || [] }, { status: 200 });
    }

    return NextResponse.json({ success: true, payments: payments || [] }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch payments' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.clientName?.trim() || !body.amount) {
      return NextResponse.json({ error: 'Client name and payment amount are required' }, { status: 400 });
    }

    const totalFee = Number(body.totalFee) || Number(body.amount);
    const amount = Number(body.amount);
    const balanceDue = Number(body.balanceDue) !== undefined ? Number(body.balanceDue) : Math.max(0, totalFee - amount);

    const payment = await db.recordClientPayment({
      clientName: body.clientName.trim(),
      clientEmail: body.clientEmail?.trim() || 'client@gen-m.com',
      clientPhone: body.clientPhone?.trim() || '',
      projectTitle: body.projectTitle?.trim() || 'Custom Tech Development',
      totalFee,
      amount,
      balanceDue,
      paymentMethod: body.paymentMethod || 'UPI',
      gateway: body.gateway || 'UPI_BANK',
      utrNumber: body.utrNumber?.trim() || `REF-${Date.now()}`,
      notes: body.notes?.trim() || '',
      status: body.status,
    });

    return NextResponse.json({
      success: true,
      message: 'Payment confirmation recorded securely in Firestore.',
      payment,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to record payment' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, paymentStatusBadge, notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 });
    }

    const updated = await db.updatePayment(id, {
      status: status || paymentStatusBadge,
      paymentStatusBadge: paymentStatusBadge || status,
      ...(notes !== undefined ? { notes } : {}),
    });

    return NextResponse.json({ success: true, payment: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update payment' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const all = searchParams.get('all');

    if (all === 'true') {
      await db.clearPayments();
      return NextResponse.json({ success: true, message: 'All payments purged' });
    }

    if (!id) {
      return NextResponse.json({ error: 'Payment ID is required' }, { status: 400 });
    }

    const deleted = await db.deletePayment(id);
    if (!deleted) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Payment deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete payment' }, { status: 500 });
  }
}
