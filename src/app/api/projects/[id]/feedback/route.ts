import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const { type, authorName, authorEmail, feedback, attachments } = body;

    if (!type || !feedback) {
      return NextResponse.json({ error: 'Feedback type and text are required' }, { status: 400 });
    }

    const newFeedback = db.addFeedback(id, {
      type: type as 'approval' | 'change_request',
      authorName: authorName || 'Client',
      authorEmail: authorEmail || 'client@example.com',
      feedback,
      attachments: attachments || [],
    });

    if (!newFeedback) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const updatedProject = db.getProjectById(id);

    return NextResponse.json({
      success: true,
      feedback: newFeedback,
      project: updatedProject,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to submit feedback' }, { status: 500 });
  }
}
