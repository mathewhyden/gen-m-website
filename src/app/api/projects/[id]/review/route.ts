import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = db.getProjectById(id);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Update status to CLIENT_REVIEW
    const updated = db.updateProject(id, {
      status: 'CLIENT_REVIEW',
      progress: Math.max(project.progress, 90),
    });

    // Send email notification to client with review link
    db.logEmail({
      to: project.clientEmail,
      subject: `Action Required: Review & Verification for ${project.name}`,
      template: 'project_verification_request',
      data: {
        projectId: project.id,
        projectName: project.name,
        reviewUrl: `/client/project/${project.id}`,
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Project sent for client verification and email logged',
      project: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to send review request' }, { status: 500 });
  }
}
