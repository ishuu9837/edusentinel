# Edusentiel / Learning in Context

A Forma-inspired interactive research interface. Oversized typography, layered rectangular panels, full-width sections, a moving text band with pause controls, and scroll reveals. Motion stops under reduced-motion preferences. No hover animations, icons, gradients, shadows, rounded cards, testimonials, or pricing tiers.

## Run

Node.js 22.18 or later is recommended.

```sh
npm install
npm test
npm run typecheck
npm run build
npm run dev
```

## Test with your dataset

Click **Import features_df.csv** and select the original file. All 17 columns are accepted directly, in any order. The required columns are student_id plus the six percentage metrics. Candidate tier, supplied label, severity, problem count, inactive weeks, and is_anomaly are optional. No reconstruction-error field is required.

The importer processes records in memory. Names, email addresses, roll numbers, and candidate IDs are discarded. No raw dataset is bundled into the application or source archive. Reloading clears imported records. Exports include pseudonymous student IDs, six learning metrics, and supplied annotations.

The initial snapshot contains verified aggregates from the attached file: 1,019 rows, 120 supplied anomaly labels, and six feature averages. Import the file to activate student searches, tier and label filtering, minimum feature values, distribution charts, detail dialogs, sorting, pagination, and exports.

## Model scope

The supplied CSV contains no reconstruction errors. Anomaly flags and categories are read from the file, not predicted by an autoencoder. No accuracy or other model performance is claimed.

## Verification

The same parser used by the UI was run against the actual uploaded file. It accepted all 1,019 records, returned 120 anomaly-labelled rows, and confirmed 30 Disengaged rows. Personal identifier columns were excluded. Exports produced 1,019 data rows plus the header. All 11 parser and filter tests passed; tests are in tests/features.test.mjs.

MagicPath compiled the prototype. Next.js dependency installation, TypeScript checking, and the production build passed. Browser testing with the actual CSV confirmed import of 1,019 rows, filtering to 120 anomaly-labelled rows and 30 Disengaged rows, correct student detail values, and chart switching. The browser console reported no warnings or errors. Mobile layout was verified at a 390-pixel viewport and has no document-level horizontal overflow. CSV export generation passed tests; browser download completion was not verified because the browser did not report a download event. GitHub, Figma, and Vercel handoffs remain incomplete.

## References

Layout reference: https://forma-fluid-demo.squarespace.com/ . Brand colours, content, panels, and interactions were adapted for Edusentiel. Context7 docs were consulted in the initial implementation for Next.js, Tailwind v4, and Recharts.

## Research paper

The Research Paper section links to `/edusentiel-paper.pdf` with a download link and a separate reading link. This is an unchanged copy of the repository's `Ish's paper.pdf`. Replace the public copy when publishing a revised paper.
