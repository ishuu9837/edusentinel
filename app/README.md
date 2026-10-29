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

## Real trained-model inference

The **Student explorer** includes a **Score a student with the trained model** panel. You can enter eight feature values manually or open a student record and score its values. Six percentage values and two nonnegative integer activity counts are mandatory. The **Run autoencoder prediction** action sends only these eight numerical features to `POST /api/predict`.

The endpoint runs the original trained NumPy autoencoder's exported weights and biases, its fitted Min-Max scaler, and the original 90th-percentile threshold, all exported from the existing `autoencoder_model.pkl`. This is not a new or retrained model, and the endpoint does not unpickle untrusted user input.

Example request (from the original project notebook):

```bash
curl -X POST http://localhost:3000/api/predict -H 'Content-Type: application/json' -d '{"pseudocode_attendance_rate":50,"pseudocode_avg_score":23,"coding_practice_solved_pct":23,"coding_test_overall_score":1,"coding_test_attendance":98,"weekly_score_consistency":99,"practice_problems_solved":1,"weeks_zero_activity":1}'
```

Expected example: reconstruction error approximately `0.281855`, severity `MEDIUM`. The saved threshold is approximately `0.145438`; `NORMAL` is at or below this value, `MEDIUM` is above it through twice the threshold, and `HIGH` is above twice the threshold.

**Model inputs: eight.** Six percentages are visualized in the explorer; `practice_problems_solved` and `weeks_zero_activity` are additional model inputs. Existing CSV annotations remain **supplied labels**, not generated predictions. CSV import stays client-side; only the eight explicitly submitted numerical values are sent to the prediction endpoint. The score is an anomaly signal for human review, not an assessment of a student's ability or intent.

## Verification and limits

The exported inference arithmetic was independently checked against the original notebook's published example and reproduces the expected score and severity. It has not been subjected to a complete deployed-endpoint integration test. The root README's historical evaluation metrics are reported from the notebook, not rerun by this web app.
