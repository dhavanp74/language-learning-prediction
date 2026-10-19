
# Language Learning Outcome Prediction

## Overview

This project explores machine-learning predictions of language-learning outcomes using the *Language Learning to Fluency — Who Gets There* dataset from Kaggle. The notebooks document data exploration, feature decisions, and training. Four saved models are available for fluency, dropout, CEFR level, and accent prediction.

## Objectives

The project work explores five prediction tasks. The current interface uses the four outcomes with saved model artifacts.

### 1. Classification

- **Fluency Prediction:** Predict whether a learner reaches B2 or higher proficiency.
- **Learner Dropout Prediction:** Predict whether a learner drops out before reaching B2.
- **CEFR Proficiency Classification:** Predict a learner's proficiency category: A0, A1, A2, B1, B2, C1, or C2.

### 2. Regression

- **Study Hours Prediction:** Explored in the notebooks; no saved study-hours model is currently connected to the interface.
- **Accent Score Prediction:** Estimate an accent native-likeness score using relevant learner characteristics and practice-related features, subject to dataset validation.

## Dataset

- **Source:** Kaggle
- **Dataset:** Language Learning to Fluency — Who Gets There

The dataset will be inspected to understand its features, target variables, data quality, and suitability for each prediction task before model development.

Dataset files are kept in `data/raw/`. The notebooks record the project's data understanding, feature selection, and model training decisions.

## Planned Workflow

1. Dataset understanding and validation
2. Exploratory Data Analysis (EDA)
3. Data preprocessing and feature engineering
4. Model development for classification tasks
5. Model development for regression tasks
6. Model evaluation and comparison
7. Results, visualizations, and conclusions

## Project Structure

```text
language-learning-prediction/
├── data/
│   ├── raw/
│   └── processed/
├── notebooks/
├── models/
├── reports/
├── frontend/
│   ├── app/
│   └── scripts/
├── .gitignore
└── README.md
```

## Run the interface

Install the Python dependencies from `frontend/requirements.txt` in the Python environment available as `python`, then run:

```text
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`. The interface asks which forecast to create, then guides the learner through the relevant profile questions. The model files were saved with scikit-learn 1.6.1, so the Python requirements pin that version for compatibility.

## Tools and Technologies

- Python
- Next.js and React
- TypeScript
- Jupyter Notebook
- pandas and NumPy
- Matplotlib and Seaborn
- scikit-learn
- Git and GitHub

Additional libraries will be introduced when required.

## Project Status

**Current stage:** A guided Next.js interface is connected to the four saved prediction models. Predictions are estimates based on training-data patterns, not guarantees or individualized explanations of causality.

See [reports/PROJECT_SUMMARY.md](reports/PROJECT_SUMMARY.md) for the notebook and model overview and [reports/VALIDATION_REPORT.md](reports/VALIDATION_REPORT.md) for interface validation.

## License

A project license will be selected after reviewing the dataset's licensing and redistribution terms.
