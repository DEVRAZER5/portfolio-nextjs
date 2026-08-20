import "./globals.css";
import Nav from "./components/Nav";
import {Analytics} from "@vercel/analytics/next";

export const metadata = {
  metadataBase: new URL("https://portfolio-nextjs-kappa-lime.vercel.app"),
  title: "RM — Frontend Developer Portfolio",
  description:
    "Frontend developer portfolio by RM, an Informatics Engineer building clean, functional websites and AI-powered features.",
  openGraph: {
    title: "RM — Frontend Developer Portfolio",
    description:
      "Frontend developer portfolio by RM, an Informatics Engineer building clean, functional websites and AI-powered features.",
    url: "https://portfolio-nextjs-kappa-lime.vercel.app",
    siteName: "RM — Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "RM — Frontend Developer Portfolio",
    description:
      "Frontend developer portfolio by RM, an Informatics Engineer building clean, functional websites and AI-powered features.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
        <Analytics/>
      </body>
    </html>
  );
}
