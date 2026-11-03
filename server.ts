import { NpwpClient } from "./src/index.ts";

Deno.serve(async (req) => {
  const url = new URL(req.url);
  
  const npwp = url.searchParams.get("npwp");
  
  if (!npwp) {
    return new Response(JSON.stringify({ 
      error: "Parameter 'npwp' diperlukan. Contoh: ?npwp=12.345.678.9-012.345" 
    }), { 
      status: 400, 
      headers: { "Content-Type": "application/json" } 
    });
  }

  try {
    const result = await NpwpClient.getDataWp(npwp);
    return Response.json(result);
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, 
      headers: { "Content-Type": "application/json" } 
    });
  }
});
