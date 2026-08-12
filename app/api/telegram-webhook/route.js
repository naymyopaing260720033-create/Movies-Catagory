import { supabaseAdmin } from '../../../lib/supabaseClient';

export async function POST(req) {
  // 1. Verify this request really came from Telegram (secret token we set in setWebhook)
  const secret = req.headers.get('x-telegram-bot-api-secret-token');
  if (secret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body = await req.json();

  // Channel posts arrive as `channel_post`, not `message`
  const post = body.channel_post || body.message;
  if (!post) {
    return Response.json({ ok: true }); // nothing to do, but tell Telegram we received it
  }

  // 2. Make sure the post came from OUR channel (ignore everything else)
  const chatId = String(post.chat.id);
  if (chatId !== process.env.TELEGRAM_CHANNEL_ID) {
    return Response.json({ ok: true });
  }

  // 3. Get the caption/text (this is where the movie name should be)
  const caption = post.caption || post.text || '';
  if (!caption) {
    return Response.json({ ok: true });
  }

  // Take the first line, strip a trailing (2024)-style year for a cleaner search query
  const rawTitle = caption.split('\n')[0].trim();
  const searchTitle = rawTitle.replace(/\(\d{4}\)/, '').trim();

  // 4. Search TMDB for this movie
  let movie = null;
  try {
    const tmdbRes = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(searchTitle)}`
    );
    const tmdbData = await tmdbRes.json();
    movie = tmdbData.results?.[0] || null;
  } catch (err) {
    console.error('TMDB search failed:', err);
  }

  // 5. Build the Telegram deep link back to this post
  // Private channel IDs look like -100XXXXXXXXXX; the link format needs just XXXXXXXXXX
  const internalId = chatId.startsWith('-100') ? chatId.slice(4) : chatId;
  const telegramLink = `https://t.me/c/${internalId}/${post.message_id}`;

  // 6. Save to Supabase
  const { error } = await supabaseAdmin.from('movies').insert({
    tmdb_id: movie?.id ?? null,
    title: movie?.title ?? searchTitle,
    original_title: movie?.original_title ?? null,
    poster_path: movie?.poster_path ?? null,
    overview: movie?.overview ?? null,
    release_date: movie?.release_date || null,
    telegram_message_id: post.message_id,
    telegram_link: telegramLink,
    raw_caption: caption,
  });

  if (error) {
    console.error('Supabase insert failed:', error);
    return Response.json({ ok: false, error: error.message }, { status: 500 });
  }

  return Response.json({ ok: true });
}
