# Edusentiel Learning Observatory

An interactive browser-local demonstration with a forest, paper, and rust design system. Georgia and Verdana typography, square corners, no shadows or animated hover effects.

## Run

Requires Node.js 22.18 or later and npm (the CSV test runner uses native TypeScript stripping).

```sh
npm install
npm test
npm run typecheck
npm run build
npm run dev
```

Open http://localhost:3000.

## Product flow

Import the CSV template, adjust the review threshold, filter by student or course, open a student detail, and export the current view. CSV imports stay in memory in this browser tab. Reloading clears them. The initial 48 rows are synthetic.

Scores are supplied by the CSV. The app does not load the uploaded pickle, train the autoencoder, run inference, or claim any model accuracy. The attachment references could not be resolved in the authoring session.

## Design system

See design/tokens.json and app/globals.css. The MagicPath design compiled successfully and its stored preview was inspected. Figma destination: https://www.figma.com/design/btwi8xoeG7mLfx83bP4Cwa . The file was created, but editing was rejected by the session approval policy; it is blank.

## Deployment

Create a GitHub repository from this folder and import it into Vercel as a Next.js project. No environment variables are required. GitHub was connected, but no repository named Edusentiel or edudential was found in the account. The connector cannot create a repository, so a destination repository URL is needed. Vercel deployment was rejected by the session approval policy. No deployment is claimed.

## Verification limits

MagicPath compiled the React prototype and its stored preview was inspected. All eight CSV parsing and cohort tests passed. Offline Next.js dependency installation failed because @tailwindcss/postcss was not cached. Type checking and the Next.js production build were not completed. Browser interaction checks were blocked by browser security policy. Terms and Privacy copy are scoped to this local demonstration and require operator-specific review before real student data collection.

## Docs consulted

Context7: Next.js App Router client components; Tailwind v4 PostCSS setup; Recharts ResponsiveContainer and BarChart.
