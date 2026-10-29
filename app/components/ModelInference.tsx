'use client';

import {useEffect, useState} from 'react';
import {FEATURE_KEYS, FEATURE_NAMES, type FeatureRecord} from '../lib/features';

const INPUTS = [...FEATURE_KEYS, 'practice_problems_solved', 'weeks_zero_activity'] as const;
const LABELS = [...FEATURE_NAMES, 'Problems solved', 'Inactive weeks'];
const INITIAL = [70, 70, 70, 70, 70, 70, 20, 0];
type Prediction = {
 anomaly_score:number; threshold:number; is_anomaly:boolean; severity:'NORMAL'|'MEDIUM'|'HIGH';
 top_features:{feature:string;error:number}[]; model_inputs:number;
};

export function ModelInference({record}: {record?:FeatureRecord|null}) {
 const [values,setValues] = useState<string[]>(INITIAL.map(String));
 const [result,setResult] = useState<Prediction|null>(null);
 const [busy,setBusy] = useState(false);
 const [error,setError] = useState('');
 useEffect(()=>{
  setValues((record ? [...record.values,record.problems,record.inactive] : INITIAL).map(x=>x===null?'':String(x)));
  setResult(null);setError('');
 },[record]);
 async function predict(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();setResult(null);setError('');
  const numbers=values.map(Number);
  if(values.some(v=>v.trim()==='') || numbers.some((v,i)=>!Number.isFinite(v)||v<0||(i<6&&v>100)||(i>=6&&!Number.isInteger(v)))) {
   setError('All eight inputs are required: six percentages from 0 to 100 and two nonnegative whole numbers.');
   return;
  }
  setBusy(true);
  try {
   const response=await fetch('/api/predict',{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify(Object.fromEntries(INPUTS.map((k,i)=>[k,numbers[i]]))),cache:'no-store'});
   const data=await response.json();
   if(!response.ok) throw new Error(data.error || 'Inference failed');
   setResult(data as Prediction);
  } catch(e){setError(e instanceof Error?e.message:'Inference failed');}
  finally{setBusy(false);}
 }
 return <section aria-label="Real model inference" style={{border:'1px solid currentColor',padding:'1.25rem',marginTop:'1.5rem'}}>
  <div className="eyebrow">LIVE INFERENCE / EIGHT-FEATURE AUTOENCODER</div>
  <h3>Score a student with the trained model</h3>
  <p className="fine-print">Uses the trained encoder and decoder, fitted Min-Max scaler, and original reconstruction-error threshold. Only eight numeric values are sent to the inference API, never student names or identifiers.</p>
  <form onSubmit={predict}>
   <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(175px,1fr))',gap:'1rem',margin:'1rem 0'}}>
    {INPUTS.map((key,i)=><label key={key} style={{display:'flex',flexDirection:'column',gap:'.4rem',fontSize:'.85rem'}}>
     {LABELS[i]} <input aria-label={LABELS[i]} type="number" min={0} max={i<6?100:undefined} step={i<6?'any':1}
      required value={values[i]} onChange={e=>{setValues(old=>old.map((v,j)=>j===i?e.target.value:v));setResult(null);}}/>
    </label>)}
   </div>
   <button className="button primary" type="submit" disabled={busy}>{busy?'Scoring…':'Run autoencoder prediction'}</button>
  </form>
  {error&&<p role="alert">{error}</p>}
  {result&&<div role="status" aria-live="polite" style={{marginTop:'1.25rem'}}>
   <div className="eyebrow">MODEL OUTPUT / NOT A DATASET LABEL</div>
   <h3>{result.severity} · Reconstruction error {result.anomaly_score.toFixed(6)}</h3>
   <p>Normal/Medium cutoff: {result.threshold.toFixed(6)} · High cutoff: {(2*result.threshold).toFixed(6)}</p>
   <h4>Largest reconstruction-error contributions</h4>
   <ol>{result.top_features.map(x=><li key={x.feature}>{x.feature.replaceAll('_',' ')}: {x.error.toFixed(6)}</li>)}</ol>
   <p className="fine-print">An anomaly score identifies unusual patterns, not a diagnosis or judgment about a student. Compare with the dataset label only as separate evidence.</p>
  </div>}
 </section>;
}
