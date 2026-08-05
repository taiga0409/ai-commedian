import { getIdeasDataSource } from "@/lib/dataSourceConfig";
import type { CreateIdeaInput, IdeasStore, UpdateIdeaInput } from "@/lib/ideasStore";

async function getIdeasStore(): Promise<IdeasStore> {
  const dataSource = getIdeasDataSource();

  if (dataSource === "supabase") {
    const { supabaseIdeasStore } = await import("@/lib/supabaseIdeasStore");
    return supabaseIdeasStore;
  }

  const { jsonIdeasStore } = await import("@/lib/jsonIdeasStore");
  return jsonIdeasStore;
}

export async function getIdeas() {
  return (await getIdeasStore()).getIdeas();
}

export async function getIdeaById(id: string) {
  return (await getIdeasStore()).getIdeaById(id);
}

export async function createIdea(input: CreateIdeaInput) {
  return (await getIdeasStore()).createIdea(input);
}

export async function updateIdea(id: string, input: UpdateIdeaInput) {
  return (await getIdeasStore()).updateIdea(id, input);
}

export async function deleteIdea(id: string) {
  return (await getIdeasStore()).deleteIdea(id);
}
