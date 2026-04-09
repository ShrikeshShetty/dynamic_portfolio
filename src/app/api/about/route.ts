import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { aboutSection } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const about = await db.select().from(aboutSection).limit(1);
    return NextResponse.json(about[0] || null);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch about section' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const existing = await db.select().from(aboutSection).limit(1);
    
    if (existing.length > 0) {
      const updated = await db.update(aboutSection)
        .set({
          imageUrl: body.imageUrl,
          description: body.description,
          birthday: body.birthday,
          phone: body.phone,
          location: body.location,
          degree: body.degree,
          email: body.email,
          projectCount: body.projectCount,
          technologyCount: body.technologyCount,
          codingYears: body.codingYears,
          updatedAt: new Date(),
        })
        .where(eq(aboutSection.id, existing[0].id))
        .returning();
      return NextResponse.json(updated[0]);
    } else {
      const created = await db.insert(aboutSection).values({
        imageUrl: body.imageUrl,
        description: body.description,
        birthday: body.birthday,
        phone: body.phone,
        location: body.location,
        degree: body.degree,
        email: body.email,
        projectCount: body.projectCount,
        technologyCount: body.technologyCount,
        codingYears: body.codingYears,
      }).returning();
      return NextResponse.json(created[0]);
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save about section' }, { status: 500 });
  }
}
