// lib/tools.ts
//
// Server-side tool definitions for the portfolio chat.
// Documented tool contract lives in README.md, keep both in sync.

import { tool } from "ai";
import { z } from "zod";
import { projects } from "@/data/projects";

export const getProjectDetails = tool({
  description:
    "Look up full details for one of Rifet's real projects by name or slug. Use this whenever the visitor asks about a specific project (e.g. 'tell me about the Amazon clone') instead of answering from memory, so the answer is always grounded in the real case study data.",
  inputSchema: z.object({
    query: z
      .string()
      .describe(
        "The project name or a close match, e.g. 'amazon clone', 'logo redesign', 'youtube clone', 'js fundamentals'."
      ),
  }),
  execute: async ({ query }) => {
    const normalized = query.toLowerCase();

    const match = projects.find(
      (p) =>
        p.slug.includes(normalized.replace(/\s+/g, "-")) ||
        p.name.toLowerCase().includes(normalized)
    );

    if (!match) {
      // Structured error, not a thrown exception, so the client can
      // render a designed error state instead of crashing.
      return {
        found: false,
        query,
        availableProjects: projects.map((p) => p.name),
      };
    }

    return {
      found: true,
      name: match.name,
      summary: match.summary,
      image: match.image,
      problem: match.problem,
      whatIDid: match.whatIDid,
      outcome: match.outcome,
    };
  },
});

export const tools = {
  getProjectDetails,
};
