# Validation report

## Phase 1: Project and model review

Success criteria:
- Review the dataset schema, notebooks, and saved models.
- Record the implementation plan and human-readable project overview.

Result: Success. The schema, notebook workflow, and four deployed model artifacts were reviewed. The plan and project summary are in this directory.

## Phase 2: Frontend foundation

Success criteria:
- Create an organized Next.js app.
- Provide a clear, responsive visual experience.

Result: Success. The app is in `frontend/`, with a guided page, reusable visual patterns, and layouts for desktop and mobile screens.

## Phase 3: Prediction integration

Success criteria:
- Let users select one saved prediction task.
- Pass only the selected model's required features.
- Return the selected model's prediction in a clear API shape.

Result: Success. Fluency, dropout, and CEFR use the 14 features expected by their saved models. Accent prediction uses the 13 features expected by its saved model and does not ask for a current accent score. The API loads and runs only the selected model.

## Phase 4: Guided inputs and explainability

Success criteria:
- Ask for one prediction at a time.
- Break profile questions into short steps and explain each input.
- Explain what the output estimates and what it does not.
- Make the waiting state visually engaging without presenting fake progress.

Result: Success. The UI starts with four selectable prediction cards, then guides users through three stages with input descriptions and range cues. Results include a visual scale, plain-language interpretation, a recap of the profile used, and a note that the model does not identify individual causal factors. A looping animated status replaces the static loading state.

## Phase 5: Verification

Commands and checks:
- `npm run lint` — passed.
- `npm run build` — passed.
- Browser walkthrough — passed for accent and CEFR selection, the three-step flow, example profile, rendered result, and automatic scroll to the result.
- API smoke tests — passed for all four tasks.
- `npm audit --omit=dev` — passed with no production dependency vulnerabilities. npm reported four high-severity development dependency advisories.

Sample responses for the same example profile:
- Fluency: `{\"task\":\"fluency\",\"prediction\":77.7}`
- Dropout: `{\"task\":\"dropout\",\"prediction\":6}`
- CEFR: `{\"task\":\"cefr\",\"prediction\":\"B2\"}`
- Accent: `{\"task\":\"accent\",\"prediction\":6.7}`

Overall status: All success criteria are met.
