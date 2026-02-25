# Learning Guide: CourseSite Architecture

This file explains key concepts as you explore the codebase.

---

## 1. Server Components vs Client Components

**Server Components** (default in App Router):
- Run only on the server
- Can fetch data directly (database, APIs) with `async/await`
- No `useState`, `useEffect`, or browser APIs
- No `"use client"` at the top
- Example: `app/dashboard/page.tsx` – fetches user and courses from Supabase

**Client Components** (`"use client"`):
- Run in the browser
- Can use hooks (`useState`, `useEffect`), event handlers (`onClick`), browser APIs
- Used when you need interactivity (buttons, forms, real-time updates)
- Example: `SignOutButton` – needs `onClick` to handle sign out

---

## 2. Data Flow: Supabase

```
User signs in → Supabase Auth sets cookies
                    ↓
Server Component runs → createClient() reads cookies → getUser() returns session
                    ↓
We know who the user is → Fetch their data (purchases, courses)
                    ↓
Render page with data
```

**Server client** (`lib/supabase/server.ts`): Uses `cookies()` from Next.js to read the session. Safe for Server Components.

**Browser client** (`lib/supabase/client.ts`): Uses `document.cookie`. Safe for Client Components.

---

## 3. Dynamic Routes

- `/courses/[courseId]` – `[courseId]` is a URL segment (e.g. `/courses/abc-123`)
- The page receives `params: { courseId: "abc-123" }`
- We use that ID to fetch the specific course from Supabase

Same for `/courses/[courseId]/[lessonId]` – we get both `courseId` and `lessonId`.

---

## 4. Middleware & Protected Routes

`middleware.ts` runs on every request before the page loads.

- **Session refresh**: Supabase middleware refreshes the auth token in cookies
- **Route protection**: `/dashboard` and `/courses/[courseId]/[lessonId]` require sign-in
  - Not signed in → redirect to `/sign-in?redirect=...`
  - Signed in → request continues

The lesson page then does a second check: **has the user purchased this course?**  
That logic lives in the page, not the middleware.

---

## 5. Row Level Security (RLS)

Supabase RLS means: **the database checks permissions on every query**.

- Users can only SELECT their own purchases
- Anyone can SELECT courses and lessons (public catalog)
- Inserts into `purchases` happen via Stripe webhook with service role (bypasses RLS)

So even if our frontend code tried to fetch another user's purchases, Supabase would return nothing.

---

## 6. Mux Video Player

- `components/video/VideoPlayer.tsx` – Client Component wrapping Mux Player
- Uses `@mux/mux-player-react/lazy` for viewport-based loading (better performance)
- `playbackId` comes from the lesson's `mux_playback_id` in Supabase
- To add a video: upload in Mux Dashboard → copy playback ID → paste in `lessons.mux_playback_id`

---

## 7. Where to Look Next

- `app/dashboard/page.tsx` – Server Component fetching purchases + courses
- `app/courses/[courseId]/page.tsx` – Dynamic route + `hasAccess` check
- `app/courses/[courseId]/[lessonId]/page.tsx` – Video player + prev/next nav
- `components/course/LessonList.tsx` – Conditional lesson links (locked vs unlocked)
