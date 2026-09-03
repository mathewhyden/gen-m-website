import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const bookings = db.getBookings();
    return NextResponse.json({ success: true, bookings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name || !body.email || !body.date || !body.time) {
      return NextResponse.json({ error: 'Name, email, date, and time are required' }, { status: 400 });
    }

    const booking = db.createBooking({
      name: body.name,
      email: body.email,
      phone: body.phone || '',
      company: body.company || '',
      service: body.service || 'General Consultation',
      date: body.date,
      time: body.time,
      meetingType: body.meetingType || 'google_meet',
      meetingLink: body.meetingLink || 'https://meet.google.com/gen-m-consult',
      notes: body.notes || '',
    });

    return NextResponse.json({
      success: true,
      message: 'Consultation booked successfully. A confirmation email has been dispatched.',
      booking
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to book consultation' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Booking ID and status are required' }, { status: 400 });
    }
    const updated = db.updateBooking(id, { status: status.toLowerCase() });
    if (!updated) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, booking: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update booking' }, { status: 500 });
  }
}
