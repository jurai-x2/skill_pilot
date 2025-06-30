import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

const PICA_SECRET_KEY = Deno.env.get("PICA_SECRET_KEY");
const PICA_OPENAI_CONNECTION_KEY = Deno.env.get("PICA_OPENAI_CONNECTION_KEY");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split("/").pop();

    if (path === "chat") {
  const { messages, assistantId, threadId, userId } = await req.json();

  const response = await fetch("https://api.picaos.com/v1/passthrough/v1/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-pica-secret": Deno.env.get("PICA_SECRET_KEY")!,
      "x-pica-connection-key": Deno.env.get("PICA_OPENAI_CONNECTION_KEY")!,
    },
    body: JSON.stringify({
      messages,
      thread_id: threadId || null,
      user_id: userId || "guest_user",
      assistant_id: assistantId
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Pica API Error:", errorText);
    return new Response(JSON.stringify({ error: "Failed to contact AI" }), {
      status: response.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const data = await response.json();
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
