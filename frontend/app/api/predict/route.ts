import { spawnSync } from 'child_process';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { task?: string; profile?: unknown };
    const tasks = ['fluency', 'dropout', 'cefr', 'accent'];
    if (!body.task || !tasks.includes(body.task)) {
      return NextResponse.json({ error: 'Choose a supported prediction task.' }, { status: 400 });
    }
    if (!body.profile || typeof body.profile !== 'object' || Array.isArray(body.profile)) {
      return NextResponse.json({ error: 'A learner profile is required.' }, { status: 400 });
    }
    const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';
    const scriptPath = path.join(process.cwd(), 'scripts', 'predict.py');

    const result = spawnSync(pythonCommand, [scriptPath, JSON.stringify(body)], {
      encoding: 'utf8',
      cwd: process.cwd(),
    });

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    if (result.status !== 0) {
      return NextResponse.json(
        { error: result.stderr || result.stdout || 'Prediction model failed.' },
        { status: 500 },
      );
    }

    const parsed = JSON.parse(result.stdout.trim());
    return NextResponse.json(parsed);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unexpected prediction error' },
      { status: 500 },
    );
  }
}
