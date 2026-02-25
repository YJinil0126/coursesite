-- Seed data: Add a sample course and lessons
-- Run this in Supabase SQL Editor after running schema.sql
-- (Run only once; running again may create duplicate lessons)

-- Insert one sample course
insert into public.courses (id, title, description, image_url)
values (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Introduction to Web Development',
  'Learn HTML, CSS, and JavaScript fundamentals. Build your first website from scratch.',
  null
)
on conflict (id) do nothing;

-- Insert sample lessons (use the same course_id)
insert into public.lessons (course_id, title, mux_playback_id, sort_order)
values
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Getting Started', null, 0),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'HTML Basics', null, 1),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'CSS Styling', null, 2);
