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
- `npm audit` — passed with no dependency vulnerabilities after removing the development-only Next lint plugin that brought in the vulnerable transitive dependency chain.

Sample responses for the same example profile:
- Fluency: `{\"task\":\"fluency\",\"prediction\":77.7}`
- Dropout: `{\"task\":\"dropout\",\"prediction\":6}`
- CEFR: `{\"task\":\"cefr\",\"prediction\":\"B2\"}`
- Accent: `{\"task\":\"accent\",\"prediction\":6.7}`

## Phase 6: Docker deployment packaging

Success criteria:
- Build the Next.js app in standalone mode for a compact production image.
- Include the Python inference runtime and saved models in the same container.
- Exclude data, notebooks, local instructions, and build dependencies from Docker build context.
- Document how to build locally and configure a single Render Docker service.

Result:
- Dockerfile, `.dockerignore`, standalone output configuration, and deployment instructions are in place.
- Python inference dependencies are pinned, including scikit-learn 1.6.1 to match the saved model artifacts.
- The container is configured to run the web process as the non-root `node` user.
- `npm run lint`, `npm run build`, and `npm audit` passed; the standalone server artifact was generated.
- An isolated environment installed the pinned Python requirements, passed `pip check`, and produced predictions from all four saved models.
- Linux binary wheels for all pinned requirements were confirmed available for the container's Python 3.11 runtime.
- The user built and ran the image locally. The homepage returned HTTP 200, and all four prediction API calls succeeded.
- The machine-wide Python environment has an unrelated Streamlit/Pillow version conflict; the isolated project environment has no broken requirements.
- Docker packaging was committed and pushed by the user as `ccab049`.

## Phase 7: Render deployment

Success criteria:
- Deploy the repository's root Dockerfile as a public Render web service.
- Confirm that the deployment becomes live.
- Verify the public page and all four model-backed prediction tasks.

Result: Success.
- Created the Render Web Service from the public GitHub repository on the `main` branch, using the Docker runtime and the root `Dockerfile`.
- Selected the Singapore region and Free compute after confirming the user preferred the free tier over the dashboard's default $7/month plan.
- Render built the Docker image and reported the service live at https://language-learning-prediction.onrender.com.
- The public homepage returned HTTP 200.
- Live prediction smoke tests passed: fluency `77.7`, dropout `6`, CEFR `B2`, accent `6.7`.
- The repository was connected as a public Git repository; automatic deploys are not enabled. Future changes need to be manually deployed from Render.
- Free services sleep after inactivity; a cold start can delay the first response by about 50 seconds or more.

Overall status:
- Phases 1–7 passed their defined success criteria.
- The app is deployed and its public page and prediction API have been smoke-tested.
