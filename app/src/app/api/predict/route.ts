import { NextResponse } from 'next/server';
import model from '../../../../lib/model-weights.json';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const keys = model.features;
function infer(values: number[]) {
  // Exact forward equations from Abnormal_Learning_Behaviour_Detection.ipynb.
  const scaled = values.map((value, i) => value * model.scale[i] + model.min[i]);
  const hidden = model.bEnc.map((bias, j) =>
    Math.max(0, bias + scaled.reduce((sum, x, i) => sum + x * model.wEnc[i][j], 0))
  );
  const reconstruction = model.bDec.map((bias, j) => {
    const a = bias + hidden.reduce((sum, x, i) => sum + x * model.wDec[i][j], 0);
    return 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, a))));
  });
  const featureErrors = scaled.map((value, i) => (value - reconstruction[i]) ** 2);
  const anomalyScore = featureErrors.reduce((sum, value) => sum + value, 0) / keys.length;
  const severity = anomalyScore > model.threshold * 2 ? 'HIGH' :
    anomalyScore > model.threshold ? 'MEDIUM' : 'NORMAL';
  return {
    anomaly_score: Number(anomalyScore.toFixed(6)),
    threshold: Number(model.threshold.toFixed(6)),
    is_anomaly: severity !== 'NORMAL',
    severity,
    top_features: featureErrors.map((error, i) => ({feature: keys[i], error: Number(error.toFixed(6))}))
      .sort((a,b) => b.error - a.error).slice(0,3),
    model_inputs: keys.length,
    model_source: 'Trained eight-feature autoencoder',
  };
}

export async function POST(request: Request) {
  try {
    if (Number(request.headers.get('content-length') || 0) > 8192) {
      return NextResponse.json({error:'Request too large'}, {status:413});
    }
    const body: unknown = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body))
      return NextResponse.json({error:'Expected an object with eight model features'}, {status:400});
    const raw = body as Record<string, unknown>;
    if (Object.keys(raw).some(key => !keys.includes(key)))
      return NextResponse.json({error:'Only the eight model input fields are accepted. Do not send identifying information.'}, {status:400});
    const values = keys.map(key => raw[key]);
    if (values.some((v,i) => typeof v !== 'number' || !Number.isFinite(v) ||
      v < 0 || (i < 6 && v > 100) || (i >= 6 && !Number.isInteger(v))))
      return NextResponse.json({error:'Provide six percentages (0–100) and two nonnegative integer activity counts'}, {status:400});
    return NextResponse.json(infer(values as number[]), {headers:{'Cache-Control':'no-store'}});
  } catch {
    return NextResponse.json({error:'Invalid JSON input'}, {status:400});
  }
}
