import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    if (!body.title) {
      return NextResponse.json({ error: 'Milestone title is required' }, { status: 400 });
    }

    const milestone = db.addMilestone(id, {
      title: body.title,
      description: body.description || '',
      status: body.status || 'pending',
      dueDate: body.dueDate,
    });

    if (!milestone) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, milestone });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to add milestone' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { milestoneId, ...updates } = body;

    if (!milestoneId) {
      return NextResponse.json({ error: 'milestoneId is required' }, { status: 400 });
    }

    const updated = db.updateMilestone(id, milestoneId, updates);
    if (!updated) {
      return NextResponse.json({ error: 'Milestone or Project not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, milestone: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update milestone' }, { status: 500 });
  }
}
