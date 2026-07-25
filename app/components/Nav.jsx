import Link from "next/link";

export default function Nav() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="max-w-4xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="font-bold text-ink text-lg">
          Rifet Mehić
        </Link>
        <div className="flex gap-6 text-sm text-muted">
          <Link href="/" className="hover:text-accent">
            Home
          </Link>
          <Link href="/projects" className="hover:text-accent">
            Projects
          </Link>
          <Link href="/about" className="hover:text-accent">
            About
          </Link>
          <Link href="/contact" className="hover:text-accent">
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
}
