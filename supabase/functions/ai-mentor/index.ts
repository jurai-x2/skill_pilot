import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split("/").pop();

    // Create or get assistant
    if (path === "create-assistant") {
      // Simulate successful assistant creation
      return new Response(JSON.stringify({
        id: "asst_mock_123456",
        object: "assistant",
        created_at: Date.now(),
        name: "Tech Career & Learning AI Coach",
        description: "A friendly AI chatbot for tech career guidance",
        model: "gpt-4o",
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Chat with assistant
    if (path === "chat") {
      const { messages, assistantId, threadId, userId } = await req.json();
      
      // Simulate chat response
      return new Response(JSON.stringify({
        threadId: threadId || "thread_mock_123456",
        assistantId,
        message: {
          id: "msg_mock_" + Date.now(),
          object: "thread.message",
          created_at: Math.floor(Date.now() / 1000),
          thread_id: threadId || "thread_mock_123456",
          role: "assistant",
          content: [{
            type: "text",
            text: {
              value: "I'm your AI mentor running in demo mode. In a production environment, I would connect to OpenAI's GPT-4o model through the Pica API to provide personalized assistance based on your learning journey. I can help with coding questions, career advice, resume feedback, and more!",
              annotations: []
            }
          }]
        }
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Handle file uploads
    if (path === "upload-file") {
      const formData = await req.formData();
      const file = formData.get("file") as File;
      const assistantId = formData.get("assistantId") as string;
      const threadId = formData.get("threadId") as string;
      
      if (!file || !assistantId || !threadId) {
        return new Response(JSON.stringify({ error: "Missing required parameters" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      // Simulate file upload
      return new Response(JSON.stringify({
        fileId: "file_mock_" + Date.now(),
        threadId,
        assistantId,
        success: true,
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
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