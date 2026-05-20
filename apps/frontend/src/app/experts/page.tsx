import { redirect } from "next/navigation";

// Server Component — no client-side JS, SEO-safe 308 redirect
export default function ExpertsPage() {
  redirect("/submission?tab=experts");
}
