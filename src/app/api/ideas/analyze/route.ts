import OpenAI from "openai";
import { NextResponse } from "next/server";
import type { Idea } from "@/types/idea";
import type { AiAnalysisResult } from "@/types/aiAnalysis";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const validTalkLengths = ["SHORT", "MEDIUM", "LONG"] as const;

const validMoods = [
  "RELATABLE",
  "LIGHT",
  "AWKWARD",
  "SELF_DEPRECATION",
  "HEARTWARMING",
  "ANGER",
  "EMBARRASSING",
  "SURREAL",
] as const;

const validScenes = [
  "DRINKING_PARTY",
  "FRIENDS",
  "WORK",
  "FIRST_MEETING",
  "DATE",
  "SNS",
  "STAGE",
  "CASUAL_CHAT",
] as const;

const validAudienceTypes = [
  "CLOSE_FRIENDS",
  "FIRST_TIME",
  "COWORKERS",
  "FAMILY",
  "COMEDY_FANS",
  "ANYONE",
] as const;

const validAudienceSizes = [
  "ONE_ON_ONE",
  "SMALL_GROUP",
  "MEDIUM_GROUP",
  "LARGE_GROUP",
] as const;



const validComedyLevels = ["LOW", "NORMAL", "HIGH"] as const;

function isStringInList<T extends readonly string[]>(
  value: unknown,
  list: T
): value is T[number] {
  return typeof value === "string" && list.includes(value);
}

function isStringArrayInList<T extends readonly string[]>(
  value: unknown,
  list: T
): value is T[number][] {
  return (
    Array.isArray(value) &&
    value.every((item) => isStringInList(item, list))
  );
}

function isValidAnalysisResult(value: unknown): value is AiAnalysisResult {
  if (!value || typeof value !== "object") {
    return false;
  }

  const result = value as Partial<AiAnalysisResult>;

  return (
    typeof result.category === "string" &&
    Array.isArray(result.tags) &&
    result.tags.every((tag) => typeof tag === "string") &&
    isStringInList(result.talkLength, validTalkLengths) &&
    isStringArrayInList(result.moods, validMoods) &&
    isStringArrayInList(result.suitableScenes, validScenes) &&
    isStringArrayInList(result.audienceTypes, validAudienceTypes) &&
    isStringInList(result.audienceSize, validAudienceSizes) &&
    isStringInList(result.audienceComedyLevel, validComedyLevels) &&
    typeof result.classificationReason === "string" &&
    typeof result.aiPunchline === "string" &&
    typeof result.aiScore === "number" &&
    Number.isInteger(result.aiScore) &&
    result.aiScore >= 0 &&
    result.aiScore <= 100 &&
    typeof result.aiReview === "string"
  );
}

function buildPrompt(idea: Idea) {
  return `
あなたは、お笑いのエピソードトークを整理する編集者です。
以下のネタを分析し、検索しやすいように分類してください。
さらに、オチ案、100点満点の評価、改善レビューも出してください。

重要:
- 出力は必ずJSONだけにしてください
- Markdownや説明文は不要です
- 指定されたenum値以外は使わないでください
- tagsは日本語の短いキーワードにしてください
- aiScoreは0〜100の整数にしてください
- aiReviewは短く、改善に役立つ内容にしてください
- aiPunchlineは短めのオチ案にしてください

使用できる値:

talkLength:
${validTalkLengths.join(", ")}

moods:
${validMoods.join(", ")}

suitableScenes:
${validScenes.join(", ")}

audienceTypes:
${validAudienceTypes.join(", ")}

audienceSize:
${validAudienceSizes.join(", ")}

audienceComedyLevel:
${validComedyLevels.join(", ")}

返すJSONの形式:
{
  "category": "日常",
  "tags": ["コンビニ", "気まずい"],
  "talkLength": "SHORT",
  "moods": ["AWKWARD", "RELATABLE"],
  "suitableScenes": ["DRINKING_PARTY", "FRIENDS"],
  "audienceTypes": ["CLOSE_FRIENDS", "ANYONE"],
  "audienceSize": "SMALL_GROUP",
  "audienceComedyLevel": "LOW",
  "classificationReason": "分類理由",
  "aiPunchline": "オチ案",
  "aiScore": 75,
  "aiReview": "良い点と改善点"
}

分析対象:
タイトル:
${idea.title}

思いつきメモ:
${idea.episodeRough ?? ""}

本番用の本文:
${idea.episodeMain ?? ""}

オチ:
${idea.punchline ?? ""}

備考:
${idea.note ?? ""}

現在のカテゴリー:
${idea.category ?? ""}
`;
}

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY が設定されていません。" },
        { status: 500 }
      );
    }

    const idea = (await request.json()) as Idea;

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: buildPrompt(idea),
    });

    const text = response.output_text;

    let parsed: unknown;

    try {
      parsed = JSON.parse(text);
    } catch {
      return NextResponse.json(
        {
          error: "AIの出力をJSONとして読み取れませんでした。",
          raw: text,
        },
        { status: 500 }
      );
    }

    if (!isValidAnalysisResult(parsed)) {
      return NextResponse.json(
        {
          error: "AIの出力形式が想定と違います。",
          raw: parsed,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "AI分析中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}