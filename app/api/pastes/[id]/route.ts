// app/api/pastes/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPasteForView } from '@/lib/pasteRepo';
import { getNow } from '@/lib/time';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ await params

  const now = getNow(req);
  const result = await getPasteForView(id, now);

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


