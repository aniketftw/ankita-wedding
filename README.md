# Ankita & Durgesh Wedding Invitation

React + Vite starter for a pastel floral luxury wedding invitation.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Build

```bash
npm run build
npm run preview
```

## Included in this first frontend milestone

- Responsive invitation landing page
- Motion-based entrance and scroll animations
- Reduced-motion support
- Four events for December 2026
- Countdown to the wedding at 8 PM IST
- Expandable event cards with Maps search links
- Calendar downloads
- Guestbook visual preview (temporary local React state only)
- Optional music control wired to a local asset path

## Before using the music toggle

Add a licensed or family-owned MP3 at:

`public/music/wedding-instrumental.mp3`

The music control is off by default. If the file is absent, the button cannot play audio; add the file before enabling it for guests.

## Important: guestbook is not connected yet

The current guestbook is only a visual prototype. It does not persist notes to a database. The next implementation step is to configure Supabase, create the table and policies, and replace the local preview handler with a real insert/select flow.

Copy `.env.example` to `.env.local` only when configuring Supabase. Use a Supabase publishable key with Row Level Security. Never expose a service-role or secret key in a browser bundle.

## Verify before launch

- Confirm venue spellings and exact Google Maps listings/pins.
- Review event dates and the countdown in `Asia/Kolkata`.
- The calendar export currently assumes a two-hour event duration; confirm or change this before distributing calendar files.
- Add approved artwork and the licensed music file.
