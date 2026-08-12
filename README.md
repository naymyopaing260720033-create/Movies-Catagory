# Movie Catalog

Telegram private channel movies → TMDB metadata → Vercel website.

## Environment Variables (set these in Vercel Project Settings → Environment Variables)

| Name | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API Keys → API URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase → Settings → API Keys → Publishable key |
| `SUPABASE_URL` | same as above (server-side copy) |
| `SUPABASE_SECRET_KEY` | Supabase → Settings → API Keys → Secret key |
| `TMDB_API_KEY` | themoviedb.org → Settings → API → API Key (v3) |
| `TELEGRAM_CHANNEL_ID` | Your channel's numeric ID, e.g. `-1001234567890` |
| `TELEGRAM_WEBHOOK_SECRET` | Any random string you make up yourself, e.g. `myRandomSecret123` |

## After deploying to Vercel

Register the webhook so Telegram sends channel posts to your app. Replace the
placeholders and run this once (from any terminal, or a site like reqbin.com):

```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://<YOUR_VERCEL_DOMAIN>/api/telegram-webhook&secret_token=<TELEGRAM_WEBHOOK_SECRET>
```

Then post a movie (with a caption like `Inception (2010)`) in the channel and check
the website — it should appear within a few seconds.
