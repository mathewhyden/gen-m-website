import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.name?.trim() || !body.email?.trim()) {
      return NextResponse.json({ error: 'Name and email are required to submit an inquiry.' }, { status: 400 });
    }

    const messageText = (body.message || '').trim() || 'Inquiry submitted via website contact form.';

    const enquiry = await db.createEnquiry({
      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone?.trim() || '',
      company: body.company?.trim() || '',
      service: body.service || 'Web Development',
      budget: body.budget || '$2,500 - $5,000',
      timeline: body.timeline || 'Flexible',
      message: messageText,
    });

    return NextResponse.json({
      success: true,
      message: 'Your project brief has been received. Our team will review and reply within 24 hours.',
      enquiry,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to submit enquiry' }, { status: 500 });
  }
}
