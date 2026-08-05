import { promises as fs } from "fs";
import path from "path";
import type { Idea } from "@/types/idea";
import type { IdeasStore } from "@/lib/ideasStore";

const ideasFilePath = path.join(process.cwd(), "data", "ideas.json");

async function readIdeasFile(): Promise<Idea[]> {
  const file = await fs.readFile(ideasFilePath, "utf-8");
  return JSON.parse(file) as Idea[];
}

async function writeIdeasFile(ideas: Idea[]): Promise<void> {
  await fs.writeFile(ideasFilePath, JSON.stringify(ideas, null, 2), "utf-8");
}

function createId(): string {
  return crypto.randomUUID();
}

function normalizeText(value?: string): string | undefined {
  const trimmed = value?.trim();

  if (!trimmed) {
    return undefined;
  }

  return trimmed;
}

function sortByUpdatedAtDesc(ideas: Idea[]): Idea[] {
  return [...ideas].sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export const jsonIdeasStore: IdeasStore = {
  async getIdeas() {
    const ideas = await readIdeasFile();
    return sortByUpdatedAtDesc(ideas);
  },

  async getIdeaById(id) {
    const ideas = await readIdeasFile();
    return ideas.find((idea) => idea.id === id);
  },

  async createIdea(input) {
    const ideas = await readIdeasFile();

    const now = new Date().toISOString();
    const id = createId();

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

    const nextIdeas = [newIdea, ...ideas];
    await writeIdeasFile(nextIdeas);

    return newIdea;
  },

  async updateIdea(id, input) {
    const ideas = await readIdeasFile();
    const targetIdea = ideas.find((idea) => idea.id === id);

    if (!targetIdea) {
      return undefined;
    }

    const now = new Date().toISOString();

    const updatedIdea: Idea = {
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
      note:
        input.note !== undefined ? normalizeText(input.note) : targetIdea.note,
      category:
        input.category !== undefined
          ? normalizeText(input.category)
          : targetIdea.category,
      updatedAt: now,
    };

    const nextIdeas = ideas.map((idea) => (idea.id === id ? updatedIdea : idea));
    await writeIdeasFile(nextIdeas);

    return updatedIdea;
  },

  async deleteIdea(id) {
    const ideas = await readIdeasFile();
    const nextIdeas = ideas.filter((idea) => idea.id !== id);

    if (nextIdeas.length === ideas.length) {
      return false;
    }

    await writeIdeasFile(nextIdeas);
    return true;
  },
};
