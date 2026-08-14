import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useChat } from "@ai-sdk/react";
import ChatPage from "@/app/chat/page";

// The AI route is never called for real in these tests. useChat is fully
// mocked so every test controls exactly what state the component sees.
vi.mock("@ai-sdk/react", () => ({
  useChat: vi.fn(),
}));

const mockUseChat = vi.mocked(useChat);

function baseMock(overrides: Partial<ReturnType<typeof useChat>> = {}) {
  return {
    messages: [],
    sendMessage: vi.fn(),
    status: "ready",
    stop: vi.fn(),
    error: undefined,
    regenerate: vi.fn(),
    ...overrides,
  } as unknown as ReturnType<typeof useChat>;
}

beforeEach(() => {
  mockUseChat.mockReset();
});

describe("ChatPage — empty state", () => {
  it("shows clickable example prompts when there are no messages yet", () => {
    mockUseChat.mockReturnValue(baseMock());
    render(<ChatPage />);

    expect(
      screen.getByRole("button", { name: /tell me about the amazon clone/i })
    ).toBeInTheDocument();
  });

  it("fills the input when an example prompt is clicked", async () => {
    mockUseChat.mockReturnValue(baseMock());
    render(<ChatPage />);

    await userEvent.click(
      screen.getByRole("button", { name: /tell me about the amazon clone/i })
    );

    expect(
      screen.getByPlaceholderText(/ask about a project/i)
    ).toHaveValue("Tell me about the Amazon clone");
  });
});

describe("ChatPage — pending state", () => {
  it("shows a thinking skeleton while a response is being generated", () => {
    mockUseChat.mockReturnValue(
      baseMock({
        status: "submitted",
        messages: [{ id: "1", role: "user", parts: [{ type: "text", text: "hi" }] }],
      })
    );
    render(<ChatPage />);

    // The skeleton bubble has no visible text, so assert on the input
    // being disabled to "Stop" instead, the observable sign that a
    // request is in flight.
    expect(screen.getByRole("button", { name: /stop/i })).toBeInTheDocument();
  });
});

describe("ChatPage — streaming / message rendering", () => {
  it("renders a streamed assistant text message", () => {
    mockUseChat.mockReturnValue(
      baseMock({
        status: "streaming",
        messages: [
          {
            id: "1",
            role: "assistant",
            parts: [{ type: "text", text: "Here is the Amazon clone case study." }],
          },
        ],
      })
    );
    render(<ChatPage />);

    expect(
      screen.getByText(/here is the amazon clone case study/i)
    ).toBeInTheDocument();
  });
});

describe("ChatPage — validated form", () => {
  it("does not send an empty message", async () => {
    const sendMessage = vi.fn();
    mockUseChat.mockReturnValue(baseMock({ sendMessage }));
    render(<ChatPage />);

    fireEvent.submit(screen.getByPlaceholderText(/ask about a project/i).closest("form")!);

    expect(sendMessage).not.toHaveBeenCalled();
  });

  it("sends the typed message on submit", async () => {
    const sendMessage = vi.fn();
    mockUseChat.mockReturnValue(baseMock({ sendMessage }));
    render(<ChatPage />);

    const input = screen.getByPlaceholderText(/ask about a project/i);
    await userEvent.type(input, "Tell me about the logo project");
    await userEvent.click(screen.getByRole("button", { name: /send/i }));

    expect(sendMessage).toHaveBeenCalledWith({ text: "Tell me about the logo project" });
  });
});

describe("ChatPage — error state", () => {
  it("shows an error banner with a retry action", () => {
    mockUseChat.mockReturnValue(
      baseMock({ error: new Error("network failure") })
    );
    render(<ChatPage />);

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^retry$/i })).toBeInTheDocument();
  });

  it("calls regenerate exactly once when retry is clicked", async () => {
    const regenerate = vi.fn();
    mockUseChat.mockReturnValue(
      baseMock({ error: new Error("network failure"), regenerate })
    );
    render(<ChatPage />);

    await userEvent.click(screen.getByRole("button", { name: /^retry$/i }));

    expect(regenerate).toHaveBeenCalledTimes(1);
  });

  it("shows the rate-limit specific message when the error is a rate limit", () => {
    mockUseChat.mockReturnValue(
      baseMock({ error: new Error("RATE_LIMIT") })
    );
    render(<ChatPage />);

    expect(screen.getByText(/getting a lot of requests/i)).toBeInTheDocument();
  });
});

describe("ChatPage — tool result rendering", () => {
  it("renders a real project card when the tool result is found", () => {
    mockUseChat.mockReturnValue(
      baseMock({
        messages: [
          {
            id: "1",
            role: "assistant",
            parts: [
              {
                type: "tool-getProjectDetails",
                state: "output-available",
                output: {
                  found: true,
                  name: "Amazon Clone",
                  summary: "E-commerce practice site.",
                  image: "/amazon_clone_clean.png",
                  outcome: "Works end to end.",
                },
              },
            ],
          },
        ],
      })
    );
    render(<ChatPage />);

    expect(screen.getByText("Amazon Clone")).toBeInTheDocument();
    expect(screen.getByText(/works end to end/i)).toBeInTheDocument();
  });

  it("renders a not-found card when the tool result has no match", () => {
    mockUseChat.mockReturnValue(
      baseMock({
        messages: [
          {
            id: "1",
            role: "assistant",
            parts: [
              {
                type: "tool-getProjectDetails",
                state: "output-available",
                output: {
                  found: false,
                  query: "a project that doesn't exist",
                  availableProjects: ["Amazon Clone", "YouTube Clone"],
                },
              },
            ],
          },
        ],
      })
    );
    render(<ChatPage />);

    expect(screen.getByText(/couldn't find/i)).toBeInTheDocument();
    expect(screen.getByText(/amazon clone, youtube clone/i)).toBeInTheDocument();
  });

  it("renders a designed error state when a tool call fails, not raw JSON", () => {
    mockUseChat.mockReturnValue(
      baseMock({
        messages: [
          {
            id: "1",
            role: "assistant",
            parts: [
              {
                type: "tool-getProjectDetails",
                state: "output-error",
                errorText: "lookup service unavailable",
              },
            ],
          },
        ],
      })
    );
    render(<ChatPage />);

    expect(screen.getByText(/lookup service unavailable/i)).toBeInTheDocument();
    // Confirms it's rendered as prose, not a dumped object.
    expect(screen.queryByText(/^\{/)).not.toBeInTheDocument();
  });
});
