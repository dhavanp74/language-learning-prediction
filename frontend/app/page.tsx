'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

type Task = 'fluency' | 'dropout' | 'cefr' | 'accent';
type ProfileKey =
  | 'fsi_category'
  | 'related_language'
  | 'prior_languages'
  | 'age_started'
  | 'total_study_hours'
  | 'consistency'
  | 'motivation'
  | 'uses_srs'
  | 'active_use_share'
  | 'immersion_months'
  | 'speaking_practice'
  | 'feedback_quality'
  | 'comprehensible_input_hours'
  | 'accent_nativelike';
type Profile = Record<ProfileKey, number | ''>;

type Choice = {
  value: number;
  label: string;
  detail?: string;
};

type Field = {
  key: ProfileKey;
  label: string;
  description: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  choices?: Choice[];
  endpoints?: [string, string];
};

type PredictionResult = {
  task: Task;
  prediction: number | string;
};

const initialProfile: Profile = {
  fsi_category: '',
  related_language: '',
  prior_languages: '',
  age_started: '',
  total_study_hours: '',
  consistency: '',
  motivation: '',
  uses_srs: '',
  active_use_share: '',
  immersion_months: '',
  speaking_practice: '',
  feedback_quality: '',
  comprehensible_input_hours: '',
  accent_nativelike: '',
};

const sampleProfile: Profile = {
  fsi_category: 2,
  related_language: 1,
  prior_languages: 1,
  age_started: 22,
  total_study_hours: 420,
  consistency: 7,
  motivation: 8,
  uses_srs: 1,
  active_use_share: 0.46,
  immersion_months: 8,
  speaking_practice: 6,
  feedback_quality: 7,
  comprehensible_input_hours: 180,
  accent_nativelike: 5.5,
};

const fields: Record<ProfileKey, Field> = {
  fsi_category: {
    key: 'fsi_category',
    label: 'How challenging is your target language?',
    description: 'A broad group in the dataset: 1 is easier; 4 includes languages such as Mandarin or Arabic. It is not a rating of your ability.',
    choices: [
      { value: 1, label: '1', detail: 'Easier' },
      { value: 2, label: '2', detail: 'Moderate' },
      { value: 3, label: '3', detail: 'Challenging' },
      { value: 4, label: '4', detail: 'Most challenging' },
    ],
  },
  related_language: {
    key: 'related_language',
    label: 'Do you already know a related language?',
    description: 'For example, another language with similar vocabulary or structure.',
    choices: [
      { value: 1, label: 'Yes' },
      { value: 0, label: 'No' },
    ],
  },
  prior_languages: {
    key: 'prior_languages',
    label: 'How many languages have you learned before?',
    description: 'Count languages you have studied, not only languages you speak fluently.',
    min: 0,
    max: 30,
    unit: 'languages',
    endpoints: ['None', '30+'],
  },
  age_started: {
    key: 'age_started',
    label: 'At what age did you start this language?',
    description: 'Your age when you began learning this target language.',
    min: 5,
    max: 100,
    unit: 'years old',
    endpoints: ['5', '100'],
  },
  total_study_hours: {
    key: 'total_study_hours',
    label: 'About how many hours have you studied?',
    description: 'Add lessons, self-study, and practice time. An estimate is fine.',
    min: 0,
    max: 10000,
    step: 10,
    unit: 'hours',
    endpoints: ['0', '10,000+'],
  },
  consistency: {
    key: 'consistency',
    label: 'How consistent is your routine?',
    description: 'Think about how reliably you practice from week to week.',
    min: 0,
    max: 10,
    unit: '/ 10',
    endpoints: ['Rarely', 'Very consistent'],
  },
  motivation: {
    key: 'motivation',
    label: 'How motivated do you feel right now?',
    description: 'Your own current sense of motivation, rather than a test score.',
    min: 0,
    max: 10,
    unit: '/ 10',
    endpoints: ['Low', 'High'],
  },
  uses_srs: {
    key: 'uses_srs',
    label: 'Do you use spaced repetition?',
    description: 'Examples include flashcards that schedule reviews over time.',
    choices: [
      { value: 1, label: 'Yes' },
      { value: 0, label: 'Not currently' },
    ],
  },
  active_use_share: {
    key: 'active_use_share',
    label: 'How much of your study is active use?',
    description: 'Estimate the share spent speaking, writing, or producing language rather than only reviewing.',
    min: 0,
    max: 1,
    step: 0.05,
    unit: '% of study time',
    endpoints: ['Mostly passive', 'Mostly active'],
  },
  immersion_months: {
    key: 'immersion_months',
    label: 'How many months have you been immersed?',
    description: 'Months living in or regularly using the language in an immersive setting.',
    min: 0,
    max: 600,
    unit: 'months',
    endpoints: ['0', '50 years'],
  },
  speaking_practice: {
    key: 'speaking_practice',
    label: 'How often do you get speaking practice?',
    description: 'Rate the amount of speaking and output practice you get.',
    min: 0,
    max: 10,
    unit: '/ 10',
    endpoints: ['None', 'A lot'],
  },
  feedback_quality: {
    key: 'feedback_quality',
    label: 'How useful is the feedback you receive?',
    description: 'Consider whether someone or something helps you notice and correct mistakes.',
    min: 0,
    max: 10,
    unit: '/ 10',
    endpoints: ['None', 'Very useful'],
  },
  comprehensible_input_hours: {
    key: 'comprehensible_input_hours',
    label: 'How much listening and reading have you done?',
    description: 'Count understandable audio, video, and reading in your target language.',
    min: 0,
    max: 10000,
    step: 10,
    unit: 'hours',
    endpoints: ['0', '10,000+'],
  },
  accent_nativelike: {
    key: 'accent_nativelike',
    label: 'How would you rate your current accent?',
    description: 'A self-estimate of how native-like it sounds. This is used only for fluency, dropout, and CEFR forecasts.',
    min: 0,
    max: 10,
    step: 0.5,
    unit: '/ 10',
    endpoints: ['Just starting', 'Near-native'],
  },
};

const groups: { title: string; subtitle: string; keys: ProfileKey[] }[] = [
  {
    title: 'Your language starting point',
    subtitle: 'A little context helps set the scene.',
    keys: ['fsi_category', 'related_language', 'prior_languages', 'age_started'],
  },
  {
    title: 'Your learning rhythm',
    subtitle: 'Tell us what practice looks like across a typical week.',
    keys: ['total_study_hours', 'consistency', 'motivation', 'uses_srs'],
  },
  {
    title: 'The way you practice',
    subtitle: 'A few details about how you use and experience the language.',
    keys: [
      'active_use_share',
      'immersion_months',
      'speaking_practice',
      'feedback_quality',
      'comprehensible_input_hours',
      'accent_nativelike',
    ],
  },
];

const tasks: {
  id: Task;
  number: string;
  title: string;
  question: string;
  description: string;
  resultLabel: string;
}[] = [
  {
    id: 'fluency',
    number: '01',
    title: 'Fluency outlook',
    question: 'How likely am I to reach B2 or higher?',
    description: 'Explore your estimated chance of reaching an independent level of fluency.',
    resultLabel: 'Estimated chance of reaching B2+',
  },
  {
    id: 'dropout',
    number: '02',
    title: 'Learning continuity',
    question: 'How likely am I to stop before B2?',
    description: 'Understand the model’s estimate of leaving the learning journey before B2.',
    resultLabel: 'Estimated chance of stopping before B2',
  },
  {
    id: 'cefr',
    number: '03',
    title: 'CEFR level',
    question: 'What level might I reach?',
    description: 'See the proficiency band the model predicts, from A0 through C2.',
    resultLabel: 'Predicted proficiency band',
  },
  {
    id: 'accent',
    number: '04',
    title: 'Accent trajectory',
    question: 'What accent score does my profile suggest?',
    description: 'Explore a separate 0–10 estimate for native-likeness of accent.',
    resultLabel: 'Estimated native-likeness score',
  },
];

const cefrLevels = [
  { level: 'A0', description: 'Just beginning' },
  { level: 'A1', description: 'Basic phrases' },
  { level: 'A2', description: 'Everyday exchanges' },
  { level: 'B1', description: 'Independent basics' },
  { level: 'B2', description: 'Independent fluency' },
  { level: 'C1', description: 'Advanced flexibility' },
  { level: 'C2', description: 'Near mastery' },
];

const formatNumber = (value: number) =>
  new Intl.NumberFormat('en', { maximumFractionDigits: 1 }).format(value);

function getStepGroups(task: Task) {
  return task === 'accent'
    ? groups.map((group) => ({
        ...group,
        keys: group.keys.filter((key) => key !== 'accent_nativelike'),
      }))
    : groups;
}

export default function HomePage() {
  const [task, setTask] = useState<Task | null>(null);
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(0);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState('');
  const resultRef = useRef<HTMLElement | null>(null);

  const stepGroups = task ? getStepGroups(task) : [];
  const selectedTask = tasks.find((item) => item.id === task);
  const stage = stepGroups[step];
  const loadingMessages = [
    'Looking at your learning patterns',
    'Connecting the details in your profile',
    'Preparing your personal forecast',
  ];

  useEffect(() => {
    if (!loading) return;
    const interval = window.setInterval(() => {
      setLoadingMessage((current) => (current + 1) % loadingMessages.length);
    }, 1500);
    return () => window.clearInterval(interval);
  }, [loading, loadingMessages.length]);

  useEffect(() => {
    if (result) {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  const chooseTask = (nextTask: Task) => {
    setTask(nextTask);
    setStep(0);
    setResult(null);
    setError('');
    window.requestAnimationFrame(() => {
      document.getElementById('profile')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const updateProfile = (key: ProfileKey, value: string | number) => {
    const enteredValue = value === '' ? '' : Number(value);
    const parsedValue =
      key === 'active_use_share' && enteredValue !== ''
        ? enteredValue / 100
        : enteredValue;
    setProfile((current) => ({ ...current, [key]: parsedValue }));
    setResult(null);
    setError('');
  };

  const useSampleProfile = () => {
    setProfile(sampleProfile);
    setError('');
    setResult(null);
  };

  const canContinue = (keys: ProfileKey[]) =>
    keys.every((key) => {
      const value = profile[key];
      const field = fields[key];
      return (
        value !== '' &&
        Number.isFinite(value) &&
        (field.min === undefined || value >= field.min) &&
        (field.max === undefined || value <= field.max)
      );
    });

  const continueStep = () => {
    if (!stage || !canContinue(stage.keys)) {
      setError('Complete each question on this step to continue.');
      return;
    }
    setError('');
    if (step < stepGroups.length - 1) {
      setStep((current) => current + 1);
      return;
    }
    void getPrediction();
  };

  const getPrediction = async () => {
    if (!task) return;
    setLoading(true);
    setLoadingMessage(0);
    setError('');

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, profile }),
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || 'Prediction failed');
      }
      setResult(payload as PredictionResult);
    } catch (predictionError) {
      console.error(predictionError);
      setError('The forecast could not be generated. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  const resetFlow = () => {
    setTask(null);
    setResult(null);
    setStep(0);
    setError('');
    document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const profileChips = task
    ? getStepGroups(task)
        .flatMap((group) => group.keys)
        .map((key) => {
          const value = profile[key];
          const field = fields[key];
          const valueLabel = field.choices?.find((choice) => choice.value === value)?.label;
          const displayValue =
            valueLabel ??
            (value === ''
              ? '—'
              : key === 'active_use_share'
                ? `${formatNumber(value * 100)}%`
                : key === 'prior_languages'
                  ? `${formatNumber(value)} ${value === 1 ? 'language' : 'languages'}`
                  : `${formatNumber(value)}${field.unit ? ` ${field.unit}` : ''}`);
          return { key, label: field.label.replace(/[?]/g, ''), value: displayValue };
        })
    : [];

  const renderField = (key: ProfileKey) => {
    const field = fields[key];
    const value = profile[key];

    return (
      <div className="question-card" key={key}>
        <div className="question-heading">
          <label>{field.label}</label>
          <span className="field-value">
            {field.choices
              ? field.choices.find((choice) => choice.value === value)?.label ?? 'Choose'
              : value === ''
                ? 'Your estimate'
                : `${key === 'active_use_share' ? formatNumber(value * 100) : formatNumber(value)}${key === 'active_use_share' ? '%' : field.unit ? ` ${field.unit}` : ''}`}
          </span>
        </div>
        <p className="question-description">{field.description}</p>
        {field.choices ? (
          <div className={`choice-list ${field.choices.length > 2 ? 'choice-list-wide' : ''}`} role="group" aria-label={field.label}>
            {field.choices.map((choice) => (
              <button
                className={`choice-button ${value === choice.value ? 'choice-selected' : ''}`}
                key={choice.value}
                type="button"
                aria-pressed={value === choice.value}
                onClick={() => updateProfile(key, choice.value)}
              >
                <span>{choice.label}</span>
                {choice.detail && <small>{choice.detail}</small>}
              </button>
            ))}
          </div>
        ) : (
          <>
            <div className="number-control">
              <input
                aria-label={field.label}
                type="number"
                min={key === 'active_use_share' ? 0 : field.min}
                max={key === 'active_use_share' ? 100 : field.max}
                step={key === 'active_use_share' ? 5 : field.step ?? 1}
                value={value === '' ? '' : key === 'active_use_share' ? value * 100 : value}
                onChange={(event) => updateProfile(key, event.target.value)}
                placeholder="Enter a number"
              />
              <span>{field.unit}</span>
            </div>
            <div
              aria-hidden="true"
              className="input-meter"
              style={
                {
                  '--meter-value':
                    value === '' || field.min === undefined || field.max === undefined
                      ? '0%'
                      : `${Math.min(100, Math.max(0, ((value - field.min) / (field.max - field.min)) * 100))}%`,
                } as CSSProperties
              }
            >
              <span />
            </div>
            {field.endpoints && (
              <div className="meter-labels">
                <span>{field.endpoints[0]}</span>
                <span>{field.endpoints[1]}</span>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const renderResult = () => {
    if (!result || !selectedTask) return null;
    const value = result.prediction;
    const numericValue = Number(value);
    const isProbability = task === 'fluency' || task === 'dropout';
    const gaugeValue = isProbability ? numericValue : numericValue * 10;
    const dialStyle = { '--dial-value': `${Math.min(100, Math.max(0, gaugeValue))}%` } as CSSProperties;
    const cefrIndex = cefrLevels.findIndex((item) => item.level === value);
    const title =
      task === 'fluency'
        ? 'Your fluency outlook'
        : task === 'dropout'
          ? 'Your continuity signal'
          : task === 'cefr'
            ? 'Your predicted CEFR band'
            : 'Your accent trajectory';
    const explanation =
      task === 'fluency'
        ? 'This percentage is the model’s estimated likelihood of reaching B2 or above for a profile like the one you entered. It is a probability estimate, not a promise or a measure of model confidence.'
        : task === 'dropout'
          ? 'This percentage is the model’s estimated likelihood of stopping before B2 for a profile like the one you entered. A higher value means the model estimates a greater chance of leaving before that milestone.'
          : task === 'cefr'
            ? 'This is the single proficiency category selected by the model, using the CEFR scale from A0 to C2. It is a predicted band, not a guaranteed final level.'
            : 'This score estimates accent native-likeness on the dataset’s 0–10 scale. It describes accent only, not overall language proficiency.';

    return (
      <section className="result-experience" ref={resultRef} aria-live="polite">
        <div className="result-heading">
          <div>
            <span className="eyebrow">Your learning signal</span>
            <h2>{title}</h2>
          </div>
          <button className="text-button" type="button" onClick={() => setResult(null)}>
            Adjust answers
          </button>
        </div>

        <div className="result-layout">
          <div className="result-main-card">
            <div className="result-visual">
              {isProbability ? (
                <div className="probability-dial" style={dialStyle}>
                  <div className="dial-inner">
                    <strong>{formatNumber(numericValue)}%</strong>
                    <span>{task === 'fluency' ? 'chance' : 'estimated'}</span>
                  </div>
                </div>
              ) : task === 'cefr' ? (
                <div className="cefr-visual">
                  <strong>{String(value)}</strong>
                  <span>{cefrLevels[cefrIndex]?.description}</span>
                </div>
              ) : (
                <div className="accent-visual">
                  <div className="accent-score">
                    <strong>{formatNumber(numericValue)}</strong>
                    <span>/ 10</span>
                  </div>
                  <div className="accent-track"><span style={{ width: `${Math.min(100, Math.max(0, gaugeValue))}%` }} /></div>
                  <div className="meter-labels"><span>Early stage</span><span>Near-native</span></div>
                </div>
              )}
              {isProbability && (
                <div className="dial-scale">
                  <span>Less likely</span>
                  <span>More likely</span>
                </div>
              )}
              {task === 'cefr' && (
                <div className="cefr-scale" aria-label="CEFR level scale">
                  {cefrLevels.map((item, index) => (
                    <span className={index === cefrIndex ? 'cefr-active' : ''} key={item.level}>{item.level}</span>
                  ))}
                </div>
              )}
            </div>
            <div className="result-copy">
              <span className="result-tag">Model estimate</span>
              <p>{explanation}</p>
            </div>
          </div>

          <aside className="interpretation-card">
            <span className="eyebrow">How to read this</span>
            <h3>{selectedTask.resultLabel}</h3>
            <p>
              {task === 'fluency'
                ? 'B2 is the CEFR level commonly associated with independent communication in familiar and many work or study situations.'
                : task === 'dropout'
                  ? 'The model’s target is leaving before reaching B2. This is a population-pattern estimate, not a judgment about your commitment.'
                  : task === 'cefr'
                    ? 'CEFR bands describe what a learner can do with a language, from early foundations (A0/A1) through highly proficient use (C1/C2).'
                    : 'Accent development is separate from fluency. The model predicts an accent score from learning profile factors; it does not assess a recording.'}
            </p>
            <div className="model-note">
              <span className="note-mark">i</span>
              <span>This model finds patterns in its training data. It does not identify which individual answer caused this prediction.</span>
            </div>
          </aside>
        </div>

        <section className="profile-recap">
          <div className="recap-heading">
            <div>
              <span className="eyebrow">The profile you shared</span>
              <h3>Context behind this estimate</h3>
            </div>
            <span className="recap-count">{profileChips.length} factors</span>
          </div>
          <div className="recap-grid">
            {profileChips.map((chip) => (
              <div className="recap-chip" key={chip.key}>
                <span>{chip.label}</span>
                <strong>{chip.value}</strong>
              </div>
            ))}
          </div>
        </section>

        <div className="result-footer">
          <p>Use this as a conversation starter for your learning plan, not as a fixed limit on what you can achieve.</p>
          <button className="submit-button secondary-button" type="button" onClick={resetFlow}>
            Explore another forecast
          </button>
        </div>
      </section>
    );
  };

  return (
    <main className="page-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="app-container">
        <header className="topbar">
          <a className="brand" href="#top" aria-label="Signal Studio home">
            <span className="brand-mark"><i /><i /><i /></span>
            <span>Signal Studio</span>
          </a>
          <nav aria-label="Main navigation">
            <a href="#explore">Explore predictions</a>
            <a href="#how-it-works">How it works</a>
          </nav>
          <span className="topbar-note"><span /> Learner-first insights</span>
        </header>

        <section className="hero" id="top">
          <div className="hero-content">
            <div className="kicker"><span className="kicker-dot" /> LANGUAGE LEARNING INTELLIGENCE</div>
            <h1>Make your next language milestone <em>feel closer.</em></h1>
            <p className="hero-copy">
              Choose one question. Share only the details that matter. Get a forecast you can actually understand.
            </p>
            <a className="hero-link" href="#explore">
              Find your learning signal <span aria-hidden="true">→</span>
            </a>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="orbit orbit-outer" />
            <div className="orbit orbit-middle" />
            <div className="orbit orbit-inner" />
            <div className="orbit-core">
              <span className="core-label">YOUR</span>
              <strong>next</strong>
              <span className="core-label">MILESTONE</span>
            </div>
            <span className="orbit-node node-one">B2</span>
            <span className="orbit-node node-two">A1</span>
            <span className="orbit-node node-three">C1</span>
            <div className="art-caption">
              <span className="caption-line" />
              <span>A clearer view of your learning path</span>
            </div>
          </div>
        </section>

        <section className="explore-section" id="explore">
          <div className="section-intro">
            <div>
              <span className="eyebrow">Start with what matters to you</span>
              <h2>What are you curious about?</h2>
            </div>
            <p>Pick a single forecast. We’ll guide you through a few quick steps.</p>
          </div>
          <div className="task-grid">
            {tasks.map((item) => (
              <button
                aria-pressed={task === item.id}
                className={`task-card ${task === item.id ? 'task-selected' : ''}`}
                key={item.id}
                onClick={() => chooseTask(item.id)}
                type="button"
              >
                <span className="task-topline"><span>{item.number}</span><span className="task-arrow" aria-hidden="true">↗</span></span>
                <span className="task-symbol" aria-hidden="true">
                  {item.id === 'fluency' ? '↗' : item.id === 'dropout' ? '≈' : item.id === 'cefr' ? 'A–Z' : '◌'}
                </span>
                <strong>{item.title}</strong>
                <span className="task-question">{item.question}</span>
                <span className="task-description">{item.description}</span>
              </button>
            ))}
          </div>
        </section>

        {task && !result && (
          <section className="journey-section" id="profile">
            <div className="journey-main">
              <div className="journey-header">
                <div>
                  <span className="eyebrow">Your focus · {selectedTask?.title}</span>
                  <h2>{loading ? 'Your signal is taking shape' : stage.title}</h2>
                  <p>{loading ? 'A moment while we compare your profile with the model patterns.' : stage.subtitle}</p>
                </div>
                {!loading && (
                  <button className="sample-button" type="button" onClick={useSampleProfile}>
                    Try an example profile
                  </button>
                )}
              </div>

              <div className="step-progress" aria-label={`Step ${step + 1} of ${stepGroups.length}`}>
                <div className="progress-track"><span style={{ width: `${((step + 1) / stepGroups.length) * 100}%` }} /></div>
                <div className="progress-meta">
                  <span>STEP {String(step + 1).padStart(2, '0')} <span className="progress-divider">/</span> {String(stepGroups.length).padStart(2, '0')}</span>
                  <span>
                    {stepGroups.length - step - 1 === 0
                      ? 'Almost there'
                      : stepGroups.length - step - 1 === 1
                        ? '1 short step to go'
                        : `${stepGroups.length - step - 1} short steps to go`}
                  </span>
                </div>
              </div>

              {loading ? (
                <div className="loading-stage" role="status" aria-live="polite">
                  <div className="loading-art">
                    <div className="loading-orbit"><span /></div>
                    <div className="loading-core"><span className="brand-mark"><i /><i /><i /></span></div>
                  </div>
                  <div className="loading-copy">
                    <span className="eyebrow">Reading your learning signal</span>
                    <h3 key={loadingMessage}>{loadingMessages[loadingMessage]}</h3>
                    <div className="loading-pulse"><i /><i /><i /></div>
                    <p>Your answers stay in this session and are used to create this forecast.</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="questions-grid">
                    {stage.keys.map(renderField)}
                  </div>
                  {error && <p className="form-error" role="alert">{error}</p>}
                  <div className="journey-actions">
                    <button
                      className="back-button"
                      disabled={step === 0}
                      onClick={() => { setStep((current) => Math.max(0, current - 1)); setError(''); }}
                      type="button"
                    >
                      <span aria-hidden="true">←</span> Back
                    </button>
                    <button className="submit-button" onClick={continueStep} type="button">
                      {step === stepGroups.length - 1 ? 'Create my forecast' : 'Continue'}
                      <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            <aside className="journey-side">
              <div className="side-orbit">
                <div className="side-orbit-ring"><span /></div>
                <div className="side-orbit-core">
                  <span>YOUR FOCUS</span>
                  <strong>{selectedTask?.number}</strong>
                </div>
              </div>
              <span className="eyebrow">Why this question?</span>
              <h3>{selectedTask?.title}</h3>
              <p>{selectedTask?.description}</p>
              <div className="side-note">
                <span className="note-mark">i</span>
                <span>Questions are grouped into small steps. Each answer describes your learning context; it isn’t a score of your worth or ability.</span>
              </div>
              <button className="change-focus" onClick={resetFlow} type="button">
                Choose a different forecast <span aria-hidden="true">↗</span>
              </button>
            </aside>
          </section>
        )}

        {loading && (
          <div className="loading-ribbon" aria-hidden="true">
            <span>LANGUAGE</span><i /><span>PRACTICE</span><i /><span>POTENTIAL</span><i /><span>YOUR NEXT STEP</span>
          </div>
        )}

        {result && renderResult()}

        <section className="how-section" id="how-it-works">
          <div className="how-heading">
            <span className="eyebrow">A useful guide, not a verdict</span>
            <h2>Prediction is a starting point.</h2>
            <p>Models spot patterns in past learner data. Your path is still yours to shape.</p>
          </div>
          <div className="how-points">
            <article><span>01</span><h3>Pick your question</h3><p>Fluency, continuity, CEFR level, or accent trajectory. Choose the one you want to explore.</p></article>
            <article><span>02</span><h3>Share your context</h3><p>Answer a short guided profile. The questions explain what each measure means as you go.</p></article>
            <article><span>03</span><h3>Read the signal</h3><p>See what the prediction estimates, what it does not, and which profile you shared.</p></article>
          </div>
        </section>

        <footer className="footer">
          <a className="brand" href="#top">
            <span className="brand-mark"><i /><i /><i /></span>
            <span>Signal Studio</span>
          </a>
          <span>Learning is personal. Predictions are only one perspective.</span>
          <a href="#explore">Start exploring <span aria-hidden="true">↑</span></a>
        </footer>
      </div>
    </main>
  );
}
