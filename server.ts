
import { NpwpClient } from "./src/index.ts";

Deno.serve(async (req) => {
  const url = new URL(req.url);
  const npwp = url.searchParams.get("npwp");

  if (!npwp) {
    return new Response("Parameter 'npwp' diperlukan", { status: 400 });
  }

  const result = await NpwpClient.getDataWp(npwp);
  return Response.json(result);
});
