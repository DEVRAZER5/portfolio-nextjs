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
  try {
    const { messages } = await req.json();
    const modelMessage = await convertToModelMessages(messages);

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
    return result.toUIMessageStreamResponse({
      // Fires for errors that happen mid-stream (model overloaded,
      // upstream connection dropped, etc). Whatever string this returns
      // becomes the `error` the client sees via useChat, so keep it
      // generic and non-leaky, with a distinct marker for rate limits
      // so the UI can show a more specific message.
      onError: (error) => {
        console.error("Chat stream error:", error);
        const raw = error instanceof Error ? error.message : String(error);
        if (/429|rate.?limit|overloaded/i.test(raw)) {
          return "RATE_LIMIT";
        }
        return "STREAM_ERROR";
      },
    });
  } catch (error) {
    // Setup-time failures: bad request body, missing config, etc.
    // Return a normal error response so useChat's `error` state picks
    // it up instead of the client hanging or the route 500-ing raw.
    console.error("Chat route setup error:", error);
    return new Response("Failed to start the chat.", { status: 500 });
  }
}
