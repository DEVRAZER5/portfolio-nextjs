"use client";

import Image from "next/image";

// --- Tool result component -------------------------------------------------
// Renders the actual output of getProjectDetails as a real card, not JSON.

export function ProjectCard({ output }: { output: any }) {
  if (!output.found) {
    return (
      <div className="border border-amber-200 bg-amber-50 rounded-xl p-4 text-sm">
        <p className="font-semibold text-amber-800 mb-1">
          Couldn't find "{output.query}"
        </p>
        <p className="text-amber-700">
          Available projects: {output.availableProjects.join(", ")}
        </p>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 bg-white rounded-xl overflow-hidden max-w-sm">
      {output.image && (
        <div className="relative w-full h-32 bg-gray-100">
          <Image src={output.image} alt={output.name} fill className="object-cover" />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-ink mb-1">{output.name}</h3>
        <p className="text-xs text-muted mb-2">{output.summary}</p>
        <p className="text-xs text-ink">
          <span className="font-medium">Outcome: </span>
          {output.outcome}
        </p>
      </div>
    </div>
  );
}

// --- Tool lifecycle renderer -------------------------------------------------
// Each of the four tool part states gets its own distinct visual treatment,
// per the FE-07 assignment: no dumping raw JSON at any stage.

export function ToolPart({ part }: { part: any }) {
  switch (part.state) {
    case "input-streaming":
      return (
        <div className="border border-gray-200 bg-gray-50 rounded-xl p-4 text-sm text-muted animate-pulse">
          Preparing to look up a project...
        </div>
      );

    case "input-available":
      return (
        <div className="border border-gray-200 bg-gray-50 rounded-xl p-4 text-sm text-muted flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          Looking up: {part.input?.query}
        </div>
      );

    case "output-available":
      return <ProjectCard output={part.output} />;

    case "output-error":
      return (
        <div className="border border-red-200 bg-red-50 rounded-xl p-4 text-sm text-red-700">
          Something went wrong looking that up: {part.errorText}
        </div>
      );

    default:
      return null;
  }
}

// --- Thinking skeleton -------------------------------------------------
// Matches the shape of a real assistant bubble so nothing shifts layout
// when the actual text streams in and replaces it. role="status" +
// aria-label make this announced to screen readers and queryable in
// tests without a test id.

export function ThinkingBubble() {
  return (
    <div className="flex justify-start" role="status" aria-label="Assistant is thinking">
      <div className="max-w-[85%] rounded-2xl rounded-bl-sm border border-gray-200 bg-white px-4 py-3 space-y-2">
        <div className="h-2.5 w-40 rounded-full bg-gray-200 animate-pulse" />
        <div className="h-2.5 w-24 rounded-full bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
}

// --- Empty state example prompts -------------------------------------------------

export const EXAMPLE_PROMPTS = [
  "Tell me about the Amazon clone",
  "What's the JS Fundamentals project?",
  "What are Rifet's strengths?",
];

// --- Message list -------------------------------------------------
// Pure/presentational: takes messages + a thinking flag as props so it
// can be tested directly with hand-built message fixtures, with no
// useChat/network involved.

export function MessageList({
  messages,
  showThinking,
}: {
  messages: any[];
  showThinking: boolean;
}) {
  return (
    <>
      {messages.map((m) => (
        <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
          <div className="max-w-[85%] space-y-2">
            {m.parts?.map((part: any, i: number) => {
              if (part.type === "text") {
                return (
                  <div
                    key={i}
                    className={`rounded-2xl px-4 py-2 text-sm whitespace-pre-wrap ${
                      m.role === "user"
                        ? "bg-accent text-white rounded-br-sm"
                        : "bg-white border border-gray-200 text-ink rounded-bl-sm"
                    }`}
                  >
                    {part.text}
                  </div>
                );
              }

              if (part.type === "tool-getProjectDetails") {
                return <ToolPart key={i} part={part} />;
              }

              return null;
            })}
          </div>
        </div>
      ))}

      {showThinking && <ThinkingBubble />}
    </>
  );
}
