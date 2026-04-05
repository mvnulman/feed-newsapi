export interface Article {
  title: string;
  link: string;
  description: string;
  content: string;
  pubDate: string;
  creator: string[];
  image: string;
  source: {
    name: string;
    slug: string;
  };
}

export interface FeedResponse {
  articles: Article[];
  timestamp: string;
}
