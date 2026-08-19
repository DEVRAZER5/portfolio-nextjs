import "./globals.css";
import Nav from "./components/Nav";

export const metadata = {
  metadataBase: new URL("https://portfolio-nextjs-kappa-lime.vercel.app"),
  title: "Rifet Mehić — Frontend Developer Portfolio",
  description:
    "Frontend developer portfolio by Rifet Mehić (RM), an Informatics Engineer building clean, functional websites and AI-powered features.",
  openGraph: {
    title: "Rifet Mehić — Frontend Developer Portfolio",
    description:
      "Frontend developer portfolio by Rifet Mehić (RM), an Informatics Engineer building clean, functional websites and AI-powered features.",
    url: "https://portfolio-nextjs-kappa-lime.vercel.app",
    siteName: "Rifet Mehić — Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Rifet Mehić — Frontend Developer Portfolio",
    description:
      "Frontend developer portfolio by Rifet Mehić (RM), an Informatics Engineer building clean, functional websites and AI-powered features.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
      </body>
    </html>
  );
}
