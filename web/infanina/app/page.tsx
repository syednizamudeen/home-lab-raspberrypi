import Hero from "@/components/home/Hero";
import AIShowcase from "@/components/home/AIShowcase";
import TechGrid from "@/components/home/TechGrid";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <AIShowcase />
      <TechGrid />
      <section id="contact" className="py-24 bg-blue-600 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Business?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Let's discuss how we can tailor our solutions to your unique needs.
          </p>
          <a
            href="mailto:hello@infanina.com"
            className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-lg font-bold text-blue-600 hover:bg-gray-100 transition-colors shadow-lg"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  );
}
