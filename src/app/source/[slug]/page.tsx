import { SourcePage } from "@/components/source-page";
import { getSourceBySlug } from "@/lib/sources";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return [
    { slug: "ign" },
    { slug: "kotaku" },
    { slug: "pcgamer" },
    { slug: "polygon" },
    { slug: "rockpapershotgun" },
    { slug: "eurogamer" },
  ];
}

export default async function Source({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const source = getSourceBySlug(slug);
  if (!source) notFound();

  return <SourcePage slug={slug} />;
}
