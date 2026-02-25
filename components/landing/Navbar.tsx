"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80"
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold tracking-tight text-zinc-900">
          CourseSite
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/#how-it-works"
            className="text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
          >
            How it works
          </Link>
          <Link
            href="/courses"
            className="text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
          >
            Courses
          </Link>
          <Link
            href="/#pricing"
            className="text-sm font-medium text-zinc-600 transition hover:text-zinc-900"
          >
            Pricing
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/sign-in"
            className="hidden text-sm font-medium text-zinc-600 transition hover:text-zinc-900 sm:inline"
          >
            Sign In
          </Link>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </nav>
    </motion.header>
  );
}
