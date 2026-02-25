/**
 * Courses Catalog Page
 *
 * Lists all courses. No auth required – the catalog is public.
 * Users can click into a course to see the overview; lesson videos require purchase.
 */
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CourseCard } from "@/components/course/CourseCard";

export default async function CoursesPage() {
  const supabase = await createClient();

  const { data: courses } = await supabase
    .from("courses")
    .select("id, title, description, image_url");

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-zinc-900">
            CourseSite
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              Dashboard
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              Home
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-2xl font-bold text-zinc-900">All Courses</h1>
        <p className="mt-1 text-zinc-600">
          Browse our catalog. Sign in and purchase to unlock video lessons.
        </p>

        {!courses || courses.length === 0 ? (
          <p className="mt-6 text-zinc-500">
            No courses yet. Add courses in Supabase Table Editor, or run the
            seed SQL in <code className="rounded bg-zinc-200 px-1">supabase/seed.sql</code>.
          </p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                description={course.description}
                imageUrl={course.image_url}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
