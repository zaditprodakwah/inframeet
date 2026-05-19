import React from "react";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import ExpertProfileClient from "./ExpertProfileClient";

interface ProfilePageProps {
  params: Promise<{ slug: string }>;
}

// 1. Generate Metadata dynamically for SEO optimization
export async function generateMetadata({ params }: ProfilePageProps) {
  const { slug } = await params;

  if (!supabaseAdmin) {
    return { title: "Database missing" };
  }

  // Fetch expert details by slug from database
  const { data: expert } = await supabaseAdmin
    .from("expert_directory")
    .select("full_name, title, bio_summary, tags, slug")
    .eq("slug", slug)
    .eq("is_public", true)
    .single();

  if (!expert) {
    return {
      title: "Pakar Tidak Ditemukan | INFRAMEET",
    };
  }

  // Construct Person Schema.org JSON-LD
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": expert.full_name,
    "jobTitle": expert.title,
    "description": expert.bio_summary,
    "url": `https://inframeet.com/experts/${expert.slug}`,
    "knowsAbout": expert.tags || [],
    "affiliation": {
      "@type": "Organization",
      "name": "INFRAMEET Jaringan Pakar Terverifikasi",
    },
  };

  return {
    title: `${expert.full_name} | Pakar Terverifikasi INFRAMEET`,
    description: expert.bio_summary ? expert.bio_summary.substring(0, 155) + "..." : "",
    alternates: {
      canonical: `/experts/${expert.slug}`,
    },
    other: {
      "script:ld+json": JSON.stringify(personSchema),
    },
  };
}

// 2. Render Server Component Page
export default async function ExpertProfilePage({ params }: ProfilePageProps) {
  const { slug } = await params;

  if (!supabaseAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xs text-red-500 font-mono">
        Database connection is not configured.
      </div>
    );
  }

  // Fetch expert profile bypassing RLS
  const { data: expert } = await supabaseAdmin
    .from("expert_directory")
    .select("*")
    .eq("slug", slug)
    .eq("is_public", true)
    .single();

  if (!expert) {
    notFound();
  }

  // Fetch achievements if expert is linked to auth.users user_id
  let achievements: any[] = [];
  if (expert.user_id) {
    const { data: achData } = await supabaseAdmin
      .from("user_achievements")
      .select("*")
      .eq("user_id", expert.user_id);
    
    if (achData) {
      achievements = achData;
    }
  }

  return (
    <ExpertProfileClient 
      expert={expert} 
      achievements={achievements} 
    />
  );
}
