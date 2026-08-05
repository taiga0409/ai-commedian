export type IdeasDataSource = "json" | "supabase";

const DEFAULT_IDEAS_DATA_SOURCE: IdeasDataSource = "json";

function isIdeasDataSource(value: string): value is IdeasDataSource {
  return value === "json" || value === "supabase";
}

export function getIdeasDataSource(): IdeasDataSource {
  const value = process.env.IDEAS_DATA_SOURCE;

  if (!value) {
    return DEFAULT_IDEAS_DATA_SOURCE;
  }

  if (isIdeasDataSource(value)) {
    return value;
  }

  throw new Error(
    `IDEAS_DATA_SOURCE must be "json" or "supabase". Current value: ${value}`
  );
}
