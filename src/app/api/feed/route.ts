import { NextResponse } from "next/server";
import { fetchAllFeeds, fetchSourceFeed } from "@/lib/parser";
import { revalidatePath } from "next/cache";

export const revalidate = 300; // 5 minutes

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get("source");

  try {
    if (source) {
      const articles = await fetchSourceFeed(source);
      return NextResponse.json({ articles });
    }

    const { articles, errors } = await fetchAllFeeds();
    return NextResponse.json({ articles, errors });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch feeds", details: String(err) },
      { status: 500 }
    );
  }
}
