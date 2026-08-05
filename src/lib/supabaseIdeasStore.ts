import { supabase } from "@/lib/supabase";
import type { IdeasStore } from "@/lib/ideasStore";
import type {
  AudienceSize,
  AudienceType,
  ComedyLevel,
  Idea,
  IdeaStatus,
  Mood,
  Scene,
  TalkLength,
} from "@/types/idea";

type EpisodeRow = {
  id: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  episodeRough: string | null;
  punchline: string | null;
  episodeMain: string | null;
  note: string | null;
  status: IdeaStatus;
  category: string | null;
  tags: string[] | null;
  talkLength: TalkLength | null;
  moods: Mood[] | null;
  suitableScenes: Scene[] | null;
  audienceTypes: AudienceType[] | null;
  audienceSize: AudienceSize | null;
  audienceComedyLevel: ComedyLevel | null;
  classificationReason: string | null;
  aiPunchline: string | null;
  aiScore: number | null;
  aiReview: string | null;
};

function nullableToUndefined<T>(value: T | null): T | undefined {
  return value ?? undefined;
}

function mapEpisodeRowToIdea(row: EpisodeRow): Idea {
  return {
    id: row.id,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    title: row.title,
    episodeRough: nullableToUndefined(row.episodeRough),
    punchline: nullableToUndefined(row.punchline),
    episodeMain: nullableToUndefined(row.episodeMain),
    note: nullableToUndefined(row.note),
    status: row.status,
    category: nullableToUndefined(row.category),
    tags: row.tags ?? [],
    talkLength: nullableToUndefined(row.talkLength),
    moods: row.moods ?? [],
    suitableScenes: row.suitableScenes ?? [],
    audienceTypes: row.audienceTypes ?? [],
    audienceSize: nullableToUndefined(row.audienceSize),
    audienceComedyLevel: nullableToUndefined(row.audienceComedyLevel),
    classificationReason: nullableToUndefined(row.classificationReason),
    aiPunchline: nullableToUndefined(row.aiPunchline),
    aiScore: nullableToUndefined(row.aiScore),
    aiReview: nullableToUndefined(row.aiReview),
  };
}

function throwWriteNotImplemented(): never {
  throw new Error(
    "Supabase ideas store currently supports reads only. Create/update/delete will be added in the next step."
  );
}

export const supabaseIdeasStore: IdeasStore = {
  async getIdeas() {
    const { data, error } = await supabase
      .from("episodes")
      .select("*")
      .order("updatedAt", { ascending: false });

    if (error) {
      throw error;
    }

    return ((data ?? []) as EpisodeRow[]).map(mapEpisodeRowToIdea);
  },

  async getIdeaById(id) {
    const { data, error } = await supabase
      .from("episodes")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return undefined;
    }

    return mapEpisodeRowToIdea(data as EpisodeRow);
  },

  async createIdea() {
    return throwWriteNotImplemented();
  },

  async updateIdea() {
    return throwWriteNotImplemented();
  },

  async deleteIdea() {
    return throwWriteNotImplemented();
  },
};
