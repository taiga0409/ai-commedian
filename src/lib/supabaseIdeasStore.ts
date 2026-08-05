import { supabase } from "@/lib/supabase";
import type {
  CreateIdeaInput,
  IdeasStore,
  UpdateIdeaInput,
} from "@/lib/ideasStore";
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

function normalizeText(value?: string): string | undefined {
  const trimmed = value?.trim();

  return trimmed || undefined;
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

function ideaToEpisodeData(idea: Idea) {
  return {
    updatedAt: idea.updatedAt,
    title: idea.title,
    episodeRough: idea.episodeRough ?? null,
    punchline: idea.punchline ?? null,
    episodeMain: idea.episodeMain ?? null,
    note: idea.note ?? null,
    status: idea.status,
    category: idea.category ?? null,
    tags: idea.tags,
    talkLength: idea.talkLength ?? null,
    moods: idea.moods,
    suitableScenes: idea.suitableScenes,
    audienceTypes: idea.audienceTypes,
    audienceSize: idea.audienceSize ?? null,
    audienceComedyLevel: idea.audienceComedyLevel ?? null,
    classificationReason: idea.classificationReason ?? null,
    aiPunchline: idea.aiPunchline ?? null,
    aiScore: idea.aiScore ?? null,
    aiReview: idea.aiReview ?? null,
  };
}

function applyUpdate(targetIdea: Idea, input: UpdateIdeaInput): Idea {
  return {
    ...targetIdea,
    ...input,
    title: normalizeText(input.title) ?? targetIdea.title,
    episodeRough:
      input.episodeRough !== undefined
        ? normalizeText(input.episodeRough)
        : targetIdea.episodeRough,
    punchline:
      input.punchline !== undefined
        ? normalizeText(input.punchline)
        : targetIdea.punchline,
    episodeMain:
      input.episodeMain !== undefined
        ? normalizeText(input.episodeMain)
        : targetIdea.episodeMain,
    note: input.note !== undefined ? normalizeText(input.note) : targetIdea.note,
    category:
      input.category !== undefined
        ? normalizeText(input.category)
        : targetIdea.category,
    updatedAt: new Date().toISOString(),
  };
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

  async createIdea(input: CreateIdeaInput) {
    const now = new Date().toISOString();
    const id = crypto.randomUUID();
    const title = normalizeText(input.title) ?? `Title_${id.slice(0, 8)}`;

    const newIdea: Idea = {
      id,
      title,
      createdAt: now,
      updatedAt: now,
      episodeRough: normalizeText(input.episodeRough),
      punchline: normalizeText(input.punchline),
      episodeMain: normalizeText(input.episodeMain),
      note: normalizeText(input.note),
      status: input.status ?? "MATERIAL",
      category: normalizeText(input.category),
      tags: [],
      talkLength: undefined,
      moods: [],
      suitableScenes: [],
      audienceTypes: [],
      audienceSize: undefined,
      audienceComedyLevel: undefined,
      classificationReason: undefined,
      aiPunchline: undefined,
      aiScore: undefined,
      aiReview: undefined,
    };

    const { data, error } = await supabase
      .from("episodes")
      .insert(newIdea)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return mapEpisodeRowToIdea(data as EpisodeRow);
  },

  async updateIdea(id: string, input: UpdateIdeaInput) {
    const targetIdea = await this.getIdeaById(id);

    if (!targetIdea) {
      return undefined;
    }

    const updatedIdea = applyUpdate(targetIdea, input);
    const { data, error } = await supabase
      .from("episodes")
      .update(ideaToEpisodeData(updatedIdea))
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data ? mapEpisodeRowToIdea(data as EpisodeRow) : undefined;
  },

  async deleteIdea(id: string) {
    const { data, error } = await supabase
      .from("episodes")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) {
      throw error;
    }

    return Boolean(data);
  },
};
