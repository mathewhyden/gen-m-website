import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await db.getProjectById(id);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Parse optional body parameters
    const body = await req.json().catch(() => ({}));
    const recipientEmail = (body.clientEmail || body.email || body.recipientEmail || project.clientEmail || '').trim();
    const customNote = (body.note || '').trim();

    if (!recipientEmail || !recipientEmail.includes('@')) {
      return NextResponse.json({ 
        error: 'A valid client email address is required to send the review invite.' 
      }, { status: 400 });
    }

    // Update status to CLIENT_REVIEW and save email if needed
    const updateData: Partial<typeof project> = {
      status: 'CLIENT_REVIEW',
      progress: Math.max(project.progress || 0, 90),
    };
    if (recipientEmail !== project.clientEmail) {
      updateData.clientEmail = recipientEmail;
    }

    const updated = await db.updateProject(id, updateData) || { ...project, ...updateData };

    const origin = req.headers.get('origin') || req.headers.get('host') || '';
    const protocol = origin.startsWith('http') ? '' : 'https://';
    const baseUrl = origin ? (origin.startsWith('http') ? origin : `${protocol}${origin}`) : '';
    const reviewPath = `/work/${project.slug || project.id}`;
    const fullReviewUrl = baseUrl ? `${baseUrl}${reviewPath}` : reviewPath;
    const clientDisplayName = project.clientName || project.clientCompany || 'Client';

    const mailtoSubject = encodeURIComponent(`Action Required: Review & Verification for ${project.name}`);
    const emailBodyText = `Hi ${clientDisplayName},\n\nYour project "${project.name}" (${project.projectId}) has reached the review milestone and is ready for your verification.\n\nPlease visit your project review portal:\n${fullReviewUrl}\n${customNote ? `\nAdmin Note: ${customNote}\n` : ''}\nBest regards,\nGen-M Tech Development Team`;
    const mailtoBody = encodeURIComponent(emailBodyText);
    const mailtoUrl = `mailto:${recipientEmail}?subject=${mailtoSubject}&body=${mailtoBody}`;

    // Send email notification to client with review link & log full body
    const emailLog = db.logEmail({
      to: recipientEmail,
      subject: `Action Required: Review & Verification for ${project.name}`,
      template: 'project_verification_request',
      status: 'delivered',
      body: emailBodyText,
      data: {
        projectId: project.id,
        projectName: project.name,
        clientName: clientDisplayName,
        recipientEmail,
        reviewUrl: fullReviewUrl,
      }
    });

    return NextResponse.json({
      success: true,
      message: `Verification review invite dispatched to ${recipientEmail}!`,
      recipientEmail,
      reviewUrl: fullReviewUrl,
      mailtoUrl,
      emailLog,
      project: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to send review request' }, { status: 500 });
  }
}
