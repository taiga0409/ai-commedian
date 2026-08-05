import type { Idea } from "@/types/idea";

export type CreateIdeaInput = {
  title?: string;
  episodeRough?: string;
  punchline?: string;
  episodeMain?: string;
  note?: string;
  status?: Idea["status"];
  category?: string;
};

export type UpdateIdeaInput = Partial<
  Pick<
    Idea,
    | "title"
    | "episodeRough"
    | "punchline"
    | "episodeMain"
    | "note"
    | "status"
    | "category"
    | "tags"
    | "talkLength"
    | "moods"
    | "suitableScenes"
    | "audienceTypes"
    | "audienceSize"
    | "audienceComedyLevel"
    | "classificationReason"
    | "aiPunchline"
    | "aiScore"
    | "aiReview"
  >
>;

export type IdeasStore = {
  getIdeas(): Promise<Idea[]>;
  getIdeaById(id: string): Promise<Idea | undefined>;
  createIdea(input: CreateIdeaInput): Promise<Idea>;
  updateIdea(id: string, input: UpdateIdeaInput): Promise<Idea | undefined>;
  deleteIdea(id: string): Promise<boolean>;
};
