import type { Metadata } from "next";
import { Overview } from "@/components/portal/StudioViews";

export const metadata: Metadata = { title: "Overview" };

export default function Page() {
  return <Overview />;
}
