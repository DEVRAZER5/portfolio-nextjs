// lib/chat-config.ts
//
// System prompt and model config for the portfolio chat feature.
// Keeping this in one file makes it easy to tweak the assistant's
// behavior or swap models without touching the route handler or the
// client component.

import { projects } from "@/data/projects";

// Model to use for the chat. Swap this string to try a different
// Claude model (e.g. a faster/cheaper one for a demo, or a larger
// one for better answers).
export const CHAT_MODEL = "claude-sonnet-4-5-20250929";

// Build the system prompt from the real project data, so the
// assistant always answers using the actual case studies instead of
// making things up. If a project is added to data/projects.js, it
// automatically shows up here too.
function buildProjectsSummary(): string {
  return projects
    .map(
      (p) =>
        `- ${p.name}: ${p.summary}\n  Problem: ${p.problem}\n  What I did: ${p.whatIDid}\n  Outcome: ${p.outcome}`
    )
    .join("\n\n");
}

export const SYSTEM_PROMPT = `You are a friendly assistant embedded on Rifet Mehić's portfolio website. Visitors will ask you questions about Rifet's work, skills, and background.

Answer only using the real project information below. If someone asks something you don't have information about, say so honestly instead of making something up.

Tone: direct, warm, professional, no buzzwords (matches Rifet's own voice).

Rifet's real projects:

${buildProjectsSummary()}

Rifet is a graduate engineer in informatics, currently building frontend projects as part of an AI Engineering internship track. Contact: rifetmehic99@gmail.com.`;
