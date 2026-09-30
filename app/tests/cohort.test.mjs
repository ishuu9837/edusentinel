import { test } from "node:test";
import assert from "node:assert/strict";
import { parseCSV, CSV_HEADER, SAMPLE, esc } from "../lib/cohort.ts";
const csv = (row) => CSV_HEADER + "\n" + row;
test("parses the complete six-column contract",()=>{assert.deepEqual(parseCSV(csv("ED-1,Biology,12,36.5,78,0.042")),[{id:"ED-1",course:"Biology",sessions:12,minutes:36.5,completion:78,error:.042}]);});
test("handles BOM, CRLF, quoted commas and escaped quotes",()=>{const row='ED-1,"Biology, ""Advanced""",12,36,78,0.042';assert.equal(parseCSV("\uFEFF"+CSV_HEADER+"\r\n"+row+"\r\n")[0].course,'Biology, "Advanced"');});
test("rejects header-only and mismatched schemas",()=>{assert.throws(()=>parseCSV(CSV_HEADER));assert.throws(()=>parseCSV("id,score\nED-1,.04"));});
test("rejects incomplete and malformed numerical data",()=>{for(const row of ["ED-1,Bio,1,2,,.03","ED-1,Bio,1,2,101,.03","ED-1,Bio,1.5,2,50,.03","ED-1,Bio,1,-2,50,.03","ED-1,Bio,1,2,50,Infinity","ED-1,Bio,1,2,50"]){assert.throws(()=>parseCSV(csv(row)));}});
test("normalizes IDs before detecting duplicates",()=>{assert.throws(()=>parseCSV(csv(" ED-1 ,Bio,1,2,50,.03\nED-1,Bio,1,2,50,.04")),/Duplicate/);});
test("rejects unclosed quoted fields",()=>{assert.throws(()=>parseCSV(csv('ED-1,"Bio,1,2,50,.03')),/Unclosed/);});
test("CSV export escapes embedded quotes",()=>{assert.equal(esc('A "B"'),'"A ""B"""');});
test("synthetic cohort labels 7 of 48 at the starting threshold",()=>{assert.equal(SAMPLE.length,48);assert.equal(SAMPLE.filter(s=>s.error>.065).length,7);assert.equal(SAMPLE.filter(s=>s.error>0).length,48);assert.equal(SAMPLE.filter(s=>s.error>.15).length,0);});

