create table public.episodes (
  id uuid primary key default gen_random_uuid(),
  "createdAt" timestamp with time zone not null default now(),
  "updatedAt" timestamp with time zone not null default now(),

  title text not null,
  "episodeRough" text,
  punchline text,
  "episodeMain" text,
  note text,

  status public.idea_status not null default 'MATERIAL',

  category text,
  tags text[] not null default '{}',
  "talkLength" public.talk_length,
  moods public.mood[] not null default '{}',
  "suitableScenes" public.scene[] not null default '{}',
  "audienceTypes" public.audience_type[] not null default '{}',
  "audienceSize" public.audience_size,
  "audienceComedyLevel" public.comedy_level,

  "classificationReason" text,
  "aiPunchline" text,
  "aiScore" integer,
  "aiReview" text,

  constraint ai_score_range check (
    "aiScore" is null or ("aiScore" >= 0 and "aiScore" <= 100)
  )
);