import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const services = await db.getServices();
    const testimonials = await db.getTestimonials();
    return NextResponse.json({ success: true, services, testimonials });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch content' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { services, testimonials } = await req.json();
    if (services) await db.updateServices(services);
    if (testimonials) await db.updateTestimonials(testimonials);

    return NextResponse.json({
      success: true,
      message: 'CMS content updated successfully',
      services: await db.getServices(),
      testimonials: await db.getTestimonials(),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update content' }, { status: 500 });
  }
}
