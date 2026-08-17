import ContactForm from "./contact-form";

export default function ContactPage() {
  return (
    <section className="max-w-xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-ink mb-2">Contact</h1>
      <p className="text-muted mb-8">
        Want to work together, or just want to say hi? Send a message below
         and it goes straight to my inbox.
      </p>

      <ContactForm />

      <p className="text-xs text-muted mt-8">
        Prefer email directly?{" "}
        <a href="mailto:softver.developer26@gmail.com" className="text-accent underline">
          softver.developer26@gmail.com
        </a>
      </p>
    </section>
  );
}
