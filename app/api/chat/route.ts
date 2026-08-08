// app/api/chat/route.ts
//
// Server-side route handler. API key stays here, never sent to the client.
// Passes the getProjectDetails tool to the model, so it can pull real
// project data instead of answering from the system prompt alone.

import { anthropic } from "@ai-sdk/anthropic";
import { streamText, convertToModelMessages } from "ai";
import { SYSTEM_PROMPT, CHAT_MODEL } from "@/lib/chat-config";
import { tools } from "@/lib/tools";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const modelMessage = await convertToModelMessages(messages);
  console.log("DEBUG messages:", JSON.stringify(messages));

  const result = streamText({
    model: anthropic(CHAT_MODEL),
    system: SYSTEM_PROMPT,
    messages: modelMessage,
    tools,
    // Allow the model to call a tool and then use the result to write
    // its final answer, instead of stopping right after the tool call.
    stopWhen: ({ steps }) => steps.length >= 3,
  });

  // Streams back as UI message parts (text, tool-*, with the
  // input-streaming/input-available/output-available/output-error
  // states the client renders).
  return result.toUIMessageStreamResponse();
}
