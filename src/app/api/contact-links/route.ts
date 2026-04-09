import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { contactLinks } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { generateId } from '@/lib/utils';

export async function GET() {
  try {
    const links = await db.select().from(contactLinks).orderBy(contactLinks.order);
    return NextResponse.json(links);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch contact links' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const created = await db.insert(contactLinks).values({
      id: generateId(),
      type: body.type,
      url: body.url,
      displayText: body.displayText,
      order: body.order || 0,
    }).returning();
    return NextResponse.json(created[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create contact link' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = await db.update(contactLinks)
      .set({
        type: body.type,
        url: body.url,
        displayText: body.displayText,
        order: body.order,
      })
      .where(eq(contactLinks.id, body.id))
      .returning();
    return NextResponse.json(updated[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update contact link' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    
    await db.delete(contactLinks).where(eq(contactLinks.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete contact link' }, { status: 500 });
  }
}
