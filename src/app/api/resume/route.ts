import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { resume } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const resumeData = await db.select().from(resume).limit(1);
    return NextResponse.json(resumeData[0] || null);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch resume' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const existing = await db.select().from(resume).limit(1);
    
    if (existing.length > 0) {
      const updated = await db.update(resume)
        .set({
          fileUrl: body.fileUrl,
          fileName: body.fileName,
          updatedAt: new Date(),
        })
        .where(eq(resume.id, existing[0].id))
        .returning();
      return NextResponse.json(updated[0]);
    } else {
      const created = await db.insert(resume).values({
        fileUrl: body.fileUrl,
        fileName: body.fileName,
      }).returning();
      return NextResponse.json(created[0]);
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save resume' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const existing = await db.select().from(resume).limit(1);
    if (existing.length > 0) {
      await db.delete(resume).where(eq(resume.id, existing[0].id));
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete resume' }, { status: 500 });
  }
}
