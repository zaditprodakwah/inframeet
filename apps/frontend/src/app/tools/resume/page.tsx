"use client";

import React, { useState } from "react";
import MegaMenu from "@/app/components/MegaMenu";
import Breadcrumbs from "@/app/components/Breadcrumbs";
import { Sparkles, Download, Plus, Trash2, Printer } from "lucide-react";

export default function ResumeBuilderPage() {
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "Muhammad Khoiruzzadittaqwa",
    title: "Senior Full Stack Engineer & IT Consultant",
    email: "muhzadit@gmail.com",
    phone: "+62 823-1636-3177",
    location: "Bandung, Indonesia",
    summary: "Insinyur perangkat lunak profesional dengan pengalaman lebih dari 5 tahun dalam merancang arsitektur serverless awan berkinerja tinggi, mengelola basis data skala besar, and mengintegrasikan API pihak ketiga secara tangguh.",
  });

  const [experiences, setExperiences] = useState([
    {
      company: "INFRAMEET Digital",
      role: "Lead Architect",
      period: "2024 - Sekarang",
      description: "Memimpin perancangan arsitektur Zero-Cost Serverless Next.js, merancang otomatisasi API checkout manual, and mengamankan rute data sensitif.",
    },
    {
      company: "Tech Solution Corp",
      role: "Software Engineer",
      period: "2021 - 2024",
      description: "Mengembangkan modul pembayaran digital and membangun restrukturisasi dasbor administrasi internal dengan polling dinamis.",
    },
  ]);

  const [educations, setEducations] = useState([
    {
      institution: "Institut Teknologi Bandung",
      degree: "Sarjana Teknik Informatika",
      period: "2017 - 2021",
    },
  ]);

  const [skills, setSkills] = useState([
    "React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Supabase", "Cloudinary", "Zod", "REST API"
  ]);

  const [newSkill, setNewSkill] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [premiumCode, setPremiumCode] = useState("");

  const addExperience = () => {
    setExperiences([...experiences, { company: "", role: "", period: "", description: "" }]);
  };

  const removeExperience = (index: number) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    setEducations([...educations, { institution: "", degree: "", period: "" }]);
  };

  const removeEducation = (index: number) => {
    setEducations(educations.filter((_, i) => i !== index));
  };

  const addSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleVerifyCode = () => {
    if (premiumCode.trim() === "@InframeetCV2026!") {
      setIsPremium(true);
      alert("🎉 Akun Premium Aktif! Watermark SKU ACD-MOD-CV berhasil dihilangkan.");
    } else {
      alert("❌ Kode premium tidak valid!");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans print:bg-white print:text-black">
      <div className="print:hidden">
        <MegaMenu />
        <Breadcrumbs />
      </div>

      {/* Editor & Preview Split Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8 print:block print:p-0 print:m-0">
        
        {/* Editor Pane (Left Column) */}
        <section className="space-y-6 print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-4 h-4" />
            </span>
            <h1 className="text-xl font-bold text-white tracking-tight">Formulator CV ATS-Friendly</h1>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 backdrop-blur-md space-y-6">
            
            {/* Personal Info */}
            <div className="space-y-4 font-sans">
              <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Informasi Pribadi</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label htmlFor="resume-fullname" className="text-[9px] font-bold text-slate-450 uppercase tracking-wider">Nama Lengkap</label>
                  <input
                    id="resume-fullname"
                    name="fullName"
                    type="text"
                    value={personalInfo.fullName}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                    placeholder="Nama Lengkap"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="resume-title" className="text-[9px] font-bold text-slate-455 uppercase tracking-wider">Profesi / Jabatan</label>
                  <input
                    id="resume-title"
                    name="title"
                    type="text"
                    value={personalInfo.title}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, title: e.target.value })}
                    placeholder="Profesi / Jabatan"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="resume-email" className="text-[9px] font-bold text-slate-455 uppercase tracking-wider">Alamat Email</label>
                  <input
                    id="resume-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={personalInfo.email}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                    placeholder="Email"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="resume-phone" className="text-[9px] font-bold text-slate-455 uppercase tracking-wider">Nomor Telepon</label>
                  <input
                    id="resume-phone"
                    name="phone"
                    type="text"
                    autoComplete="tel"
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                    placeholder="Telepon/WA"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex flex-col gap-1 md:col-span-2">
                  <label htmlFor="resume-location" className="text-[9px] font-bold text-slate-455 uppercase tracking-wider">Domisili / Lokasi</label>
                  <input
                    id="resume-location"
                    name="location"
                    type="text"
                    value={personalInfo.location}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                    placeholder="Lokasi (e.g. Jakarta, Indonesia)"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="resume-summary" className="text-[9px] font-bold text-slate-455 uppercase tracking-wider">Rangkuman Karir / Profil</label>
                <textarea
                  id="resume-summary"
                  name="summary"
                  value={personalInfo.summary}
                  rows={3}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, summary: e.target.value })}
                  placeholder="Rangkuman Karir / Profil Singkat"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
            </div>

            <hr className="border-slate-850" />

            {/* Experience List */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Pengalaman Kerja</h2>
                <button
                  onClick={addExperience}
                  className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 hover:text-white cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Pengalaman
                </button>
              </div>

              {experiences.map((exp, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950/40 border border-slate-850 relative space-y-3">
                  <button
                    onClick={() => removeExperience(idx)}
                    className="absolute top-4 right-4 text-slate-500 hover:text-red-400 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => {
                        const newExp = [...experiences];
                        newExp[idx].company = e.target.value;
                        setExperiences(newExp);
                      }}
                      placeholder="Nama Perusahaan"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => {
                        const newExp = [...experiences];
                        newExp[idx].role = e.target.value;
                        setExperiences(newExp);
                      }}
                      placeholder="Jabatan"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                    <input
                      type="text"
                      value={exp.period}
                      onChange={(e) => {
                        const newExp = [...experiences];
                        newExp[idx].period = e.target.value;
                        setExperiences(newExp);
                      }}
                      placeholder="Periode (e.g. 2021 - 2024)"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <textarea
                    value={exp.description}
                    rows={2}
                    onChange={(e) => {
                      const newExp = [...experiences];
                      newExp[idx].description = e.target.value;
                      setExperiences(newExp);
                    }}
                    placeholder="Deskripsi tugas dan kontribusi Anda..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                  />
                </div>
              ))}
            </div>

            <hr className="border-slate-850" />

            {/* Education List */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Pendidikan</h2>
                <button
                  onClick={addEducation}
                  className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 hover:text-white cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Pendidikan
                </button>
              </div>

              {educations.map((edu, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950/40 border border-slate-850 relative space-y-3">
                  <button
                    onClick={() => removeEducation(idx)}
                    className="absolute top-4 right-4 text-slate-500 hover:text-red-400 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => {
                        const newEdu = [...educations];
                        newEdu[idx].institution = e.target.value;
                        setEducations(newEdu);
                      }}
                      placeholder="Nama Lembaga"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => {
                        const newEdu = [...educations];
                        newEdu[idx].degree = e.target.value;
                        setEducations(newEdu);
                      }}
                      placeholder="Gelar"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                    <input
                      type="text"
                      value={edu.period}
                      onChange={(e) => {
                        const newEdu = [...educations];
                        newEdu[idx].period = e.target.value;
                        setEducations(newEdu);
                      }}
                      placeholder="Periode (e.g. 2017 - 2021)"
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            <hr className="border-slate-850" />

            {/* Skills */}
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Keahlian (Skills)</h2>
              <form onSubmit={addSkill} className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Tambah keahlian baru..."
                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                >
                  Tambah
                </button>
              </form>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-850 border border-slate-800 text-[10px] text-slate-300 font-bold"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(skill)}
                      className="text-slate-500 hover:text-red-400 cursor-pointer"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <hr className="border-slate-850" />

            {/* Premium Code / Ads Panel */}
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-850/80 space-y-3">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Opsi Penghapusan Watermark (SKU ACD-MOD-CV)</span>
              <p className="text-[10px] text-slate-450 leading-relaxed">
                Platform menyediakan builder ini secara gratis. Namun, berkas unduhan akan dibubuhi watermark di bagian bawah halaman. Masukkan kode premium konsultasi or kemitraan Anda untuk menghapusnya.
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={premiumCode}
                  onChange={(e) => setPremiumCode(e.target.value)}
                  placeholder="Masukkan Kode Kemitraan Anda"
                  className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleVerifyCode}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                >
                  Verifikasi
                </button>
              </div>
            </div>

          </div>
        </section>

        {/* Live Preview Panel & Printing Canvas (Right Column) */}
        <section className="space-y-4 print:p-0 print:m-0 print:border-none">
          <div className="flex items-center justify-between print:hidden">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pratinjau Kertas & Unduhan</span>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-indigo-600/10 flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Unduh / Cetak CV
            </button>
          </div>

          {/* ATS Standard Sheet layout */}
          <div className="w-full min-h-[842px] p-10 bg-white text-slate-900 font-sans shadow-2xl rounded-2xl print:shadow-none print:rounded-none print:p-0 print:m-0 border border-slate-200 print:border-none space-y-6">
            
            {/* Header ATS */}
            <div className="text-center border-b-2 border-slate-900 pb-5 space-y-1">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-sans uppercase">{personalInfo.fullName}</h2>
              <h4 className="text-xs font-bold text-indigo-700 tracking-wide">{personalInfo.title}</h4>
              <p className="text-[10px] text-slate-650 flex justify-center gap-4 font-medium pt-1">
                <span>✉️ {personalInfo.email}</span>
                <span>📞 {personalInfo.phone}</span>
                <span>📍 {personalInfo.location}</span>
              </p>
            </div>

            {/* Executive Summary */}
            {personalInfo.summary && (
              <div className="space-y-2">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1">RANGKUMAN PROFESIONAL</h3>
                <p className="text-[11px] text-slate-700 leading-relaxed font-sans">{personalInfo.summary}</p>
              </div>
            )}

            {/* Employment History */}
            {experiences.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1">PENGALAMAN KERJA</h3>
                <div className="space-y-3">
                  {experiences.map((exp, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <span className="text-[11px] font-extrabold text-slate-900">{exp.company}</span>
                        <span className="text-[10px] text-slate-600 font-bold">{exp.period}</span>
                      </div>
                      <div className="text-[10px] text-indigo-700 font-extrabold italic">{exp.role}</div>
                      <p className="text-[10px] text-slate-700 leading-relaxed font-sans">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Academic Credentials */}
            {educations.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1">PENDIDIKAN</h3>
                <div className="space-y-2">
                  {educations.map((edu, idx) => (
                    <div key={idx} className="flex justify-between items-baseline">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-extrabold text-slate-900">{edu.institution}</span>
                        <span className="text-[10px] text-slate-600 font-semibold">{edu.degree}</span>
                      </div>
                      <span className="text-[10px] text-slate-600 font-bold">{edu.period}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Skills ATS list */}
            {skills.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-300 pb-1">KEAHLIAN (TECHNICAL SKILLS)</h3>
                <p className="text-[10px] text-slate-700 leading-relaxed font-sans">
                  {skills.join(" • ")}
                </p>
              </div>
            )}

            {/* Watermark for Non-paid Users */}
            {!isPremium && (
              <div className="pt-8 border-t border-dashed border-slate-200 text-center text-[9px] text-slate-400 font-mono tracking-wider font-semibold">
                🛡️ Created with INFRAMEET ATS Builder (Watermarked - SKU: ACD-MOD-CV)
              </div>
            )}

          </div>
        </section>

      </main>

      <footer className="py-8 bg-[#0a0f1d] border-t border-[#1e293b] text-center text-xs text-slate-500 print:hidden">
        © 2026 INFRAMEET. Seluruh hak cipta dilindungi undang-undang.
      </footer>
    </div>
  );
}
