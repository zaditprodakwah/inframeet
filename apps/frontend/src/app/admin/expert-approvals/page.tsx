import React from "react";
import { redirect } from "next/navigation";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import ExpertApprovalClient from "./ExpertApprovalClient";

export const dynamic = "force-dynamic";

export default async function ExpertApprovalsPage() {
  if (!supabaseAdmin) {
    return <div className="text-red-500 font-bold p-6">Database Admin error.</div>;
  }

  // 1. Authenticate the performing staff member using standard Supabase client session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login?redirectTo=/admin/expert-approvals");
  }

  // 2. Query staff table to verify admin or manager role
  const { data: staff } = await supabaseAdmin
    .from("staff")
    .select("role")
    .eq("auth_user_id", user.id)
    .single();

  if (!staff || !["admin", "manager"].includes(staff.role)) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-red-950/10 border border-red-500/20 rounded-3xl max-w-lg mx-auto space-y-3">
        <h3 className="text-base font-extrabold text-red-400">Akses Terlarang</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Halaman ini hanya dapat diakses oleh Administrator platform. Silakan hubungi pengembang utama jika Anda rasa ini adalah sebuah kesalahan.
        </p>
      </div>
    );
  }

  // 3. Fetch all experts (both pending and approved)
  const { data: experts, error } = await supabaseAdmin
    .from("expert_directory")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load experts for admin console:", error);
  }

  const listExperts = experts || [];

  return (
    <div className="space-y-6 select-none font-sans">
      <div>
        <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-200 bg-clip-text text-transparent">
          Expert Verification Moderation
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Daftar antrean verifikasi jaringan pakar terakreditasi. Lakukan validasi dan publikasikan profil pakar secara global.
        </p>
      </div>

      <ExpertApprovalClient initialExperts={listExperts} />
    </div>
  );
}
