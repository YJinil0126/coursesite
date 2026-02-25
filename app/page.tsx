import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <section
          id="courses"
          className="border-t border-zinc-200 bg-zinc-50 px-4 py-20 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-6xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900">
              Explore our courses
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-zinc-600">
              Browse our catalog and start learning. Sign in to track your progress.
            </p>
            <a
              href="/courses"
              className="mt-6 inline-block rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Browse courses
            </a>
          </div>
        </section>
        <CTA />
        <Footer />
      </main>
    </div>
  );
}
