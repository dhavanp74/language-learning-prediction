# Language Learning Prediction project summary

## Project purpose
This repository contains a machine learning workflow for forecasting language-learning outcomes using the Kaggle dataset "Language Learning to Fluency — Who Gets There". The work is designed to estimate whether a learner is likely to reach fluency, whether they may drop out, which CEFR level they are likely to achieve, and how native-like their accent may sound.

## Dataset and feature profile
The raw dataset includes learner attributes and practice-quality fields such as:
- learner_id
- fsi_category
- related_language
- prior_languages
- age_started
- total_study_hours
- active_use_share
- immersion_months
- speaking_practice
- feedback_quality
- comprehensible_input_hours
- uses_srs
- motivation
- consistency
- accent_nativelike
- cefr_level
- reached_fluency
- dropped_out

The notebook work shows that the main predictive features come from study effort, language difficulty, practice quality, and consistency rather than from identity-only fields.

## Notebook decisions and flow
### 1. Data understanding
The first notebook establishes the project objective, checks package versions, loads the dataset, and validates the target columns. It confirms the dataset includes the binary labels for fluency and dropout and also a CEFR level field that can support a multi-class prediction task.

### 2. Feature selection and labeling
The second notebook reviews which columns are useful for each task. It separates the dataset into different target configurations:
- fluency: reached_fluency
- dropout: dropped_out
- CEFR: cefr_level
- accent: accent_nativelike

It also identifies certain variables as not suitable for the estimation tasks and excludes them from the modeling stage. The feature set used for prediction is built around the study, practice, and quality measures that are most predictive of learning outcomes.

### 3. Model training
The third notebook fits models for four prediction tasks:
- Fluency prediction using a logistic regression pipeline
- Dropout prediction using a logistic regression pipeline
- CEFR classification using a logistic regression pipeline
- Accent score prediction using linear regression

The trained model artifacts are saved to the models directory as:
- fluency_model.pkl
- dropout_model.pkl
- cefr_model.pkl
- accent_model.pkl

The notebook also compares regression methods for accent prediction and confirms the core modeling approach used for the saved artifact.

## Model interpretation
The model outputs align to the project goals:
- Fluency prediction answers whether the learner is likely to reach at least a B2-level outcome.
- Dropout prediction estimates whether the learner will stop before reaching B2.
- CEFR prediction estimates the learner's likely proficiency band (A0 to C2).
- Accent prediction estimates a score between the dataset's native-likeness range.

## Frontend goal
The frontend should translate these predictions into a guided user experience. Instead of showing raw model values alone, the interface should ask for practical learner information, interpret the outputs, and present them as conversational insights about learning potential, retention risk, and accent trajectory.

## Current state of the repository
The repository already contains the data, trained models, and a detailed exploratory notebook workflow. The remaining work is the interface layer that makes the project usable for users.
