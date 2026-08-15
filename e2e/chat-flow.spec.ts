import { test, expect } from "@playwright/test";

// End-to-end test for the primary flow: open the chat, use an example
// prompt, send it, and confirm the message reaches the server. The real
// Anthropic API is never called, /api/chat is intercepted.

test("visitor can compose and send a message", async ({ page }) => {
  let requestReceived = false;

  await page.route("**/api/chat", async (route) => {
    requestReceived = true;
    await route.fulfill({
      status: 200,
      contentType: "text/event-stream",
      body: "",
    });
  });

  await page.goto("/chat");

  await expect(page.getByRole("heading", { name: "Ask about my work" })).toBeVisible();

  await page.getByRole("button", { name: /tell me about the amazon clone/i }).click();

  const input = page.getByPlaceholder("Ask about a project...");
  await expect(input).toHaveValue("Tell me about the Amazon clone");

  await page.getByRole("button", { name: "Send" }).click();

  await expect(page.getByText("Tell me about the Amazon clone")).toBeVisible();
  await expect.poll(() => requestReceived).toBe(true);
});