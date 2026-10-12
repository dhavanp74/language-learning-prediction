
# Language Learning Outcome Prediction

## Overview

This project explores the use of machine learning to understand and predict language learning outcomes. Using the *Language Learning to Fluency — Who Gets There* dataset from Kaggle, the project aims to identify factors associated with language proficiency, learner dropout, study efficiency, and accent development.

## Objectives

The project explores five prediction tasks.

### 1. Classification

- **Fluency Prediction:** Predict whether a learner reaches B2 or higher proficiency.
- **Learner Dropout Prediction:** Predict whether a learner drops out before reaching B2.
- **CEFR Proficiency Classification:** Predict a learner's proficiency category: A0, A1, A2, B1, B2, C1, or C2.

### 2. Regression

- **Study Hours Prediction:** Estimate the study hours required to reach a target proficiency level, subject to the availability of a suitable target variable in the dataset.
- **Accent Score Prediction:** Estimate an accent native-likeness score using relevant learner characteristics and practice-related features, subject to dataset validation.

## Dataset

- **Source:** Kaggle
- **Dataset:** Language Learning to Fluency — Who Gets There

The dataset will be inspected to understand its features, target variables, data quality, and suitability for each prediction task before model development.

Dataset files are kept locally and are excluded from version control.

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
├── .gitignore
└── README.md
```

## Tools and Technologies

- Python
- Jupyter Notebook
- pandas and NumPy
- Matplotlib and Seaborn
- scikit-learn
- Git and GitHub

Additional libraries will be introduced when required.

## Project Status

**Current stage:** Repository setup.

Dataset validation, exploratory analysis, model development, and evaluation are planned next.

## License

A project license will be selected after reviewing the dataset's licensing and redistribution terms.
