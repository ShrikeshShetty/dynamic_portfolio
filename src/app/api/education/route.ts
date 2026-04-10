import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { education } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { generateId } from '@/lib/utils';

export async function GET() {
  try {
    const allEducation = await db.select().from(education).orderBy(education.sortOrder);
    return NextResponse.json(allEducation);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch education' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const created = await db.insert(education).values({
      id: generateId(),
      level: body.level,
      stream: body.stream,
      collegeName: body.collegeName,
      academicYear: body.academicYear,
      cgpaOrPercentage: body.cgpaOrPercentage,
      sortOrder: body.sortOrder || 0,
    }).returning();
    return NextResponse.json(created[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create education' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const updated = await db.update(education)
      .set({
        level: body.level,
        stream: body.stream,
        collegeName: body.collegeName,
        academicYear: body.academicYear,
        cgpaOrPercentage: body.cgpaOrPercentage,
        sortOrder: body.sortOrder,
      })
      .where(eq(education.id, body.id))
      .returning();
    return NextResponse.json(updated[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update education' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
    
    await db.delete(education).where(eq(education.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete education' }, { status: 500 });
  }
}
