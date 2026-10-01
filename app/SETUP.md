# Edusentinel

Replace your entire old `app` folder with this folder. Do not merge it into an old `app` folder: obsolete route files can override the new layout.

Keep the original `Ish's paper.pdf` directly beside this folder, at the repository root. Keep the model and Results folder outside this folder too.

From this folder, run `npm ci`, then `npm run build` and `npm start`.

For Vercel: set Root Directory to `app`, Framework Preset to Next.js, and enable access to files outside the root directory in the build. Use a fresh build after replacing the folder.

The UI is under `src/app`. The logo and artwork are exported from the original Figma brand file in `public`. Styles are ordinary CSS, imported directly by the root layout, so the design does not depend on Tailwind utility generation.

CSV data is processed locally in the browser. This interface does not execute the pickle model. Dataset labels are read from the CSV, and descriptive summaries are calculated locally.

## Design references

- Community reference: Educational Insights Dashboard by Silverthread Labs: https://www.figma.com/community/file/1501554553193657874/educational-insights-dashboard
- Original Edusentinel logo and learning atlas: https://www.figma.com/design/SBtq29hAV5ZyILISo3NlYU

The Community resource was used as a visual hierarchy reference. Its code, artwork, fonts, and purple palette were not copied. The website uses an original identity and artwork, with DM Sans provided by Fontsource under the SIL Open Font License.
