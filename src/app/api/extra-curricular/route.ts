import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { extraCurricular } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { generateId } from '@/lib/utils';

export async function GET() {
  try {
    const allActivities = await db.select().from(extraCurricular).orderBy(extraCurricular.sortOrder);
    return NextResponse.json(allActivities);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch extra curricular activities' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const created = await db.insert(extraCurricular).values({
      id: generateId(),
      logo: body.logo,
      title: body.title,
      header: body.header,
      description: body.description,
      sortOrder: body.sortOrder || 0,
    }).returning();
    return NextResponse.json(created[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create extra curricular activity' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = await db.update(extraCurricular)
      .set({
        logo: body.logo,
        title: body.title,
        header: body.header,
        description: body.description,
        sortOrder: body.sortOrder,
      })
      .where(eq(extraCurricular.id, body.id))
      .returning();
    return NextResponse.json(updated[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update extra curricular activity' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    
    await db.delete(extraCurricular).where(eq(extraCurricular.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete extra curricular activity' }, { status: 500 });
  }
}
