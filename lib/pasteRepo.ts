
import pool from "./db";

export async function createPaste(data: {
  id: string;
  content: string;
  expiresAt: Date | null;
  maxViews: number | null;
}) {
  const { id, content, expiresAt, maxViews } = data;

  await pool.query(
    `
    INSERT INTO pastes (id, content, expires_at, max_views)
    VALUES ($1, $2, $3, $4)
    `,
    [id, content, expiresAt, maxViews]
  );
}

export async function getPasteForView(
  id: string,
  now: Date
) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      `
      SELECT *
      FROM pastes
      WHERE id = $1
      FOR UPDATE
      `,
      [id]
    );

    if (rows.length === 0) {
      await client.query('ROLLBACK');
      return null;
    }

    const paste = rows[0];

    if (paste.expires_at && paste.expires_at <= now) {
      await client.query('ROLLBACK');
      return null;
    }

    if (
      paste.max_views !== null &&
      paste.views_used >= paste.max_views
    ) {
      await client.query('ROLLBACK');
      return null;
    }

    await client.query(
      `
      UPDATE pastes
      SET views_used = views_used + 1
      WHERE id = $1
      `,
      [id]
    );

    await client.query('COMMIT');

    return {
      content: paste.content,
      remainingViews:
        paste.max_views === null
          ? null
          : paste.max_views - (paste.views_used + 1),
      expiresAt: paste.expires_at,
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

