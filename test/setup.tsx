import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// next/image does real image optimization that jsdom can't run, and it
// isn't what these tests are checking, so render it as a plain <img>.
vi.mock("next/image", () => ({
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

Element.prototype.scrollTo = vi.fn() as any;
