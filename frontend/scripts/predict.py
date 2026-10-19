import json
import sys
from pathlib import Path

import joblib
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
MODEL_DIR = ROOT.parent / 'models'

MODEL_FILES = {
    'fluency': 'fluency_model.pkl',
    'dropout': 'dropout_model.pkl',
    'cefr': 'cefr_model.pkl',
    'accent': 'accent_model.pkl',
}


if __name__ == '__main__':
    payload = json.loads(sys.argv[1])
    task = payload['task']
    if task not in MODEL_FILES:
        raise ValueError(f'Unknown prediction task: {task}')

    model = joblib.load(MODEL_DIR / MODEL_FILES[task])
    features = model.feature_names_in_
    profile = payload['profile']
    row = {feature: float(profile[feature]) for feature in features}
    frame = pd.DataFrame([row], columns=features)

    if task in ('fluency', 'dropout'):
        positive_class_index = list(model.classes_).index(1)
        prediction = float(model.predict_proba(frame)[0][positive_class_index] * 100)
    elif task == 'cefr':
        prediction = str(model.predict(frame)[0])
    else:
        prediction = float(model.predict(frame)[0])

    print(json.dumps({'task': task, 'prediction': round(prediction, 1) if isinstance(prediction, float) else prediction}))
