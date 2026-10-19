# Project history and decisions

## What this document covers

This is the end-to-end record of the requested work on the Language Learning Prediction project: the original project brief, interface feedback, implementation and deployment decisions, checks performed, and the final live service. It complements the notebook-focused [project summary](./PROJECT_SUMMARY.md), the implementation [plan](./PROJECT_PLAN.md), and the detailed [validation report](./VALIDATION_REPORT.md).

## Project at a glance

The project uses the Kaggle dataset *Language Learning to Fluency — Who Gets There* to explore patterns in language-learning outcomes. The notebooks document dataset inspection, feature selection, and model training. Four saved scikit-learn models power the interface:

- **Fluency:** estimates the model's probability that a learner reaches B2-or-higher fluency.
- **Dropout:** estimates the model's probability that a learner drops out before reaching B2.
- **CEFR:** predicts a proficiency category from A0 through C2.
- **Accent:** estimates the dataset's accent native-likeness score.

These are estimates based on patterns in the training data. They are not guarantees, diagnoses, or explanations of what caused an individual learner's outcome. Study-hours prediction was explored in the notebooks, but there is no saved study-hours model connected to the interface.

## Work requested and decisions made

### 1. Understand the existing project before building the interface

**Request:** Read the repository guidance in `AGENTS.md`, study the notebooks and saved models, document the project in plain language, and create a plan and phase-based success criteria before implementation.

**Decision and work:** Kept the existing notebooks and model artifacts as the source of truth rather than retraining models or changing their scope. Reviewed the dataset fields, notebook progression, and model features; recorded the implementation plan, project summary, and phase validation in this reports directory.

**Outcome:** The project has a documented notebook-to-interface path. The current interface exposes the four tasks with saved models and does not present the unimplemented study-hours task as available.

### 2. Build a guided, understandable prediction interface

**Request:** Create a modern Next.js interface with a maintainable structure and a polished, approachable visual design. Ask for meaningful inputs and present predictions in an engaging way rather than showing unexplained raw values.

**Initial implementation:** Added the Next.js app under `frontend/`, wired the prediction API to the saved model files, and built a visual results experience.

**User feedback and decision:** The first form asked for all profile inputs at once, which felt overwhelming. Changed the interaction so the user first selects a prediction task, then answers only that task's relevant questions in short guided stages. Added plain-language descriptions and range cues to explain the inputs, a recap of the submitted profile, contextual explanations and visual scales for results, and an animated waiting state. The loading animation indicates that work is happening without inventing a progress percentage.

**Feature compatibility decision:** Fluency, dropout, and CEFR models require 14 features; accent requires 13 and does not use `accent_nativelike` as an input. The API supplies the features expected by the selected model, rather than forcing every task through one identical input set.

**Outcome:** Users can explore one prediction at a time, understand what the questions mean, and see an accessible interpretation of the model output. The interface explicitly avoids claiming that a model identifies individual causal factors.

### 3. Review repository hygiene and dependency security

**Request:** Before committing the interface, check whether generated or local files should be excluded from Git; fix the dependency security issue safely; explain deployment choices.

**Decisions and work:**

- Added ignore rules for local `AGENTS.md` files. Existing rules already excluded datasets, `node_modules`, and Next.js build output.
- Addressed high-severity development dependency advisories by removing the development-only `@next/eslint-plugin-next` dependency rather than accepting npm's proposed major-version downgrade. The TypeScript ESLint rules remained enabled.
- Verified lint, production build, and `npm audit`; the audit reported zero vulnerabilities after the change.
- Discussed deployment options and chose a single Docker-based service on Render as the straightforward path that can run both Next.js and Python model inference. No cloud service was created during this evaluation stage.

**Outcome:** The interface and dependency changes were committed and pushed by the user before the separate Docker deployment work.

### 4. Package the app and models as a Docker service

**Request:** Proceed with deployment preparation after the user selected the Docker approach.

**Decisions and work:**

- Added a multi-stage root-level Dockerfile because the runtime needs the Next.js app, the Python inference script, and the root `models/` directory together.
- Enabled Next.js standalone output to make the runtime image smaller; copied static assets explicitly because standalone output does not include `.next/static`.
- Pinned the Python inference dependencies, including scikit-learn 1.6.1, to match the version used to save the model artifacts.
- Added `.dockerignore` rules for datasets, notebooks, local instructions, dependencies, and generated files.
- Documented the local Docker and Render setup in the README.

**Verification decision:** Initially, the Docker Engine was unavailable in the development environment, so the Docker image itself could not be verified at that point. The application build, Python package installation, and all model predictions were checked separately instead. Once the user ran the built image locally and confirmed the Next.js server was ready, verified its HTTP homepage and all four prediction endpoints.

**Outcome:** The Docker deployment changes were committed and pushed by the user as `ccab049` (`Project moved to docker`). The local running container returned HTTP 200 and these example responses: fluency `77.7`, dropout `6`, CEFR `B2`, accent `6.7`.

### 5. Deploy to Render

**Request:** Proceed with deployment after local container verification.

**Decisions and work:**

- Selected Render's **Web Service** with the **Docker** runtime, using the repository's root Dockerfile and `main` branch.
- Connected the public GitHub repository as a public repository source because the Git-provider connection was not available in the dashboard flow. Consequently, this setup does not provide automatic deploys; future changes can be deployed manually from the Render dashboard.
- Selected the **Free** compute plan only after confirming the user preferred it over the dashboard's default $7/month Starter plan. It uses 0.1 CPU and 512 MB RAM. Free services sleep when idle; the first request after sleeping can take about 50 seconds or more. The public web service is accessible to anyone with its URL.
- Selected the Singapore region as the closest offered region to the user's location.
- Deployed the pushed `main` branch. Render successfully built the Docker image and marked the service live.

**Live application:** [language-learning-prediction.onrender.com](https://language-learning-prediction.onrender.com)

**Render dashboard:** [service overview](https://dashboard.render.com/web/srv-dbatgjjncjis73acakgg)

**Outcome:** The public homepage returned HTTP 200. All four prediction API calls returned valid results from the live service:

| Task | Example result |
|---|---:|
| Fluency | 77.7 |
| Dropout | 6 |
| CEFR | B2 |
| Accent | 6.7 |

These are smoke-test outputs for the same example profile, not claims about an actual learner.

## Where to find the project

- [README](../README.md): short project introduction and instructions to run locally or build the Docker image.
- [Project plan](./PROJECT_PLAN.md): original phases and success criteria for the interface work.
- [Project summary](./PROJECT_SUMMARY.md): dataset, notebook workflow, features, and saved model overview.
- [Validation report](./VALIDATION_REPORT.md): phase-by-phase criteria, test commands, and results, including container and live deployment checks.
- `frontend/app/`: Next.js interface and prediction API.
- `frontend/scripts/predict.py`: Python model inference entry point.
- `models/`: saved model artifacts.
- `notebooks/`: exploratory analysis and model-development history.

## Current operating notes

- The live app is on Render's free tier. Expect a cold-start delay after inactivity; upgrading to a paid plan would keep it running but incurs the displayed monthly charge.
- The repository was connected as a public Git repository, so pushes do not trigger automatic deploys. Use **Manual Deploy** in the Render dashboard to publish later changes.
- The app, API, and model artifacts have been verified locally and on Render. Keep model dependencies compatible with the version used to train and serialize the saved artifacts.
- The platform, not the application, manages public HTTPS and the assigned service port.
