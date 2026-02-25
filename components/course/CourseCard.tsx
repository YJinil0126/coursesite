import Link from "next/link";
import Image from "next/image";

/**
 * CourseCard: Displays a course preview with title, description, and link.
 * Used on the dashboard (purchased courses) and course catalog.
 *
 * This is a Server Component – no "use client", no hooks.
 * It receives data as props from its parent.
 */
type CourseCardProps = {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  /** If true, show "Continue" instead of "View" (user owns it) */
  isPurchased?: boolean;
};

export function CourseCard({
  id,
  title,
  description,
  imageUrl,
  isPurchased = false,
}: CourseCardProps) {
  return (
    <Link
      href={`/courses/${id}`}
      className="group block cursor-pointer overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md"
    >
      {/* Placeholder or image – Next.js Image requires width/height or fill */}
      <div className="aspect-video bg-zinc-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            width={400}
            height={225}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-400">
            No image
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-zinc-900 group-hover:text-blue-600">
          {title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-zinc-600">
          {description || "No description."}
        </p>
        <p className="mt-2 text-sm font-medium text-blue-600">
          {isPurchased ? "Continue learning →" : "View course →"}
        </p>
      </div>
    </Link>
  );
}
