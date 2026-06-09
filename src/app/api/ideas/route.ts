import { NextResponse } from "next/server";
import { createIdea, getIdeas } from "@/lib/ideasRepository";

export async function GET() {
  try {
    const ideas = await getIdeas();

    return NextResponse.json(ideas);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "ネタ一覧の取得に失敗しました。" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const idea = await createIdea(body);

    return NextResponse.json(idea, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "ネタの作成に失敗しました。" },
      { status: 500 }
    );
  }
}