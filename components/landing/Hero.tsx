"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-zinc-50 to-white px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl md:text-6xl"
        >
          Learn from the best courses,
          <br />
          <span className="text-blue-600">anytime, anywhere</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600"
        >
          Access top-quality video courses across fitness, wellness, and more.
          Flexible access. Expert instructors. Start your free trial today.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-zinc-800"
            >
              Start Free Trial
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/#courses"
              className="inline-flex items-center justify-center rounded-full border-2 border-zinc-300 px-8 py-4 text-base font-semibold text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50"
            >
              Browse Courses
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-zinc-500"
        >
          <span>Yoga</span>
          <span>Strength</span>
          <span>HIIT</span>
          <span>Pilates</span>
          <span>Meditation</span>
        </motion.div>
      </div>
    </section>
  );
}
