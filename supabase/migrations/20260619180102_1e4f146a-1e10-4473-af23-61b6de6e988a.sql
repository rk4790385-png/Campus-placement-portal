
-- Tighten function search_path
alter function public.handle_new_user() set search_path = public;
alter function public.set_updated_at() set search_path = public;

-- Lock down SECURITY DEFINER helpers from direct API exposure
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.has_role(uuid, app_role) from public, anon;
-- authenticated may need has_role for future policy helpers via SQL; keep it
