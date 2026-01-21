-- Add email column to providers table if it doesn't exist
alter table if exists public.proveedores 
add column if not exists email text default 'Sin correo';

-- Verify update (optional check via select)
select * from public.proveedores limit 1;
