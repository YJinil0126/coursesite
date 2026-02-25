/**
 * Lesson / Video Player Page
 *
 * Dynamic route: /courses/[courseId]/[lessonId]
 * - We fetch the current lesson and all lessons (for prev/next nav)
 * - We check purchase (hasAccess) before allowing video playback
 * - VideoPlayer is a Client Component (Mux Player needs interactivity)
 */
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { VideoPlayer } from "@/components/video/VideoPlayer";

type PageProps = {
  params: Promise<{ courseId: string; lessonId: string }>;
};

export default async function LessonPage({ params }: PageProps) {
  const { courseId, lessonId } = await params;
  const supabase = await createClient();

  // Fetch the current lesson
  const { data: lesson, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .eq("course_id", courseId)
    .single();

  if (error || !lesson) {
    notFound();
  }

  // Fetch all lessons for prev/next navigation
  const { data: allLessons } = await supabase
    .from("lessons")
    .select("id, title, sort_order")
    .eq("course_id", courseId)
    .order("sort_order", { ascending: true });

  const lessons = allLessons ?? [];
  const currentIndex = lessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < lessons.length - 1
      ? lessons[currentIndex + 1]
      : null;

  // Check if user has purchased this course
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

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-zinc-50 px-4 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-xl font-bold text-zinc-900">Lesson locked</h1>
          <p className="mt-2 text-zinc-600">
            Purchase the course to watch this lesson.
          </p>
          <Link
            href={`/courses/${courseId}`}
            className="mt-4 inline-block text-blue-600 hover:underline"
          >
            ← Back to course
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      <header className="border-b border-zinc-800 bg-zinc-900 px-4 py-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-white">
            CourseSite
          </Link>
          <Link
            href={`/courses/${courseId}`}
            className="text-sm text-zinc-400 hover:text-white"
          >
            ← Back to course
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-4 text-xl font-semibold text-white">{lesson.title}</h1>

        {lesson.mux_playback_id ? (
          <VideoPlayer
            playbackId={lesson.mux_playback_id}
            title={lesson.title}
          />
        ) : (
          <div className="aspect-video w-full flex items-center justify-center rounded-lg bg-zinc-800">
            <p className="text-zinc-400">
              No video yet. Add a mux_playback_id to this lesson in Supabase, or
              upload a video in Mux Dashboard and paste the playback ID here.
            </p>
          </div>
        )}

        {/* Prev / Next navigation */}
        <nav className="mt-6 flex items-center justify-between border-t border-zinc-800 pt-6">
          {prevLesson ? (
            <Link
              href={`/courses/${courseId}/${prevLesson.id}`}
              className="text-sm text-zinc-400 hover:text-white"
            >
              ← {prevLesson.title}
            </Link>
          ) : (
            <span />
          )}
          {nextLesson ? (
            <Link
              href={`/courses/${courseId}/${nextLesson.id}`}
              className="text-sm text-zinc-400 hover:text-white"
            >
              {nextLesson.title} →
            </Link>
          ) : (
            <Link
              href={`/courses/${courseId}`}
              className="text-sm text-zinc-400 hover:text-white"
            >
              Back to course
            </Link>
          )}
        </nav>
      </main>
    </div>
  );
}
