import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { internships } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

// GET - Fetch all internships
export async function GET() {
  try {
    const allInternships = await db
      .select()
      .from(internships)
      .orderBy(internships.sortOrder);
    return NextResponse.json(allInternships);
  } catch (error) {
    console.error('Error fetching internships:', error);
    return NextResponse.json({ error: 'Failed to fetch internships' }, { status: 500 });
  }
}

// POST - Create new internship
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const id = randomUUID();
    
    await db.insert(internships).values({
      id,
      companyLogo: data.companyLogo,
      companyName: data.companyName,
      role: data.role,
      projectLead: data.projectLead,
      isTeamProject: data.isTeamProject || false,
      teamSize: data.teamSize || null,
      offerLetterUrl: data.offerLetterUrl,
      certificateUrl: data.certificateUrl,
      lorUrl: data.lorUrl || null,
      sortOrder: data.order || 0,
    });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error creating internship:', error);
    return NextResponse.json({ error: 'Failed to create internship' }, { status: 500 });
  }
}

// PUT - Update internship
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    await db
      .update(internships)
      .set({
        companyLogo: updateData.companyLogo,
        companyName: updateData.companyName,
        role: updateData.role,
        projectLead: updateData.projectLead,
        isTeamProject: updateData.isTeamProject,
        teamSize: updateData.teamSize,
        offerLetterUrl: updateData.offerLetterUrl,
        certificateUrl: updateData.certificateUrl,
        lorUrl: updateData.lorUrl,
      })
      .where(eq(internships.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating internship:', error);
    return NextResponse.json({ error: 'Failed to update internship' }, { status: 500 });
  }
}

// DELETE - Delete internship
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await db.delete(internships).where(eq(internships.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting internship:', error);
    return NextResponse.json({ error: 'Failed to delete internship' }, { status: 500 });
  }
}
