create extension if not exists pgcrypto;

create type public.idea_status as enum (
  'MATERIAL',
  'WAITING_PUNCHLINE',
  'STRUCTURING',
  'COMPLETED',
  'REJECTED'
);

create type public.audience_type as enum (
  'CLOSE_FRIENDS',
  'FIRST_TIME',
  'COWORKERS',
  'FAMILY',
  'COMEDY_FANS',
  'ANYONE'
);

create type public.audience_size as enum (
  'ONE_ON_ONE',
  'SMALL_GROUP',
  'MEDIUM_GROUP',
  'LARGE_GROUP'
);

create type public.comedy_level as enum (
  'LOW',
  'NORMAL',
  'HIGH'
);

create type public.talk_length as enum (
  'SHORT',
  'MEDIUM',
  'LONG'
);

create type public.mood as enum (
  'RELATABLE',
  'LIGHT',
  'AWKWARD',
  'SELF_DEPRECATION',
  'HEARTWARMING',
  'ANGER',
  'EMBARRASSING',
  'SURREAL'
);

create type public.scene as enum (
  'DRINKING_PARTY',
  'FRIENDS',
  'WORK',
  'FIRST_MEETING',
  'DATE',
  'SNS',
  'STAGE',
  'CASUAL_CHAT'
);