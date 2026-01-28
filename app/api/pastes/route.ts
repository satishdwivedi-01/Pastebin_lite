import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { createPaste } from '@/lib/pasteRepo';
import { getNow } from '@/lib/time';

export async function POST(req: NextRequest) {
  let body;

  try {
    body = await req.json();
    console.log(body);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { content, ttl_seconds, max_views } = body;

  if (typeof content !== 'string' || content.trim() === '') {
    return NextResponse.json({ error: 'Invalid content' }, { status: 400 });
  }

  if (
    ttl_seconds !== undefined &&
    (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)
  ) {
    return NextResponse.json({ error: 'Invalid ttl_seconds' }, { status: 400 });
  }

  if (
    max_views !== undefined &&
    (!Number.isInteger(max_views) || max_views < 1)
  ) {
    return NextResponse.json({ error: 'Invalid max_views' }, { status: 400 });
  }

  const id = randomUUID().replace(/-/g, '').slice(0, 12);
  const now = getNow(req);

  const expiresAt =
    ttl_seconds !== undefined
      ? new Date(now.getTime() + ttl_seconds * 1000)
      : null;

  await createPaste({
    id,
    content,
    expiresAt,
    maxViews: max_views ?? null,
  });

  return NextResponse.json(
    {
      id,
      url: `${req.nextUrl.origin}/p/${id}`,
    },
    { status: 201 }
  );
}
