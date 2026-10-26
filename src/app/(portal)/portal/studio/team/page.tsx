import type { Metadata } from "next";
import { TeamView } from "@/components/portal/StudioViews";

export const metadata: Metadata = { title: "Team" };

export default function Page() {
  return <TeamView />;
}
