import Parser from "rss-parser";
import type { Item } from "rss-parser";
import { sources, getSourceBySlug } from "./sources";
import type { Article } from "@/types";

type FeedItem = Item & {
  mediaContent?: Array<{ $: { url?: string } }>;
  mediaThumbnail?: { $: { url?: string } };
  contentEncoded?: string;
  description?: string;
  enclosure?: { link?: string };
};

const parser = new Parser({
  timeout: 8000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Feed Aggregator/1.0",
  },
  customFields: {
    item: [
      ["media:content", "mediaContent", { keepArray: true }],
      ["media:thumbnail", "mediaThumbnail"],
      ["content:encoded", "contentEncoded"],
    ],
  },
});

function extractImage(item: FeedItem): string {
  // Try enclosure first
  if (item.enclosure?.link) return item.enclosure.link;
  // Try media:thumbnail
  if (item.mediaThumbnail?.$?.url) return item.mediaThumbnail.$.url;
  // Try media:content
  if (item.mediaContent?.[0]?.$?.url) return item.mediaContent[0].$.url;
  // Try to extract from content/description
  const content = item.contentEncoded || item.content || item.description || "";
  const match = content.match(/<img[^>]+src="([^">]+)"/);
  if (match) return match[1];
  return "";
}

function cleanDescription(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(Number(num)))
    .trim()
    .slice(0, 200);
}

export async function fetchSourceFeed(slug: string): Promise<Article[]> {
  const source = getSourceBySlug(slug);
  if (!source) throw new Error(`Source ${slug} not found`);

  try {
    const feed = await parser.parseURL(source.url);
    return feed.items
      .filter((item) => item.title || item.link)
      .map((item) => {
        const feedItem = item as FeedItem;
        return {
          title: feedItem.title || "Untitled",
          link: feedItem.link || "",
          description: cleanDescription(
            feedItem.contentSnippet || feedItem.content || ""
          ),
          content: feedItem.content || "",
          pubDate: feedItem.pubDate || new Date().toISOString(),
          creator: feedItem.creator ? [feedItem.creator] : [],
          image: extractImage(feedItem),
          source: { name: source.name, slug: source.slug },
        };
      });
  } catch (err) {
    console.error(`Error fetching ${source.name}:`, err);
    return [];
  }
}

export async function fetchAllFeeds(): Promise<{
  articles: Article[];
  errors: string[];
}> {
  const results = await Promise.allSettled(
    sources.map((s) =>
      fetchSourceFeed(s.slug).then((articles) => ({
        articles,
        source: s.slug,
      }))
    )
  );

  const articles: Article[] = [];
  const errors: string[] = [];

  results.forEach((result) => {
    if (result.status === "fulfilled") {
      articles.push(...result.value.articles);
    } else {
      errors.push(result.reason?.message || "Unknown error");
    }
  });

  // Sort by date, newest first
  articles.sort(
    (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
  );

  return { articles, errors };
}
