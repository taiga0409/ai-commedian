import { NextResponse } from "next/server";
import {
  deleteIdea,
  getIdeaById,
  updateIdea,
} from "@/lib/ideasRepository";

type RouteParams = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const idea = await getIdeaById(id);

    if (!idea) {
      return NextResponse.json(
        { error: "ネタが見つかりません。" },
        { status: 404 }
      );
    }

    return NextResponse.json(idea);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "ネタ詳細の取得に失敗しました。" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedIdea = await updateIdea(id, body);

    if (!updatedIdea) {
      return NextResponse.json(
        { error: "ネタが見つかりません。" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedIdea);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "ネタの更新に失敗しました。" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const deleted = await deleteIdea(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "ネタが見つかりません。" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "ネタの削除に失敗しました。" },
      { status: 500 }
    );
  }
}