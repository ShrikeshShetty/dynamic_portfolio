import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { clientProjects } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { generateId } from '@/lib/utils';

export async function GET() {
  try {
    const allClientProjects = await db.select().from(clientProjects).orderBy(clientProjects.order);
    return NextResponse.json(allClientProjects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch client projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const created = await db.insert(clientProjects).values({
      id: generateId(),
      coverImageUrl: body.coverImageUrl,
      title: body.title,
      clientName: body.clientName,
      description: body.description,
      order: body.order || 0,
    }).returning();
    return NextResponse.json(created[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create client project' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = await db.update(clientProjects)
      .set({
        coverImageUrl: body.coverImageUrl,
        title: body.title,
        clientName: body.clientName,
        description: body.description,
        order: body.order,
      })
      .where(eq(clientProjects.id, body.id))
      .returning();
    return NextResponse.json(updated[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update client project' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    
    await db.delete(clientProjects).where(eq(clientProjects.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete client project' }, { status: 500 });
  }
}
