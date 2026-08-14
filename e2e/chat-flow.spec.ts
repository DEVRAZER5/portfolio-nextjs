import { test, expect } from "@playwright/test";

// End-to-end test for the primary flow: open the chat, ask about a real
// project, see the assistant's answer appear. The real Anthropic API is
// never called, the /api/chat route is intercepted so the test is fast
// and doesn't need billing credit.

test("visitor can ask about a project and see a streamed answer", async ({ page }) => {
  await page.route("**/api/chat", async (route) => {
    // A minimal fake UI-message-stream response: one text chunk, done.
    const body = [
      `data: {"type":"text-delta","id":"0","delta":"The Amazon Clone is an e-commerce practice site."}\n\n`,
      `data: {"type":"finish"}\n\n`,
      `data: [DONE]\n\n`,
    ].join("");

    await route.fulfill({
      status: 200,
      contentType: "text/event-stream",
      body,
    });
  });

  await page.goto("/chat");

  await expect(page.getByRole("heading", { name: "Ask about my work" })).toBeVisible();

  // Use one of the example prompts, the same click-to-fill path a real
  // first-time visitor would use.
  await page.getByRole("button", { name: /tell me about the amazon clone/i }).click();

  const input = page.getByPlaceholder("Ask about a project...");
  await expect(input).toHaveValue("Tell me about the Amazon clone");

  await page.getByRole("button", { name: "Send" }).click();

  // The user's own message shows up immediately.
  await expect(page.getByText("Tell me about the Amazon clone")).toBeVisible();

  // The streamed assistant reply eventually appears.
  await expect(
    page.getByText(/e-commerce practice site/i)
  ).toBeVisible({ timeout: 10_000 });
});
