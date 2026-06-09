import type {
  AudienceSize,
  AudienceType,
  ComedyLevel,
  Mood,
  Scene,
  TalkLength,
} from "@/types/idea";

export type AiAnalysisResult = {
  category: string;
  tags: string[];
  talkLength: TalkLength;
  moods: Mood[];
  suitableScenes: Scene[];
  audienceTypes: AudienceType[];
  audienceSize: AudienceSize;
  audienceComedyLevel: ComedyLevel;
  classificationReason: string;
  aiPunchline: string;
  aiScore: number;
  aiReview: string;
};