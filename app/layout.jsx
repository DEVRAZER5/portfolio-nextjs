import "./globals.css";
import Nav from "./components/Nav";

export const metadata = {
  title: "RM  Portfolio",
  description: "Frontend AI Engineering portfolio",
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
