// app/api/chat/route.ts
//
// Server-side route handler. This is the only place the Anthropic
// API key is used, it reads it from process.env, which is never sent
// to the browser. The client never sees the key.

import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { SYSTEM_PROMPT, CHAT_MODEL } from "@/lib/chat-config";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic(CHAT_MODEL),
    system: SYSTEM_PROMPT,
    messages,
  });

  // Streams the response back token by token as it's generated.
  return result.toDataStreamResponse();
}
