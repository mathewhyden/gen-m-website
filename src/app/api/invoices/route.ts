import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId');
    const projectId = searchParams.get('projectId');

    let invoices = await db.getInvoices();

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

// In-memory deduplication and in-flight request lock
const inFlightRequests = new Map<string, Promise<any>>();
const recentInvoiceRequests = new Map<string, { timestamp: number; invoice: any }>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.clientName || !body.clientEmail) {
      return NextResponse.json({ error: 'Client name and email are required' }, { status: 400 });
    }

    // Deduplication key based on clientEmail, projectName, total amount, and items description
    const dedupKey = `${(body.clientEmail || '').trim().toLowerCase()}_${(body.projectName || '').trim().toLowerCase()}_${body.total || body.amount || ''}_${body.items?.[0]?.description || ''}`;
    const now = Date.now();
    const existing = recentInvoiceRequests.get(dedupKey);

    if (existing && (now - existing.timestamp) < 4000) {
      // Return the already created invoice to prevent duplicate creation
      return NextResponse.json({ success: true, invoice: existing.invoice, deduplicated: true }, { status: 200 });
    }

    // Check if an identical invoice creation is currently in-flight
    const inFlightPromise = inFlightRequests.get(dedupKey);
    if (inFlightPromise) {
      const concurrentInvoice = await inFlightPromise;
      return NextResponse.json({ success: true, invoice: concurrentInvoice, deduplicated: true }, { status: 200 });
    }

    // Register in-flight promise to handle simultaneous race conditions
    const creationPromise = db.createInvoice(body);
    inFlightRequests.set(dedupKey, creationPromise);

    let invoice: any;
    try {
      invoice = await creationPromise;
      recentInvoiceRequests.set(dedupKey, { timestamp: Date.now(), invoice });
    } finally {
      inFlightRequests.delete(dedupKey);
    }

    // Cleanup stale entries
    if (recentInvoiceRequests.size > 100) {
      for (const [k, v] of recentInvoiceRequests.entries()) {
        if (Date.now() - v.timestamp > 15000) recentInvoiceRequests.delete(k);
      }
    }

    return NextResponse.json({ success: true, invoice }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create invoice' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const all = searchParams.get('all');

    if (all === 'true') {
      await db.clearInvoices();
      return NextResponse.json({ success: true, message: 'All invoices purged' });
    }

    if (!id) {
      return NextResponse.json({ error: 'Invoice ID is required' }, { status: 400 });
    }

    await db.deleteInvoice(id);
    return NextResponse.json({ success: true, message: 'Invoice deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete invoice' }, { status: 500 });
  }
}
