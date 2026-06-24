[README.md](https://github.com/user-attachments/files/29307757/README.md)
# Pregnancy Dashboard

A responsive, mobile-first pregnancy dashboard with:

- Pregnancy Overview
- Baby Development
- Nursery & Baby Prep Checklist
- Budget Tracker
- Dark mode
- Local storage backup
- PWA support
- Supabase-ready schema

## Setup

1. Upload these files to your dashboard folder, such as `/baby_hub`.
2. Open `index.html` locally or deploy to GitHub Pages, Netlify, Vercel, or your domain host.
3. In Supabase, open SQL Editor and run `supabase-schema.sql`.
4. In `app.js`, replace:
   - `YOUR_SUPABASE_URL`
   - `YOUR_SUPABASE_ANON_KEY`
5. Add Supabase Auth before using cloud sync in production.

## Notes

The current starter app saves to localStorage immediately. Supabase schema and client placeholders are included so the database layer can be connected cleanly after authentication is configured.
