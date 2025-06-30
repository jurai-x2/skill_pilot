import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
};

const PICA_SECRET_KEY = Deno.env.get("PICA_SECRET_KEY") || "";
const PICA_OPENAI_CONNECTION_KEY = Deno.env.get("PICA_OPENAI_CONNECTION_KEY") || "";
const PICA_ACTION_ID = "conn_mod_def::GDzgHh5SV6g::ReTB33gCQ6S2U3sqKB1EIg";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

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

    // Create a Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Create or get assistant
    if (path === "create-assistant") {
      const response = await createAssistant();
      return new Response(JSON.stringify(response), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Chat with assistant
    if (path === "chat") {
      const { messages, assistantId, threadId, userId } = await req.json();
      
      // Get user data if userId is provided
      let userData = null;
      if (userId) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (!error && data) {
          userData = data;
        }
      }
      
      const response = await chatWithAssistant(messages, assistantId, threadId, userData);
      return new Response(JSON.stringify(response), {
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
      
      const response = await uploadFile(file, assistantId, threadId);
      return new Response(JSON.stringify(response), {
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

async function createAssistant() {
  try {
    const response = await fetch("https://api.picaos.com/v1/passthrough/v1/assistants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-pica-secret": PICA_SECRET_KEY,
        "x-pica-connection-key": PICA_OPENAI_CONNECTION_KEY,
        "x-pica-action-id": PICA_ACTION_ID,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        name: "Tech Career & Learning AI Coach",
        description: "A friendly AI chatbot for tech career guidance, personalized learning roadmaps, resume review (with file upload), code debugging/tips (with file upload), and tool/resource suggestions. Supports PDF, DOCX, CSV, PY, JS files. Uses psychology-based insights and can switch language using Lingo. Provides clear, structured, and supportive feedback.",
        instructions: `You are a friendly, expert AI coach for tech careers. Help students, career switchers, and job-seekers with:
1. Tech career guidance (explore roles, skills, and job search strategies)
2. Personalized learning roadmaps (step-by-step, tailored to user goals)
3. Resume review (accept PDF, DOCX, CSV; give actionable, structured feedback)
4. Code debugging and tips (accept PY, JS, CSV; explain issues and suggest improvements)
5. Suggest tools and study resources (books, sites, courses, communities)
Always:
- Use deep analysis and psychology-based insights
- Support file uploads for resume/code review
- Offer language switch via Lingo if user requests
- Use a friendly, clear tone and structured feedback
- Ask clarifying questions if needed
- If reviewing a file, summarize key findings and suggest next steps
- If user requests, switch to Claude for deeper analysis
- If user requests, switch language using Lingo
- Never make up facts; cite resources if possible
- Always encourage and empower the user
`
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to create assistant: ${JSON.stringify(errorData)}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating assistant:", error);
    throw error;
  }
}

async function chatWithAssistant(messages, assistantId, threadId, userData = null) {
  try {
    // Create a thread if threadId is not provided
    if (!threadId) {
      const threadResponse = await fetch("https://api.picaos.com/v1/passthrough/v1/threads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-pica-secret": PICA_SECRET_KEY,
          "x-pica-connection-key": PICA_OPENAI_CONNECTION_KEY,
          "x-pica-action-id": PICA_ACTION_ID,
        },
        body: JSON.stringify({}),
      });

      if (!threadResponse.ok) {
        const errorData = await threadResponse.json();
        throw new Error(`Failed to create thread: ${JSON.stringify(errorData)}`);
      }

      const threadData = await threadResponse.json();
      threadId = threadData.id;
    }

    // Add user context if available
    if (userData) {
      await fetch(`https://api.picaos.com/v1/passthrough/v1/threads/${threadId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-pica-secret": PICA_SECRET_KEY,
          "x-pica-connection-key": PICA_OPENAI_CONNECTION_KEY,
          "x-pica-action-id": PICA_ACTION_ID,
        },
        body: JSON.stringify({
          role: "user",
          content: `[SYSTEM: This is context about the user, not a message from them. The user's name is ${userData.name}. They are learning to become a ${userData.career_path || "developer"}. They have completed ${userData.completed_lessons} lessons and have ${userData.total_xp} XP. Their learning streak is ${userData.streak} days.]`,
          metadata: {
            hidden: true
          }
        }),
      });
    }

    // Add the latest user message
    const latestMessage = messages[messages.length - 1];
    const messageResponse = await fetch(`https://api.picaos.com/v1/passthrough/v1/threads/${threadId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-pica-secret": PICA_SECRET_KEY,
        "x-pica-connection-key": PICA_OPENAI_CONNECTION_KEY,
        "x-pica-action-id": PICA_ACTION_ID,
      },
      body: JSON.stringify({
        role: "user",
        content: latestMessage.content,
      }),
    });

    if (!messageResponse.ok) {
      const errorData = await messageResponse.json();
      throw new Error(`Failed to add message: ${JSON.stringify(errorData)}`);
    }

    // Run the assistant
    const runResponse = await fetch(`https://api.picaos.com/v1/passthrough/v1/threads/${threadId}/runs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-pica-secret": PICA_SECRET_KEY,
        "x-pica-connection-key": PICA_OPENAI_CONNECTION_KEY,
        "x-pica-action-id": PICA_ACTION_ID,
      },
      body: JSON.stringify({
        assistant_id: assistantId,
      }),
    });

    if (!runResponse.ok) {
      const errorData = await runResponse.json();
      throw new Error(`Failed to run assistant: ${JSON.stringify(errorData)}`);
    }

    const runData = await runResponse.json();
    const runId = runData.id;

    // Poll for run completion
    let runStatus = runData.status;
    let attempts = 0;
    const maxAttempts = 30; // 30 seconds timeout
    
    while (runStatus !== "completed" && runStatus !== "failed" && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      
      const checkRunResponse = await fetch(`https://api.picaos.com/v1/passthrough/v1/threads/${threadId}/runs/${runId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-pica-secret": PICA_SECRET_KEY,
          "x-pica-connection-key": PICA_OPENAI_CONNECTION_KEY,
          "x-pica-action-id": PICA_ACTION_ID,
        },
      });
      
      if (!checkRunResponse.ok) {
        const errorData = await checkRunResponse.json();
        throw new Error(`Failed to check run status: ${JSON.stringify(errorData)}`);
      }
      
      const checkRunData = await checkRunResponse.json();
      runStatus = checkRunData.status;
      attempts++;
    }
    
    if (runStatus !== "completed") {
      throw new Error(`Run did not complete in time. Status: ${runStatus}`);
    }

    // Get the messages
    const messagesResponse = await fetch(`https://api.picaos.com/v1/passthrough/v1/threads/${threadId}/messages`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-pica-secret": PICA_SECRET_KEY,
        "x-pica-connection-key": PICA_OPENAI_CONNECTION_KEY,
        "x-pica-action-id": PICA_ACTION_ID,
      },
    });

    if (!messagesResponse.ok) {
      const errorData = await messagesResponse.json();
      throw new Error(`Failed to get messages: ${JSON.stringify(errorData)}`);
    }

    const messagesData = await messagesResponse.json();
    
    // Filter out hidden messages and return the latest assistant message
    const visibleMessages = messagesData.data.filter(msg => 
      !msg.metadata || !msg.metadata.hidden
    );
    
    // Get the latest assistant message
    const assistantMessages = visibleMessages.filter(msg => msg.role === "assistant");
    const latestAssistantMessage = assistantMessages.length > 0 ? assistantMessages[0] : null;

    return {
      threadId,
      assistantId,
      message: latestAssistantMessage,
      allMessages: visibleMessages
    };
  } catch (error) {
    console.error("Error chatting with assistant:", error);
    throw error;
  }
}

async function uploadFile(file, assistantId, threadId) {
  try {
    // First, upload the file to OpenAI
    const formData = new FormData();
    formData.append("file", file);
    formData.append("purpose", "assistants");

    const uploadResponse = await fetch("https://api.picaos.com/v1/passthrough/v1/files", {
      method: "POST",
      headers: {
        "x-pica-secret": PICA_SECRET_KEY,
        "x-pica-connection-key": PICA_OPENAI_CONNECTION_KEY,
        "x-pica-action-id": PICA_ACTION_ID,
      },
      body: formData,
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      throw new Error(`Failed to upload file: ${JSON.stringify(errorData)}`);
    }

    const fileData = await uploadResponse.json();
    const fileId = fileData.id;

    // Attach the file to the thread
    const attachResponse = await fetch(`https://api.picaos.com/v1/passthrough/v1/threads/${threadId}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-pica-secret": PICA_SECRET_KEY,
        "x-pica-connection-key": PICA_OPENAI_CONNECTION_KEY,
        "x-pica-action-id": PICA_ACTION_ID,
      },
      body: JSON.stringify({
        role: "user",
        content: "I've uploaded a file for you to analyze.",
        file_ids: [fileId],
      }),
    });

    if (!attachResponse.ok) {
      const errorData = await attachResponse.json();
      throw new Error(`Failed to attach file: ${JSON.stringify(errorData)}`);
    }

    return {
      fileId,
      threadId,
      assistantId,
      success: true,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}