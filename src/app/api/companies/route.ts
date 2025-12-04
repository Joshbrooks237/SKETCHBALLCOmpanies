import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getAllCompanies, searchCompanies, createCompany } from '@/lib/db';
import { auth } from '@/lib/auth';
import type { Company } from '@/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  try {
    let companies: Company[];
    
    if (query) {
      const searchTerm = `%${query}%`;
      companies = searchCompanies.all(searchTerm, searchTerm, searchTerm) as Company[];
    } else {
      companies = getAllCompanies.all() as Company[];
    }

    return NextResponse.json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, industry, location, website } = body;

    if (!name) {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const id = uuidv4();
    createCompany.run(id, name, slug, industry || null, location || null, website || null);

    return NextResponse.json({ id, slug, message: 'Company created successfully' });
  } catch (error) {
    console.error('Error creating company:', error);
    return NextResponse.json({ error: 'Failed to create company' }, { status: 500 });
  }
}

