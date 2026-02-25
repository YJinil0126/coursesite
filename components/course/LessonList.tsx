"use client";

import Link from "next/link";

/**
 * LessonList: Renders a list of lessons for a course.
 * Each lesson links to /courses/[courseId]/[lessonId].
 *
 * The sort_order from the database determines display order.
 */
type Lesson = {
  id: string;
  title: string;
  sort_order: number;
};

type LessonListProps = {
  courseId: string;
  lessons: Lesson[];
  /** If the user owns the course, they can access videos */
  hasAccess: boolean;
};

export function LessonList({ courseId, lessons, hasAccess }: LessonListProps) {
  if (lessons.length === 0) {
    return (
      <p className="text-zinc-500">No lessons yet. Check back soon!</p>
    );
  }

  return (
    <ul className="divide-y divide-zinc-200">
      {lessons.map((lesson, index) => {
        const href = hasAccess
          ? `/courses/${courseId}/${lesson.id}`
          : "#";

        return (
          <li key={lesson.id}>
            <Link
              href={href}
              className={`flex items-center gap-4 py-4 transition ${
                hasAccess
                  ? "hover:bg-zinc-50"
                  : "cursor-not-allowed opacity-60"
              }`}
              onClick={(e) => !hasAccess && e.preventDefault()}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-sm font-medium text-zinc-700">
                {index + 1}
              </span>
              <span className="flex-1 font-medium text-zinc-900">
                {lesson.title}
              </span>
              {hasAccess ? (
                <span className="text-sm text-blue-600">Watch →</span>
              ) : (
                <span className="text-sm text-zinc-500">Locked</span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
