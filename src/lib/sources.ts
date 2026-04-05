export interface Source {
  slug: string;
  name: string;
  url: string;
  icon: string;
  color: string;
}

export const sources: Source[] = [
  {
    slug: "ign",
    name: "IGN",
    url: "https://feeds.feedburner.com/ign/all",
    icon: "🎮",
    color: "#bf1722",
  },
  {
    slug: "kotaku",
    name: "Kotaku",
    url: "https://kotaku.com/rss",
    icon: "🕹️",
    color: "#f5a623",
  },
  {
    slug: "pcgamer",
    name: "PC Gamer",
    url: "https://www.pcgamer.com/rss/",
    icon: "🖥️",
    color: "#2d7cd4",
  },
  {
    slug: "polygon",
    name: "Polygon",
    url: "https://www.polygon.com/rss/index.xml",
    icon: "🔷",
    color: "#e0004c",
  },
  {
    slug: "rockpapershotgun",
    name: "Rock Paper Shotgun",
    url: "https://www.rockpapershotgun.com/feed",
    icon: "🥃",
    color: "#4a9c5d",
  },
  {
    slug: "eurogamer",
    name: "Eurogamer",
    url: "https://www.eurogamer.net/feed",
    icon: "🇪🇺",
    color: "#1a73e8",
  },
];

export function getSourceBySlug(slug: string): Source | undefined {
  return sources.find((s) => s.slug === slug);
}
