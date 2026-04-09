import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { heroSection } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const hero = await db.select().from(heroSection).limit(1);
    return NextResponse.json(hero[0] || null);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch hero section' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const existing = await db.select().from(heroSection).limit(1);
    
    if (existing.length > 0) {
      const updated = await db.update(heroSection)
        .set({
          introLine: body.introLine,
          role: body.role,
          description: body.description,
          email: body.email,
          github: body.github,
          linkedin: body.linkedin,
          resumeUrl: body.resumeUrl,
          updatedAt: new Date(),
        })
        .where(eq(heroSection.id, existing[0].id))
        .returning();
      return NextResponse.json(updated[0]);
    } else {
      const created = await db.insert(heroSection).values({
        introLine: body.introLine,
        role: body.role,
        description: body.description,
        email: body.email,
        github: body.github,
        linkedin: body.linkedin,
        resumeUrl: body.resumeUrl,
      }).returning();
      return NextResponse.json(created[0]);
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save hero section' }, { status: 500 });
  }
}
