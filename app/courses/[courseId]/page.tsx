/**
 * Course Overview Page
 *
 * Dynamic route: /courses/[courseId]
 * - courseId comes from the URL (e.g. /courses/abc-123 → courseId = "abc-123")
 * - We use it to fetch this specific course and its lessons from Supabase
 *
 * We check if the user has purchased this course (hasAccess) to show/hide lesson links.
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LessonList } from "@/components/course/LessonList";
import { BuyCourseButton } from "@/components/course/BuyCourseButton";

type PageProps = {
  params: Promise<{ courseId: string }>;
};

export default async function CourseOverviewPage({ params }: PageProps) {
  const { courseId } = await params;
  const supabase = await createClient();

  // Fetch the course
  const { data: course, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", courseId)
    .single();

  if (error || !course) {
    notFound(); // Renders 404 page
  }

  // Fetch lessons, ordered by sort_order
  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, title, sort_order")
    .eq("course_id", courseId)
    .order("sort_order", { ascending: true });

  // Check if the current user has purchased this course
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let hasAccess = false;
  if (user) {
    const { data: purchase } = await supabase
      .from("purchases")
      .select("id")
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .maybeSingle();
    hasAccess = !!purchase;
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white px-4 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-zinc-900">
            CourseSite
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/courses"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              Courses
            </Link>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12">
        <Link
          href="/courses"
          className="mb-6 inline-block text-sm text-zinc-600 hover:text-zinc-900"
        >
          ← Back to courses
        </Link>

        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-zinc-900">{course.title}</h1>
          <p className="mt-2 text-zinc-600">
            {course.description || "No description."}
          </p>

          {!hasAccess && (
            <div className="mt-4">
              <p className="mb-2 text-sm text-zinc-600">
                Purchase this course to unlock all lesson videos.
              </p>
              <BuyCourseButton courseId={courseId} />
            </div>
          )}
        </div>

        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900">Lessons</h2>
          <LessonList
            courseId={courseId}
            lessons={lessons ?? []}
            hasAccess={hasAccess}
          />
        </div>
      </main>
    </div>
  );
}
