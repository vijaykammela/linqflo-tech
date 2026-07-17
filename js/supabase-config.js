/* =========================================================
   LINQFLO — Supabase configuration
   -------------------------------------------------------
   1. Create a project at https://supabase.com
   2. Go to Project Settings → API and copy the Project URL
      and the "anon public" key into the two constants below.
   3. In the SQL editor, run the table + policy script from
      supabase-schema.sql (included alongside this file) to
      create the `contact_submissions` table.
   ========================================================= */

const SUPABASE_URL = 'YOUR_SUPABASE_PROJECT_URL'; // e.g. https://xxxxx.supabase.co
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

// Exposed globally so main.js can use it without a bundler.
window.supabaseClient = (SUPABASE_URL.startsWith('http') && SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY')
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

if (!window.supabaseClient) {
  console.warn(
    '[LINQFLO] Supabase is not configured yet — update js/supabase-config.js with your project URL and anon key. ' +
    'Form submissions will be logged to the console instead of saved.'
  );
}
