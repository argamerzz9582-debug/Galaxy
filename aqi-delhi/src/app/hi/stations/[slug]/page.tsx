import type { Metadata } from "next";
import PageView from "@/components/page-view";
import { getLive } from "@/lib/data";
import { stationMeta } from "@/lib/seo";

export const revalidate = 120;

export async function generateStaticParams() {
  const live = await getLive();
  return live.stations.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const live = await getLive();
  const station = live.stations.find((s) => s.slug === slug);
  return stationMeta("hi", station?.name ?? slug, slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PageView lang="hi" view="station" slug={slug} />;
}
