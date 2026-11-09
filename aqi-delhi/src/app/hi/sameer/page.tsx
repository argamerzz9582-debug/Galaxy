import PageView from "@/components/page-view";
import { metaFor } from "@/lib/seo";

export const revalidate = 120;

export const metadata = metaFor("hi", "sameer");

export default function Page() {
  return <PageView lang="hi" view="sameer" />;
}
