import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { projects } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { generateId } from '@/lib/utils';

export async function GET() {
  try {
    const allProjects = await db.select().from(projects).orderBy(projects.order);
    return NextResponse.json(allProjects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const created = await db.insert(projects).values({
      id: generateId(),
      youtubeLink: body.youtubeLink,
      title: body.title,
      techStack: body.techStack,
      githubLink: body.githubLink,
      description: body.description,
      order: body.order || 0,
    }).returning();
    return NextResponse.json(created[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = await db.update(projects)
      .set({
        youtubeLink: body.youtubeLink,
        title: body.title,
        techStack: body.techStack,
        githubLink: body.githubLink,
        description: body.description,
        order: body.order,
      })
      .where(eq(projects.id, body.id))
      .returning();
    return NextResponse.json(updated[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    
    await db.delete(projects).where(eq(projects.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
