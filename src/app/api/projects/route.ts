import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const clientId = searchParams.get('clientId');

    let projects = await db.getProjects();

    if (clientId) {
      projects = projects.filter(p => p.clientId === clientId);
    }
    if (category && category !== 'All') {
      projects = projects.filter(p => p.category.toLowerCase() === category.toLowerCase() || p.serviceName.toLowerCase() === category.toLowerCase());
    }
    if (featured === 'true') {
      projects = projects.filter(p => p.featured);
    }

    return NextResponse.json({ success: true, count: projects.length, projects });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization') || req.cookies.get('genm_session')?.value;
    const user = getSessionUser(token);

    // If session is present and not admin, block; otherwise allow API creation
    if (user && user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required' }, { status: 403 });
    }

    const body = await req.json();

    if (!body.name) {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }

    const newProject = await db.createProject(body);

    // Notify client if clientEmail provided
    if (newProject.clientEmail) {
      db.logEmail({
        to: newProject.clientEmail,
        subject: `Welcome to Gen-M: Project ${newProject.name} Initialized`,
        template: 'project_created_client',
        data: { projectId: newProject.id, name: newProject.name }
      });
    }

    return NextResponse.json({ success: true, project: newProject }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create project' }, { status: 500 });
  }
}
