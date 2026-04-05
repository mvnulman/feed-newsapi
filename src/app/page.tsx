import { FeedPage } from "@/components/feed-page";

export const revalidate = 300;

export default function Home() {
  return <FeedPage />;
}
