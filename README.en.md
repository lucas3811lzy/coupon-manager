 Coupon Manager

A mobile-friendly coupon tracker built with Vue 3 and Vite. It helps manage Macau coupon balances, activity periods, and usage records in one place. App data is stored locally in your browser.

## Features

- Track coupons across seven banks and payment services.
- View balances and activity periods at a glance.
- Record coupon usage and review statistics.
- Save data in browser `localStorage`.
- Use the responsive interface on mobile and desktop.

## Requirements

- Node.js 18 or later
- npm

## Getting started

```bash
npm install
npm run dev
```

Vite prints the local development URL in the terminal (usually `http://localhost:5173`).

## Available commands

```bash
npm run dev      # Start the development server
npm run build    # Build the production app into dist/
npm run preview  # Preview the production build locally
```

## Project structure

```text
.
├── index.html
├── src/
│   ├── App.vue          # Main screen and shared styles
│   ├── main.js          # Vue application entry point
│   ├── store.js         # App state and local persistence
│   ├── assets/          # Bank and payment service logos
│   └── components/      # Screen sections, dialogs, and controls
├── package.json
├── vite.config.js
└── wrangler.jsonc       # Cloudflare Pages configuration
```

## Deployment

Build the app, then deploy the generated `dist/` directory to a static host such as Cloudflare Pages. The included `wrangler.jsonc` points Wrangler at `dist/`.

## Data and privacy

Coupon data is stored in this browser's local storage. It is not automatically synchronized between devices or browsers. Clearing the browser's site data can remove saved records.

## Source code

Welcome to collaborate or contribute for learning purposes.

## Development structure

State is managed by the `coupon-manager` Pinia store in `src/store.js`.
Run `npm run dev` and open Vue Devtools to inspect the Pinia state and actions.

Components are grouped by responsibility:
- `common/`: clock and toast
- `coupons/`: bank selector, totals and coupon list
- `activity/`: activity banner and activity dialog
- `dialogs/`: help, tutorial and coupon editing
- `views/`: statistics and spending planner

App Store destinations are maintained in `src/config/bankApps.js`.
Setting a destination URL to `null` uses the bank-name search URL instead.
Each provider also has a manual search fallback because browser cross-origin
restrictions prevent reliable detection of an unavailable App Store listing.
The planner assumes separate qualifying purchases are permitted, with each
coupon requiring three times its face value in spending. Verify merchant rules
before splitting purchases. App Store links do not initiate payments.

[View this project on GitHub](https://github.com/lucas3811lzy/coupon-manager)
