import { createClient } from '@supabase/supabase-js';

// Used by the frontend (page.js) to READ movies. Safe to expose (RLS protects it).
export const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

// Used by the webhook (route.js) to WRITE movies. NEVER expose this to the browser.
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);
