import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
export async function paperResponse(disposition: "attachment" | "inline") {
 const bytes = await readFile(resolve(process.cwd(), "../Ish's paper.pdf"));
 return new Response(new Uint8Array(bytes), { headers: {
  "Content-Type": "application/pdf",
  "Content-Disposition": `${disposition}; filename="Edusentinel-Research-Paper.pdf"`,
  "Content-Length": String(bytes.length),
  "X-Content-Type-Options": "nosniff",
  "Cache-Control": "public, max-age=3600"
 }});
}
