import PageView from "@/components/page-view";
import { metaFor } from "@/lib/seo";

export const revalidate = 120;

export const metadata = metaFor("en", "sameer");

export default function Page() {
  return <PageView lang="en" view="sameer" />;
}
