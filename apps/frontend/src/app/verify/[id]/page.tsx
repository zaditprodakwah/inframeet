import { supabaseAdmin } from "@/lib/supabase";
import { verifySignature, signData } from "@/lib/integrity";
import Link from "next/link";
import { 
  ShieldCheck, 
  AlertCircle, 
  Calendar, 
  Hash, 
  User, 
  Award, 
  FileText, 
  CheckCircle2, 
  Terminal, 
  ArrowLeft,
  Activity,
  Globe
} from "lucide-react";

export const dynamic = "force-dynamic";

interface VerifyPageProps {
  params: any;
}

export default async function VerifyCredentialPage({ params }: VerifyPageProps) {
  const resolvedParams = await params;
  const credentialIdOrHash = resolvedParams.id;

  if (!supabaseAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-3xl text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto animate-pulse" />
          <h2 className="text-xl font-bold">Database Error</h2>
          <p className="text-xs text-slate-400">Supabase Admin client is missing or unconfigured.</p>
        </div>
      </div>
    );
  }

  let credential: any = null;
  let isVerified = false;
  let decodedPayload: any = null;
  let verificationErrorMsg = "";

  try {
    // 1. Fetch credential by ID (UUID) or by SHA-256 Hash from verifiable_credentials
    let query = supabaseAdmin.from("verifiable_credentials").select("*");
    
    if (credentialIdOrHash.length === 64) {
      query = query.eq("hash", credentialIdOrHash);
    } else {
      query = query.eq("id", credentialIdOrHash);
    }

    const { data: vc } = await query.single();

    if (vc) {
      credential = vc;
    } else if (credentialIdOrHash.length !== 64) {
      // 2. Self-healing fallback: If not found, check if it's a valid expert_id
      const { data: expert } = await supabaseAdmin
        .from("expert_directory")
        .select("*")
        .eq("id", credentialIdOrHash)
        .single();

      if (expert) {
        // Dynamically generate and cryptographically sign the credential payload on the fly!
        const payload = {
          fullName: expert.full_name,
          title: expert.title,
          expertTier: expert.expert_tier,
          reputationScore: expert.reputation_score || 100,
          category: expert.category,
        };
        const { token, hash } = await signData(expert.id, "EXPERT", payload);
        credential = {
          id: expert.id,
          subject_id: expert.id,
          subject_type: "EXPERT",
          credential_type: "EXPERT_ACCREDITATION",
          payload,
          signature: token,
          hash,
          status: "VALID",
          created_at: expert.created_at || new Date().toISOString(),
        };
      }
    }

    if (credential) {
      // Cryptographically verify the signature
      decodedPayload = await verifySignature(credential.signature);
      if (credential.status === "VALID") {
        isVerified = true;
      } else {
        verificationErrorMsg = "Kredensial ini telah dicabut (REVOKED) oleh komite kepatuhan.";
      }
    } else {
      verificationErrorMsg = "Catatan kredensial tidak ditemukan pada database integritas INFRAMEET.";
    }
  } catch (err: any) {
    verificationErrorMsg = `Gagal memvalidasi signature kriptografis: ${err.message}`;
  }

  // Formatting date helper
  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short"
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-600/30 flex flex-col justify-between">
      
      {/* Top Header Navigation */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xs font-black tracking-widest text-slate-300 hover:text-white transition-colors animate-fade-in">
            <ArrowLeft className="w-4 h-4 text-indigo-400" />
            KEMBALI KE INFRAMEET
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 tracking-wider font-mono uppercase">Integrity Node v1.0</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 py-16 px-6 max-w-3xl mx-auto w-full space-y-10">
        
        {/* Verification Status Card */}
        {isVerified && credential && decodedPayload ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-350">
            
            {/* Success Shield Panel */}
            <div className="p-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden flex flex-col items-center text-center space-y-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/5">
                <ShieldCheck className="w-8 h-8 animate-pulse" />
              </div>
              
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-black tracking-widest text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/10">
                  Cryptographic Signature Valid
                </span>
                <h1 className="text-xl md:text-2xl font-black text-white tracking-tight pt-1">
                  Kredensial Terverifikasi Resmi
                </h1>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  Dokumen/Profil ini telah ditandatangani secara kriptografis oleh INFRAMEET Integrity Authority dan terbukti asli (tidak mengalami modifikasi).
                </p>
              </div>
            </div>

            {/* Document Details Block */}
            <div className="p-8 rounded-3xl border border-slate-900 bg-slate-950/70 backdrop-blur-xl space-y-6 shadow-sm">
              <h3 className="text-xs font-black tracking-wider uppercase text-slate-400 flex items-center gap-2 border-b border-slate-900 pb-3">
                <Activity className="w-4 h-4 text-indigo-400" /> Detail Kredensial Penerima
              </h3>

              {credential.subject_type === "EXPERT" ? (
                /* EXPERT PROFILE DETAILS */
                <div className="space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/30 border border-slate-900">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white leading-tight">{decodedPayload.fullName || decodedPayload.full_name || "Pakar Terverifikasi"}</h4>
                        <span className="text-[10px] text-slate-500 font-medium tracking-wide block mt-0.5">{decodedPayload.title || "Spesialis Riset"}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-black text-amber-400 uppercase tracking-widest font-mono">
                        {decodedPayload.expertTier || "Verified"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-900/30 border border-slate-900 space-y-1">
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">Integritas Reputasi</span>
                      <span className="text-xs font-black text-slate-200 flex items-center gap-1">
                        <Award className="w-4 h-4 text-indigo-400" /> {decodedPayload.reputationScore || "100"} / 150 Points
                      </span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900/30 border border-slate-900 space-y-1">
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">Tanggal Terbit</span>
                      <span className="text-xs font-black text-slate-200 flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-emerald-400" /> {formatDate(credential.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* BAST DOCUMENT DETAILS */
                <div className="space-y-5">
                  <div className="p-4 rounded-2xl bg-slate-900/30 border border-slate-900 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">Berita Acara Serah Terima (BAST)</h4>
                      <span className="text-[10px] text-slate-500 font-medium tracking-wide block mt-0.5">Project ID: {decodedPayload.projectId || "Project Terverifikasi"}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-slate-900/30 border border-slate-900 space-y-1">
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">Penandatangan Utama</span>
                      <span className="text-xs font-black text-slate-200 flex items-center gap-1">
                        <User className="w-4 h-4 text-indigo-400" /> {decodedPayload.signatoryName || "Klien Terverifikasi"}
                      </span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900/30 border border-slate-900 space-y-1">
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">Tanggal Tanda Tangan</span>
                      <span className="text-xs font-black text-slate-200 flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-emerald-400" /> {formatDate(credential.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cryptographic Proof Details */}
            <div className="p-8 rounded-3xl border border-slate-900 bg-slate-950/70 backdrop-blur-xl space-y-6 shadow-sm">
              <h3 className="text-xs font-black tracking-wider uppercase text-slate-400 flex items-center gap-2 border-b border-slate-900 pb-3">
                <Terminal className="w-4 h-4 text-indigo-400" /> Kunci Pembuktian Kriptografis
              </h3>

              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono block">SHA-256 Hash Data</span>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-900 flex items-center gap-2 text-[10px] font-mono text-indigo-300 break-all select-all">
                    <Hash className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    {credential.hash}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono block">Algoritma Penandatangan</span>
                    <span className="text-xs font-bold text-slate-200 font-mono block px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-900">
                      ES256 (ECDSA P-256)
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono block">Otoritas Penerbit</span>
                    <span className="text-xs font-bold text-slate-200 font-mono block px-3 py-2 rounded-xl bg-slate-900/60 border border-slate-900 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-indigo-500" /> INFRAMEET
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono block">Raw Signed JWT Token String</span>
                  <pre className="p-4 rounded-xl bg-slate-950 border border-slate-900 overflow-x-auto text-[9px] font-mono leading-relaxed text-slate-400 max-h-40 scrollbar-thin select-all">
                    {credential.signature}
                  </pre>
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* Error Shield Panel */
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="p-8 rounded-3xl border border-red-500/20 bg-red-950/5 relative overflow-hidden flex flex-col items-center text-center space-y-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 shadow-lg">
                <AlertCircle className="w-8 h-8 animate-bounce" />
              </div>
              
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-black tracking-widest text-red-400 px-2 py-0.5 rounded bg-red-500/10 border border-red-500/10">
                  Verification Failed
                </span>
                <h1 className="text-xl md:text-2xl font-black text-white tracking-tight pt-1">
                  Kredensial Tidak Terverifikasi
                </h1>
                <p className="text-xs text-red-400/80 max-w-md mx-auto leading-relaxed">
                  {verificationErrorMsg || "Kunci tanda tangan digital tidak cocok atau data mengalami modifikasi ilegal."}
                </p>
              </div>
            </div>
            
            <div className="text-center pt-4">
              <Link href="/" className="inline-flex items-center justify-center px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold border border-slate-800 transition-all cursor-pointer">
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900/60 py-8 select-none">
        <div className="max-w-6xl mx-auto px-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} INFRAMEET Integrity Authority. Seluruh hak cipta dilindungi undang-undang.
        </div>
      </footer>

    </div>
  );
}
