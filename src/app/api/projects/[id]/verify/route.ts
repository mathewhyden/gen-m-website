import { NextRequest, NextResponse } from 'next/server';
import { POST as reviewPost } from '../review/route';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return reviewPost(req, context);
}
