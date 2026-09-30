export const FEATURE_KEYS = ["pseudocode_attendance_rate","pseudocode_avg_score","coding_practice_solved_pct","coding_test_overall_score","coding_test_attendance","weekly_score_consistency"] as const;
export const FEATURE_NAMES = ["Pseudocode attendance","Pseudocode score","Practice completion","Coding test score","Coding attendance","Weekly consistency"];
export const DATASET_HEADER = ["student_id","name","email","roll_number","candidate_id",...FEATURE_KEYS,"practice_problems_solved","weeks_zero_activity","candidate_tier","anomaly_type","expected_severity","is_anomaly"];
export type FeatureRecord={id:string;name:string;roll:string;values:number[];problems:number|null;inactive:number|null;tier:string;category:string;severity:string;label:boolean|null};
export const SNAPSHOT={count:1019,flagged:120,averages:[62.55,55.06,45.89,56.72,70.18,62.5],labels:[{name:"Disengaged",count:30},{name:"Erratic",count:30},{name:"Sudden drop-off",count:30},{name:"Suspicious high scorer",count:30}]};
export function readRows(text:string):string[][]{
 const rows:string[][]=[];let row:string[]=[],value="",quoted=false;
 for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){value+='"';i++;}else quoted=!quoted;}else if(c===','&&!quoted){row.push(value);value="";}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(value);if(row.some(v=>v.trim()))rows.push(row);row=[];value="";}else value+=c;}
 if(quoted)throw Error("CSV contains an unclosed quoted field.");row.push(value);if(row.some(v=>v.trim()))rows.push(row);return rows;
}
export function parseFeatures(text:string):FeatureRecord[]{
 const rows=readRows(text);if(rows.length<2)throw Error("The CSV needs a header and at least one student row.");
 const header=rows[0].map(v=>v.replace(/^\uFEFF/,"").trim());
 if(new Set(header).size!==header.length)throw Error("The CSV has duplicate column names.");
 const missing=["student_id",...FEATURE_KEYS].filter(k=>!header.includes(k));
 if(missing.length)throw Error("Missing columns: "+missing.join(", ")+". Upload features_df.csv directly.");
 if(rows.length>10001)throw Error("Use a file with up to 10,000 student rows.");
 const seen=new Set<string>();
 return rows.slice(1).map((row,i)=>{
 if(row.length!==header.length)throw Error("Row "+(i+2)+" has "+row.length+" fields; expected "+header.length+".");
 const get=(key:string)=>row[header.indexOf(key)]?.trim()??"";
 const id=get("student_id");if(!id)throw Error("Row "+(i+2)+" needs a student_id.");if(seen.has(id))throw Error("Duplicate student_id at row "+(i+2)+".");seen.add(id);
 const values=FEATURE_KEYS.map(k=>{const s=get(k),n=Number(s);if(!s||!Number.isFinite(n)||n<0||n>100)throw Error("Row "+(i+2)+": "+k+" must be a number from 0 to 100.");return n;});
 const integer=(key:string)=>{const s=get(key);if(!s)return null;const n=Number(s);if(!Number.isInteger(n)||n<0)throw Error("Row "+(i+2)+": "+key+" must be a nonnegative integer.");return n;};
 const raw=get("is_anomaly").toLowerCase();if(raw&&!["true","false","1","0"].includes(raw))throw Error("Row "+(i+2)+": is_anomaly must be True or False.");
 return {id,name:get("name"),roll:get("roll_number"),values,problems:integer("practice_problems_solved"),inactive:integer("weeks_zero_activity"),tier:get("candidate_tier")||"Unspecified",category:get("anomaly_type")||"Unspecified",severity:get("expected_severity")||"Unspecified",label:raw?raw==="true"||raw==="1":null};
 });
}
export function summarize(records:FeatureRecord[]){
 return {count:records.length,flagged:records.filter(r=>r.label===true).length,averages:FEATURE_KEYS.map((_,i)=>records.length?records.reduce((sum,r)=>sum+r.values[i],0)/records.length:0)};
}
export function filterRecords(records:FeatureRecord[],q:string,tier:string,category:string,flagged:boolean,feature:number,minimum:number){
 const needle=q.trim().normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
 return records.filter(r=>[r.id,r.name,r.roll].some(v=>v.normalize("NFKD").replace(/[\u0300-\u036f]/g,"").toLowerCase().includes(needle))&&(tier==="All tiers"||r.tier===tier)&&(category==="All labels"||r.category===category)&&(!flagged||r.label===true)&&r.values[feature]>=minimum);
}
export function safeCSV(v:string|number|null){const text=String(v??"");return '"'+(/^[=+@\-\t\r]/.test(text)?"'":"")+text.replace(/"/g,'""')+'"';}
export function exportFeatures(rows:FeatureRecord[]){return ["student_id",...FEATURE_KEYS,"practice_problems_solved","weeks_zero_activity","candidate_tier","anomaly_type","expected_severity","is_anomaly"].join(",")+"\n"+rows.map(r=>[r.id,...r.values,r.problems,r.inactive,r.tier,r.category,r.severity,r.label===null?"":r.label?"True":"False"].map(safeCSV).join(",")).join("\n");}
export function saveCSV(name:string,text:string){const url=URL.createObjectURL(new Blob([text],{type:"text/csv;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
export const HEADER_ONLY_TEMPLATE=DATASET_HEADER.join(",")+"\n";

