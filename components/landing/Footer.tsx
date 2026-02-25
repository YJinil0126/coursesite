"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-xl font-bold tracking-tight text-zinc-900">
            CourseSite
          </div>
          <div className="flex gap-8">
            <Link
              href="/#how-it-works"
              className="text-sm text-zinc-600 transition hover:text-zinc-900"
            >
              How it works
            </Link>
            <Link
              href="/#courses"
              className="text-sm text-zinc-600 transition hover:text-zinc-900"
            >
              Courses
            </Link>
            <Link
              href="/#pricing"
              className="text-sm text-zinc-600 transition hover:text-zinc-900"
            >
              Pricing
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-zinc-600 transition hover:text-zinc-900"
            >
              Dashboard
            </Link>
          </div>
        </div>
        <p className="mt-8 text-center text-sm text-zinc-500 md:text-left">
          © {new Date().getFullYear()} CourseSite. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
