/**
 * Dashboard Page
 *
 * This is a SERVER COMPONENT (no "use client").
 * - We can use async/await to fetch data directly
 * - Supabase server client reads the user's session from cookies
 * - If not logged in, we redirect to sign-in
 *
 * Data flow:
 * 1. createClient() builds a Supabase client with the user's session (from cookies)
 * 2. getUser() returns the current user or null
 * 3. We fetch purchases (courses this user has bought)
 * 4. We fetch the full course details for those purchases
 * 5. We also fetch all courses for the "Browse" section
 */
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "./SignOutButton";
import { CourseCard } from "@/components/course/CourseCard";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Get the current user from the session (stored in cookies)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in?redirect=/dashboard");
  }

  // Fetch this user's purchases (RLS ensures they only see their own)
  const { data: purchases } = await supabase
    .from("purchases")
    .select("course_id")
    .eq("user_id", user.id);

  const purchasedCourseIds = (purchases ?? []).map((p) => p.course_id);

  // Fetch full course details for purchased courses
  let purchasedCourses: Array<{
    id: string;
    title: string;
    description: string | null;
    image_url: string | null;
  }> = [];

  if (purchasedCourseIds.length > 0) {
    const { data } = await supabase
      .from("courses")
      .select("id, title, description, image_url")
      .in("id", purchasedCourseIds);
    purchasedCourses = data ?? [];
  }

  // Fetch all courses for the "Browse" section (public catalog)
  const { data: allCourses } = await supabase
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
              href="/courses"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              Browse courses
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-zinc-600 hover:text-zinc-900"
            >
              Home
            </Link>
            <span className="text-sm text-zinc-500">{user.email}</span>
            <SignOutButton />
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-12">
        {/* My Courses: courses the user has purchased */}
        <section>
          <h1 className="text-2xl font-bold text-zinc-900">My Courses</h1>
          <p className="mt-1 text-zinc-600">
            Courses you&apos;ve purchased. Click to continue learning.
          </p>

          {purchasedCourses.length === 0 ? (
            <p className="mt-6 text-zinc-500">
              You haven&apos;t purchased any courses yet. Browse below to get
              started!
            </p>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {purchasedCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  description={course.description}
                  imageUrl={course.image_url}
                  isPurchased
                />
              ))}
            </div>
          )}
        </section>

        {/* Browse: all courses (some may require purchase to watch lessons) */}
        <section className="mt-16">
          <h2 className="text-xl font-bold text-zinc-900">Browse all courses</h2>
          <p className="mt-1 text-zinc-600">
            Explore our full catalog. Purchase to unlock lesson videos.
          </p>

          {!allCourses || allCourses.length === 0 ? (
            <p className="mt-6 text-zinc-500">
              No courses available yet. Add some in Supabase to see them here!
            </p>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {allCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.title}
                  description={course.description}
                  imageUrl={course.image_url}
                  isPurchased={purchasedCourseIds.includes(course.id)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
