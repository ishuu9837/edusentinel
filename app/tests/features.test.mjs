import {test} from "node:test";
import assert from "node:assert/strict";
import {FEATURE_KEYS,parseFeatures,readRows,summarize,filterRecords,exportFeatures} from "../lib/features.ts";
const keys=["student_id",...FEATURE_KEYS,"candidate_tier","anomaly_type","is_anomaly"];
const row=["TEST001",80,70,60,90,85,75,"TOP","Normal","False"];
const make=(r=row,k=keys)=>k.join(",")+"\n"+r.join(",");
test("native metrics import without reconstruction errors",()=>{const result=parseFeatures(make())[0];assert.equal(result.id,"TEST001");assert.deepEqual(result.values,[80,70,60,90,85,75]);assert.equal(result.label,false);});
test("columns may be reordered",()=>{assert.deepEqual(parseFeatures(make([...row].reverse(),[...keys].reverse())),parseFeatures(make()));});
test("handles BOM, CRLF and quoted commas",()=>{assert.deepEqual(readRows('\uFEFFa,b\r\n"x,y","a""b"\r\n'),[['\uFEFFa','b'],['x,y','a"b']]);});
test("missing metrics produce actionable errors",()=>{assert.throws(()=>parseFeatures("student_id,score\nT,10"),/Missing columns/);});
test("rejects duplicate IDs, duplicate headers and header-only CSVs",()=>{assert.throws(()=>parseFeatures(make()+"\n"+row.join(",")),/Duplicate student_id/);assert.throws(()=>parseFeatures("student_id,student_id\nT,T"),/duplicate column/);assert.throws(()=>parseFeatures(keys.join(",")));});
test("rejects missing, out-of-range and nonfinite percentages",()=>{for(const value of ["",101,-1,"Infinity"]){const values=[...row];values[1]=value;assert.throws(()=>parseFeatures(make(values)));}});
test("optional labels and counts may be omitted",()=>{const r=parseFeatures(make(row.slice(0,7),keys.slice(0,7)))[0];assert.equal(r.label,null);assert.equal(r.problems,null);});
test("discards personal identifiers",()=>{const parsed=parseFeatures(make([...row,"Person","private@example.test","1234","5678"],[...keys,"name","email","roll_number","candidate_id"]))[0];for(const key of ["name","email","roll_number","candidate_id"])assert.equal(key in parsed,false);});
test("filters combine labels, feature minimum and ID search",()=>{const r=parseFeatures(make());assert.equal(filterRecords(r,"test","All tiers","All labels",false,3,90).length,1);assert.equal(filterRecords(r,"","All tiers","All labels",true,3,0).length,0);assert.equal(filterRecords(r,"","All tiers","All labels",false,3,91).length,0);assert.equal(summarize(r).averages[3],90);});
test("exports native features and supplied annotations without personal identifiers",()=>{const out=exportFeatures(parseFeatures(make()));assert.equal(out.split("\n").length,2);assert.equal(out.includes("reconstruction_error"),false);assert.equal(out.includes("email"),false);});
test("validates integer activity counts and boolean labels",()=>{assert.throws(()=>parseFeatures(make([...row,-1],[...keys,"weeks_zero_activity"])),/nonnegative integer/);const bad=[...row];bad[9]="maybe";assert.throws(()=>parseFeatures(make(bad)),/True or False/);});

