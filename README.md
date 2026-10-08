# Squado

Find people who are still down. **Plans, not events. Squads, not attendees.**
Squado is a social planning web app built around spontaneous real-world plans (Navratri-flavoured: garba, pandal hopping, bhandara, chai, "Still Outside?").

## Features
- Browse as a guest: Home, Discover (filters + search, Live Now), plan details, event details.
- "I'm Down" (join request to a small squad) and "I'm Going" (events), with host review flow, capacity, Girls-only / Boys-only plans.
- Simulated "Continue with Google" (loading → success) → onboarding for new users, straight in for returning users, then back to the exact action the user started.
- 6-step onboarding (name, username, location, gender, age group, optional interests) with progress.
- Create Plan (day, time, approximate place, squad size, who can join, host controls, live preview), Still Outside flow, plan continuation ("Tonight's route"), Groups tab (squad list with last message, unread and plan context; full-screen chat on mobile, list | conversation on desktop), ratings/feedback, report/block/leave/cancel with confirmations, notifications.
- Poppins + Lucide icons (coloured by semantic tokens) + Twemoji for expressive emoji, light/dark theme, theme-aware opaque surfaces, fixed stroke-only doodle wallpaper, responsive bottom-bar / sidebar navigation, motion that respects `prefers-reduced-motion`.

## Tech stack
Plain HTML + CSS + JavaScript (no framework, no bundler, **zero npm dependencies**). Node ≥ 18 is only used for the dev server, build check and tests.
Runtime CDN assets (pinned): Lucide `0.469.0` (jsDelivr), Twemoji `15.1.0` SVGs (jsDelivr), Poppins (Google Fonts).

## Install / develop / build
```bash
npm install        # no dependencies; creates nothing but keeps tooling consistent
npm run dev        # http://localhost:5173  (PORT=… to change)
npm run build      # verifies every referenced file + JS syntax, outputs dist/
npm run preview    # serves dist/
npm test           # end-to-end flow test (simulated DOM)
```

## Project structure
```
index.html                 script/style manifest (load order matters: plain scripts share one scope)
public/assets/             logo, favicon, official Google "G" mark
src/styles/                base · icons (icon colour tokens) · doodle · nav · pages (motion, auth states)
src/js/
  constants/               activities + interests, form option lists
  data/                    users · plans · events · notifications · chats (all mock data)
  state/                   store (S/O + localStorage), selectors, chat, mockSim (simulated host replies)
  utils/                   icons (Lucide/Twemoji system), helpers, time, geo, discovery, validate, photo
  components/
    ui/ common/            avatar, toast/modal/confetti, chips; DoodleBackground, NotificationSheet
    navigation/            navigationConfig (shared items) + Navigation (one responsive <nav>)
    auth/ onboarding/      AuthGate (Continue with Google, loading, success); step renderers + Onboarding
    plans/ events/         planCard, nightRoute; eventCard
    squads/                GroupList, GroupChat (+ options/info sheets), FeedbackSheet
    profile/ safety/       trust badges + EditProfileSheet; ConfirmSheet
  layouts/                 AppLayout (shell)
  pages/                   home, explore, create, outside, posted, detail, event, groups (list | chat), profile, settings
  app/                     router, actions, auth (frontend-only auth + intent preservation), events, boot
tests/e2e.test.js          flow tests (guest → auth → onboarding → intent replay, create plan, search, confirmations, quality gates)
scripts/                   dev-server.js, build.js
```
There is no `hooks/` folder: without React there are no hooks; shared logic lives in `state/` and `utils/`.

## Environment variables
None required (see `.env.example`).

## Current scope
This repository contains **only the frontend**. All data is mock/local (`src/js/data`, `localStorage`), sign-in is a simulated UI state, and there is no backend, database, OAuth or API.

## Credits
Icons: [Lucide](https://lucide.dev) (ISC). Emoji art: [Twemoji](https://github.com/jdecked/twemoji) (CC-BY 4.0). Google "G" mark: official brand asset.
