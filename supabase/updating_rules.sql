create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new."updatedAt" = now();
  return new;
end;
$$ language plpgsql;

create trigger update_episodes_updated_at
before update on public.episodes
for each row
execute function public.update_updated_at_column();