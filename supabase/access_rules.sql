alter table public.episodes enable row level security;

create policy "Allow select episodes"
on public.episodes
for select
to anon
using (true);

create policy "Allow insert episodes"
on public.episodes
for insert
to anon
with check (true);

create policy "Allow update episodes"
on public.episodes
for update
to anon
using (true)
with check (true);

create policy "Allow delete episodes"
on public.episodes
for delete
to anon
using (true);