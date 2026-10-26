import type { Metadata } from "next";
import { CalendarView } from "@/components/portal/StudioViews";

export const metadata: Metadata = { title: "Calendar" };

export default function Page() {
  return <CalendarView />;
}
