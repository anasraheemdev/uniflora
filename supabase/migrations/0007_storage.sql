-- Storage bucket for user-uploaded plant photos (submission photos going
-- forward; the existing /public/plants/*.jpg species photos are static
-- build assets and untouched by this).

insert into storage.buckets (id, name, public)
values ('plant-photos', 'plant-photos', true)
on conflict (id) do nothing;

create policy "plant photos are publicly readable"
  on storage.objects for select
  using (bucket_id = 'plant-photos');

create policy "signed-in users can upload plant photos"
  on storage.objects for insert
  with check (bucket_id = 'plant-photos' and auth.role() = 'authenticated');

create policy "owners can delete their own plant photo uploads"
  on storage.objects for delete
  using (bucket_id = 'plant-photos' and owner = auth.uid());
