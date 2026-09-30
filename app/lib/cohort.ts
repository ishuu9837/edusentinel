export type Student = { id: string; course: string; sessions: number; minutes: number; completion: number; error: number };
export const SAMPLE: Student[] = Array.from({length:48},(_,i)=>({id:"ED-"+String(1001+i),course:["Biotechnology","Computer Science","Business Studies"][i%3],sessions:3+(i*7)%24,minutes:12+(i*13)%72,completion:35+(i*11)%65,error: Number((i%7===0?0.078+(i%5)*0.016:0.008+((i*17)%50)/1000).toFixed(3))}));
export const CSV_HEADER = "student_id,course,sessions,avg_minutes,completion_pct,reconstruction_error";
export function parseCSV(text:string):Student[] {
 const rows:string[][]=[];let row:string[]=[],field="",quoted=false;
 for(let i=0;i<text.length;i++){const c=text[i];if(c==='"'){if(quoted&&text[i+1]==='"'){field+='"';i++;}else quoted=!quoted;}else if(c===','&&!quoted){row.push(field);field="";}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(field);if(row.some(x=>x.trim()))rows.push(row);row=[];field="";}else field+=c;}
 if(quoted)throw Error("Unclosed quoted field.");row.push(field);if(row.some(x=>x.trim()))rows.push(row);
 const expected=CSV_HEADER.split(",");if(rows.length<2||rows[0].map(x=>x.replace(/^\uFEFF/,"").trim()).join(",")!==CSV_HEADER)throw Error("Use the six columns in the downloadable template, in the same order.");
 const seen=new Set<string>();return rows.slice(1).map((r,i)=>{if(r.length!==expected.length)throw Error("Row "+(i+2)+": expected six columns.");const values=r.slice(2).map(x=>Number(x));if(!r[0].trim()||!r[1].trim()||r.slice(2).some(x=>!x.trim())||values.some(x=>!Number.isFinite(x)||x<0)||values[2]>100||!Number.isInteger(values[0]))throw Error("Row "+(i+2)+": invalid or missing values.");if(seen.has(r[0].trim()))throw Error("Duplicate student ID: "+r[0]);seen.add(r[0].trim());return {id:r[0].trim(),course:r[1].trim(),sessions:values[0],minutes:values[1],completion:values[2],error:values[3]};});
}
export function download(name:string,text:string){const url=URL.createObjectURL(new Blob([text],{type:"text/csv;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
export function esc(v:string|number){return '"'+String(v).replace(/"/g,'""')+'"';}

