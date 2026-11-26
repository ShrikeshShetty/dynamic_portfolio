import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { professionalExperiences } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

// GET - Fetch all professional experiences
export async function GET() {
  try {
    const allExperiences = await db
      .select()
      .from(professionalExperiences)
      .orderBy(professionalExperiences.sortOrder);
    return NextResponse.json(allExperiences);
  } catch (error) {
    console.error('Error fetching professional experiences:', error);
    return NextResponse.json({ error: 'Failed to fetch professional experiences' }, { status: 500 });
  }
}

// POST - Create new professional experience
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const id = randomUUID();

    await db.insert(professionalExperiences).values({
      id,
      companyName: data.companyName,
      companyLogo: data.companyLogo || null,
      role: data.role,
      responsibilities: data.responsibilities,
      startDate: data.startDate || '',
      endDate: data.isCurrent ? '' : (data.endDate || ''),
      isCurrent: Boolean(data.isCurrent),
      offerLetterUrl: data.offerLetterUrl || null,
      experienceLetterUrl: data.isCurrent ? null : (data.experienceLetterUrl || null),
      sortOrder: data.order || 0,
    });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error creating professional experience:', error);
    return NextResponse.json({ error: 'Failed to create professional experience' }, { status: 500 });
  }
}

// PUT - Update professional experience
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await db
      .update(professionalExperiences)
      .set({
        companyName: updateData.companyName,
        companyLogo: updateData.companyLogo || null,
        role: updateData.role,
        responsibilities: updateData.responsibilities,
        startDate: updateData.startDate || '',
        endDate: updateData.isCurrent ? '' : (updateData.endDate || ''),
        isCurrent: Boolean(updateData.isCurrent),
        offerLetterUrl: updateData.offerLetterUrl || null,
        experienceLetterUrl: updateData.isCurrent ? null : (updateData.experienceLetterUrl || null),
      })
      .where(eq(professionalExperiences.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating professional experience:', error);
    return NextResponse.json({ error: 'Failed to update professional experience' }, { status: 500 });
  }
}

// DELETE - Delete professional experience
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await db.delete(professionalExperiences).where(eq(professionalExperiences.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting professional experience:', error);
    return NextResponse.json({ error: 'Failed to delete professional experience' }, { status: 500 });
  }
}
