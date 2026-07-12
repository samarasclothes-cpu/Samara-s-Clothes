-- ═══════════════════════════════════════════════════════════════
--  CONFIGURACIÓN DE SUPABASE para Samara's Clothes
--  Cómo usarlo:
--    1. Entra a tu proyecto en https://supabase.com
--    2. Menú izquierdo → "SQL Editor" → "New query"
--    3. Copia y pega TODO este archivo
--    4. Presiona "Run" (o Ctrl+Enter)
--  Esto crea la tabla de productos, el almacén de fotos y la
--  seguridad para que solo tú (con sesión) puedas modificar.
-- ═══════════════════════════════════════════════════════════════

-- ── 1. Tabla de productos ──────────────────────────────────────
create table if not exists public.productos (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  price       numeric,
  category    text,
  sizes       text[] default '{}',
  colors      text[] default '{}',
  images      text[] default '{}',
  disponible  boolean default true,
  created_at  timestamptz default now()
);

-- ── 2. Seguridad de la tabla (RLS) ─────────────────────────────
alter table public.productos enable row level security;

-- Cualquiera puede VER los productos (catálogo público).
drop policy if exists "productos_lectura_publica" on public.productos;
create policy "productos_lectura_publica"
  on public.productos for select
  using (true);

-- Solo usuarios con sesión iniciada pueden AGREGAR / EDITAR / BORRAR.
drop policy if exists "productos_escritura_admin" on public.productos;
create policy "productos_escritura_admin"
  on public.productos for all
  to authenticated
  using (true)
  with check (true);

-- ── 3. Almacenamiento de fotos (bucket público) ────────────────
insert into storage.buckets (id, name, public)
values ('productos', 'productos', true)
on conflict (id) do nothing;

-- Cualquiera puede VER las fotos.
drop policy if exists "fotos_lectura_publica" on storage.objects;
create policy "fotos_lectura_publica"
  on storage.objects for select
  using (bucket_id = 'productos');

-- Solo usuarios con sesión pueden SUBIR / ACTUALIZAR / BORRAR fotos.
drop policy if exists "fotos_subir_admin" on storage.objects;
create policy "fotos_subir_admin"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'productos');

drop policy if exists "fotos_actualizar_admin" on storage.objects;
create policy "fotos_actualizar_admin"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'productos');

drop policy if exists "fotos_borrar_admin" on storage.objects;
create policy "fotos_borrar_admin"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'productos');

-- ═══════════════════════════════════════════════════════════════
--  ¡Listo! Ahora crea tu usuario admin:
--  Menú izquierdo → "Authentication" → "Users" → "Add user"
--  → "Create new user". Pon tu correo y una contraseña, y marca
--  "Auto Confirm User". Con ese correo y contraseña entrarás
--  al panel en  /admin
-- ═══════════════════════════════════════════════════════════════
