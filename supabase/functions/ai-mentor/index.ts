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

      const response = await fetch("https://api.pica.ai/v1/chat", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${PICA_SECRET_KEY}`,
          "X-Pica-Openai-Connection-Id": PICA_OPENAI_CONNECTION_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages,
          thread_id: threadId || null,
          user_id: userId || "guest_user"
        })
      });

      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ error: "Invalid endpoint" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
