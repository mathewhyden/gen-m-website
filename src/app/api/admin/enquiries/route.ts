import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const enquiries = db.getEnquiries();
    return NextResponse.json({ success: true, count: enquiries.length, enquiries });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch enquiries' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 });
    }

    const updated = db.updateEnquiry(id, { status });
    if (!updated) {
      return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, enquiry: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update enquiry' }, { status: 500 });
  }
}
