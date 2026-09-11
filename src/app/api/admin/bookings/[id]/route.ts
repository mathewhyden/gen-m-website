import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updated = await db.updateBooking(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (body.status === 'confirmed') {
      db.logEmail({
        to: updated.email,
        subject: `Your Gen-M Consultation is Confirmed (${updated.date} at ${updated.time})`,
        template: 'booking_confirmed',
        data: { bookingId: updated.id, link: updated.meetingLink }
      });
    }

    return NextResponse.json({ success: true, booking: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update booking' }, { status: 500 });
  }
}
