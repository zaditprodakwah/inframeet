import { NextRequest, NextResponse } from "next/server";
import { sendAdminApprovalEmail, sendExpertWelcomeEmail } from "@/lib/email";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "admin";
  const testEmail = searchParams.get("email") || "inframeet@emailforums.biz";

  const dummyExpert = {
    id: "d5780929-74ca-4fb7-ae2e-860fe4fdcc4d",
    slug: "dr-ahmad-riyadi-9912",
    full_name: "Dr. Ahmad Riyadi, M.Kom",
    title: "Senior Consultant in Cloud Systems & Distributed Databases",
    category: "TECH",
    bio_summary: "Dosen senior dan praktisi dengan pengalaman 15+ tahun dalam mengarsiteki sistem basis data serverless, audit performa Core Web Vitals, dan implementasi infrastruktur microservices.",
    contact_routing: {
      whatsapp: "628123456789",
      email: testEmail,
    },
  };

  try {
    let result;
    if (type === "welcome") {
      result = await sendExpertWelcomeEmail(dummyExpert);
    } else {
      result = await sendAdminApprovalEmail(dummyExpert);
    }

    return NextResponse.json({
      success: true,
      message: `Test email (${type}) sent successfully.`,
      result,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err.message,
    }, { status: 500 });
  }
}
