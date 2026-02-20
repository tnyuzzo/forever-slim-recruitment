-- Inserisci questo in SQL Editor su Supabase per creare rapidamente il bucket e renderlo pubblico
insert into storage.buckets (id, name, public) 
values ('candidate-audio', 'candidate-audio', true);

create policy "Public Access" 
on storage.objects for select 
using ( bucket_id = 'candidate-audio' );

create policy "Anon Insert" 
on storage.objects for insert 
with check ( bucket_id = 'candidate-audio' );
