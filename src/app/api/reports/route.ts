import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createReport, getCompanyById, recalculateCompanyScore } from '@/lib/db';
import { auth } from '@/lib/auth';
import type { SketchCategory } from '@/types';

export async function POST(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized - Please sign in to submit a report' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { companyId, category, title, content, severity, isAnonymous = true } = body;

    // Validation
    if (!companyId || !category || !title || !content || !severity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (severity < 1 || severity > 5) {
      return NextResponse.json({ error: 'Severity must be between 1 and 5' }, { status: 400 });
    }

    // Verify company exists
    const company = getCompanyById.get(companyId);
    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const id = uuidv4();
    createReport.run(
      id,
      companyId,
      session.user.id,
      category as SketchCategory,
      title,
      content,
      severity,
      isAnonymous ? 1 : 0
    );

    // Recalculate company sketch score
    recalculateCompanyScore(companyId);

    return NextResponse.json({ id, message: 'Report submitted successfully' });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 });
  }
}

