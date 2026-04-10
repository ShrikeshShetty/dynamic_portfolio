import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { certifications } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

// GET - Fetch all certifications
export async function GET() {
  try {
    const allCertifications = await db
      .select()
      .from(certifications)
      .orderBy(certifications.sortOrder);
    return NextResponse.json(allCertifications);
  } catch (error) {
    console.error('Error fetching certifications:', error);
    return NextResponse.json({ error: 'Failed to fetch certifications' }, { status: 500 });
  }
}

// POST - Create new certification
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const id = randomUUID();
    
    await db.insert(certifications).values({
      id,
      title: data.title,
      issuedBy: data.issuedBy,
      certificateUrl: data.certificateUrl,
      sortOrder: data.order || 0,
    });

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error creating certification:', error);
    return NextResponse.json({ error: 'Failed to create certification' }, { status: 500 });
  }
}

// PUT - Update certification
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { id, ...updateData } = data;

    await db
      .update(certifications)
      .set({
        title: updateData.title,
        issuedBy: updateData.issuedBy,
        certificateUrl: updateData.certificateUrl,
      })
      .where(eq(certifications.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating certification:', error);
    return NextResponse.json({ error: 'Failed to update certification' }, { status: 500 });
  }
}

// DELETE - Delete certification
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await db.delete(certifications).where(eq(certifications.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting certification:', error);
    return NextResponse.json({ error: 'Failed to delete certification' }, { status: 500 });
  }
}
