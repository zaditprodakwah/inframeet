// ============================================================================
// 🛡️ INFRAMEET — ZERO-DATABASE CDN COMPILER WORKER
// ============================================================================
// File Path: scripts/cdn-compiler.js
// Purpose: Compiles directory profiles into static JSON objects and uploads them
//          to Supabase Storage (CDN), enabling external widgets to read data at
//          Rp 0 database fees!
// ============================================================================

const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://iwowggzeqkzewdrdjkvu.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error("❌ ERROR: SUPABASE_SERVICE_ROLE_KEY env var is missing. Cannot run compiler.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
});

async function compileAllProfilesToCDN() {
  console.log("====================================================================");
  console.log("⚡ Starting Zero-Database CDN Profile Compiler...");
  console.log(`📡 Connection URL: ${supabaseUrl}`);

  try {
    // 1. Fetch active settings toggle
    const { data: toggle } = await supabase
      .from("system_settings")
      .select("value")
      .eq("key", "cdn_sync_active")
      .single();

    if (toggle && toggle.value === false) {
      console.warn("⚠️ CDN Compilation is currently deactivated via system settings.");
      return;
    }

    // 2. Fetch all directory records
    console.log("📥 Fetching active profiles from omni_directory...");
    const { data: profiles, error: fetchErr } = await supabase
      .from("omni_directory")
      .select("id, slug, name, trust_score, verification_status, entity_type, metadata");

    if (fetchErr) throw fetchErr;

    console.log(`💼 Found ${profiles.length} profiles to compile.`);

    // 3. Compile each profile and upload static JSON state to storage bucket
    for (const p of profiles) {
      console.log(`⚙️  Compiling profile: ${p.name} (${p.slug})...`);

      // Fetch reviews/proofs if any to embed inside cache
      const { data: proofs } = await supabase
        .from("trust_proofs")
        .select("proof_type, status, metadata")
        .eq("directory_id", p.id);

      const staticState = {
        compiled_at: new Date().toISOString(),
        id: p.id,
        slug: p.slug,
        name: p.name,
        entity_type: p.entity_type,
        trust_score: p.trust_score,
        verification_status: p.verification_status,
        metadata: p.metadata,
        proofs: proofs || [],
        system_verification_badge: p.trust_score >= 85 ? "UNREACHABLE_AUTHORITY" : "STANDARD_VERIFIED"
      };

      const buffer = Buffer.from(JSON.stringify(staticState, null, 2));

      // Upload/Overwrite file in 'public-assets' bucket
      const { error: uploadErr } = await supabase.storage
        .from("public-assets")
        .upload(`cdn/profiles/${p.slug}.json`, buffer, {
          contentType: "application/json",
          upsert: true
        });

      if (uploadErr) {
        console.error(`❌ Failed uploading static state for ${p.slug}:`, uploadErr.message);
      } else {
        console.log(`✅ Static JSON uploaded successfully for: ${p.slug}.json`);
      }
    }

    console.log("🎉 CDN compilation sync task successfully finalized!");
    console.log("====================================================================");
  } catch (err) {
    console.error("❌ Compiler task encountered failure:", err.message);
  }
}

compileAllProfilesToCDN();
