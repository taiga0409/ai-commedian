export type IdeaStatus =
  | "MATERIAL"
  | "WAITING_PUNCHLINE"
  | "STRUCTURING"
  | "COMPLETED"
  | "REJECTED";

export type Idea = {
  id: string;
  title: string;
  episode: string;
  performanceText?: string;
  punchline?: string;
  category?: string;
  status: IdeaStatus;
  note?: string;
  createdAt: string;
  updatedAt: string;
};

export const IDEA_STATUS_LABELS: Record<IdeaStatus, string> = {
  MATERIAL: "素材",
  WAITING_PUNCHLINE: "オチ待ち",
  STRUCTURING: "構成中",
  COMPLETED: "完成",
  REJECTED: "ボツ",
};