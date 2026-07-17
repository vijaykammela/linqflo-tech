# LINQFLO site — fixes & updates

## What was fixed
- `style.css` had a broken embedded `<style>` block, duplicate `:root`/`*`/`html,body` resets, and conflicting rules — consolidated into one clean stylesheet.
- Hero title/subtitle were using "Inter" instead of the brand fonts (Poppins/Montserrat); `--hero-muted` was referenced but never defined.
- Header logo and footer logo had broken/invalid CSS (`180PX`, `width: 80` with no unit).
- The clients marquee had mismatched/extra closing `</div>` tags and wasn't wrapped in an overflow-hidden container, so the "infinite" loop wasn't actually clipped.
- The contact form was missing the `id="contact-form"` and `.form-group`/`.form-error`/`.form-success` markup that `main.js` expected — the JS was silently doing nothing.
- `main.js` had a dead `initParallax()` referencing a `.hero-bg img` element that doesn't exist in the markup — removed.
- Footer rebuilt as a proper 3-column layout (brand, navigation, contact) with a bottom bar for copyright + "Powered by Criador Labs" instead of everything being squeezed into one thin row.

## New structure
- `index.html` — Home (hero, services, clients marquee)
- `about.html` — new standalone About page
- `contact.html` — new standalone Contact page with Supabase-backed form
- Nav links now point to real pages instead of in-page anchors.

## Supabase setup (contact form)
1. Create a project at supabase.com.
2. Run `supabase-schema.sql` in the Supabase SQL editor — creates a `contact_submissions` table with RLS that only allows inserts from the public anon key (no public read access).
3. Open `js/supabase-config.js` and set `SUPABASE_URL` and `SUPABASE_ANON_KEY` from Project Settings → API.
4. That's it — `contact.html` already loads the Supabase JS CDN script and `main.js` inserts each submission.

Until you add real credentials, submissions are just logged to the browser console (with a warning) so the form still "works" during development.

## Thank-you animation
On successful submit, the form is replaced by an animated checkmark (SVG circle + check draw-on) with a "Message sent!" message and a "Send another message" button to reset.

## Note on assets
This zip only contains `index.html`, `about.html`, `contact.html`, `css/`, and `js/` — copy your existing `assets/` folder (logos, images, hero.webp) into this same directory structure, since image assets weren't part of the uploaded files.
