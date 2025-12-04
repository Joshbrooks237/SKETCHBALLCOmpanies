import { NextRequest, NextResponse } from 'next/server';
import { getCompanyBySlug, getReportsByCompany } from '@/lib/db';
import type { Company, Report } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const company = getCompanyBySlug.get(slug) as Company | undefined;

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    const reports = getReportsByCompany.all(company.id) as Report[];

    return NextResponse.json({ company, reports });
  } catch (error) {
    console.error('Error fetching company:', error);
    return NextResponse.json({ error: 'Failed to fetch company' }, { status: 500 });
  }
}

