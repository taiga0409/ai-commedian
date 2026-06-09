export type IdeaStatus =
  | "MATERIAL"
  | "WAITING_PUNCHLINE"
  | "STRUCTURING"
  | "COMPLETED"
  | "REJECTED";

export type AudienceType =
  | "CLOSE_FRIENDS"
  | "FIRST_TIME"
  | "COWORKERS"
  | "FAMILY"
  | "COMEDY_FANS"
  | "ANYONE";

export type AudienceSize =
  | "ONE_ON_ONE"
  | "SMALL_GROUP"
  | "MEDIUM_GROUP"
  | "LARGE_GROUP";

export type ComedyLevel =
  | "LOW"
  | "NORMAL"
  | "HIGH";

export type TalkLength = 
  | "SHORT"
  | "MEDIUM"
  | "LONG";

export type Mood = 
  | "RELATABLE"
  | "LIGHT"
  | "AWKWARD"
  | "SELF_DEPRECATION"
  | "HEARTWARMING"
  | "ANGER"
  | "EMBARRASSING"
  | "SURREAL";

export type Scene =
  | "DRINKING_PARTY"
  | "FRIENDS"
  | "WORK"
  | "FIRST_MEETING"
  | "DATE"
  | "SNS"
  | "STAGE"
  | "CASUAL_CHAT";


export type Idea = {
  // システム管理
  id: string;
  createdAt: string;
  updatedAt: string;

  // ユーザ入力
  title: string;
  episodeRough?: string;
  punchline?: string;
  episodeMain?: string;
  note?: string;

  // ネタの状態
  status: IdeaStatus;
  
  // 人間とLLMが入力 (ユーザーが後から編集可能)
  category?: string;  // 大分類。日常、学校、バイト、恋愛など
  tags: string[];  // 検索用キーワード。コンビニ、気まずい、店員など
  talkLength?: TalkLength; 
  moods: Mood[]; 
  suitableScenes: Scene[]; 
  audienceTypes: AudienceType[]; 
  audienceSize?: AudienceSize; 
  audienceComedyLevel?: ComedyLevel;

  // LLMが入力
  classificationReason?: string; 
  aiPunchline?: string; 
  aiScore?: number; 
  aiReview?: string;


};

export const IDEA_STATUS_LABELS: Record<IdeaStatus, string> = {
  MATERIAL: "素材",
  WAITING_PUNCHLINE: "オチ待ち",
  STRUCTURING: "構成中",
  COMPLETED: "完成",
  REJECTED: "ボツ",
};

export const AUDIENCE_TYPE_LABELS: Record<AudienceType, string> = {
  CLOSE_FRIENDS: "親しい友達",
  FIRST_TIME: "初対面の人",
  COWORKERS: "職場・バイト先",
  FAMILY: "家族",
  COMEDY_FANS: "お笑い好き",
  ANYONE: "誰でも",
};

export const AUDIENCE_SIZE_LABELS: Record<AudienceSize, string> = {
  ONE_ON_ONE: "1対1",
  SMALL_GROUP: "少人数",
  MEDIUM_GROUP: "中人数",
  LARGE_GROUP: "大人数",
};

export const COMEDY_LEVEL_LABELS: Record<ComedyLevel, string> = {
  LOW: "低め",
  NORMAL: "普通",
  HIGH: "高め",
};

export const TALK_LENGTH_LABELS: Record<TalkLength, string> = {
  SHORT: "短め",
  MEDIUM: "普通",
  LONG: "長め",
};

export const MOOD_LABELS: Record<Mood, string> = {
  RELATABLE: "あるあるねた",
  LIGHT: "明るい",
  AWKWARD: "気まずい",
  SELF_DEPRECATION: "自虐",
  HEARTWARMING: "ほっこり",
  ANGER: "怒り・愚痴",
  EMBARRASSING: "恥ずかしい",
  SURREAL: "シュール",
};

export const SCENE_LABELS: Record<Scene, string> = {
  DRINKING_PARTY: "飲み会",
  FRIENDS: "友達との会話",
  WORK: "職場・バイト",
  FIRST_MEETING: "初対面",
  DATE: "デート",
  SNS: "SNS",
  STAGE: "舞台・ライブ",
  CASUAL_CHAT: "雑談",
};