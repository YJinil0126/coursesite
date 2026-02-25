"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function CTA() {
  return (
    <section
      id="pricing"
      className="border-t border-zinc-200 bg-zinc-900 px-4 py-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-3xl text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold tracking-tight text-white"
        >
          Ready to get started?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-4 text-lg text-zinc-300"
        >
          Start your free trial today. No credit card required. Cancel anytime.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-8"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-semibold text-zinc-900 transition hover:bg-zinc-100"
            >
              Get Started
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
