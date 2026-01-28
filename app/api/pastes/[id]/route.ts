import { NextRequest, NextResponse } from 'next/server';
import { getPasteForView } from '@/lib/pasteRepo';
import { getNow } from '@/lib/time';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const now = getNow(req);
  const result = await getPasteForView(params.id, now);

  if (!result) {
    return NextResponse.json(
      { error: 'Paste not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    content: result.content,
    remaining_views: result.remainingViews,
    expires_at: result.expiresAt,
  });
}

