create schema if not exists private;

create type public.post_category as enum ('film', 'music', 'art', 'books');
create type public.post_status as enum ('draft', 'published');

create table if not exists public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  subtitle text,
  excerpt text not null,
  body_markdown text not null,
  category public.post_category not null,
  status public.post_status not null default 'draft',
  hero_image_url text,
  caption text,
  author_name text,
  author_id uuid references auth.users(id) on delete set null,
  published_at timestamptz,
  featured boolean not null default false,
  featured_rank integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_status_published_at_idx on public.posts (status, published_at desc);
create index if not exists posts_category_status_idx on public.posts (category, status);
create index if not exists posts_featured_rank_idx on public.posts (featured desc, featured_rank asc);

create or replace function private.is_admin(check_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.admin_profiles
    where user_id = check_user_id
      and role in ('admin', 'editor')
  );
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
before update on public.posts
for each row execute function public.set_updated_at();

drop trigger if exists admin_profiles_set_updated_at on public.admin_profiles;
create trigger admin_profiles_set_updated_at
before update on public.admin_profiles
for each row execute function public.set_updated_at();

alter table public.posts enable row level security;
alter table public.admin_profiles enable row level security;

grant usage on schema public to anon, authenticated;
grant usage on schema private to authenticated;
grant execute on function private.is_admin(uuid) to authenticated;
grant select on public.posts to anon;
grant select, insert, update, delete on public.posts to authenticated;
grant select on public.admin_profiles to authenticated;

drop policy if exists "Published posts are readable by everyone" on public.posts;
create policy "Published posts are readable by everyone"
on public.posts
for select
to anon, authenticated
using (status = 'published');

drop policy if exists "Admins can read all posts" on public.posts;
create policy "Admins can read all posts"
on public.posts
for select
to authenticated
using (private.is_admin(auth.uid()));

drop policy if exists "Admins can insert posts" on public.posts;
create policy "Admins can insert posts"
on public.posts
for insert
to authenticated
with check (private.is_admin(auth.uid()));

drop policy if exists "Admins can update posts" on public.posts;
create policy "Admins can update posts"
on public.posts
for update
to authenticated
using (private.is_admin(auth.uid()))
with check (private.is_admin(auth.uid()));

drop policy if exists "Admins can delete posts" on public.posts;
create policy "Admins can delete posts"
on public.posts
for delete
to authenticated
using (private.is_admin(auth.uid()));

drop policy if exists "Admins can read their own profile" on public.admin_profiles;
create policy "Admins can read their own profile"
on public.admin_profiles
for select
to authenticated
using (user_id = auth.uid() or private.is_admin(auth.uid()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'post-assets',
  'post-assets',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Post assets are publicly readable" on storage.objects;
create policy "Post assets are publicly readable"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'post-assets');

drop policy if exists "Admins can upload post assets" on storage.objects;
create policy "Admins can upload post assets"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'post-assets' and private.is_admin(auth.uid()));

drop policy if exists "Admins can update post assets" on storage.objects;
create policy "Admins can update post assets"
on storage.objects
for update
to authenticated
using (bucket_id = 'post-assets' and private.is_admin(auth.uid()))
with check (bucket_id = 'post-assets' and private.is_admin(auth.uid()));

drop policy if exists "Admins can delete post assets" on storage.objects;
create policy "Admins can delete post assets"
on storage.objects
for delete
to authenticated
using (bucket_id = 'post-assets' and private.is_admin(auth.uid()));
