import { paperResponse } from "../../../lib/paper";
export const dynamic = "force-static";
export async function GET() { return paperResponse("inline"); }
