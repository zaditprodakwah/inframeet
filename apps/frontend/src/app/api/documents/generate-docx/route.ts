import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabase";
import { calculatePricing } from "../../../../lib/pricingMath";
import { generateDocxBuffer } from "../../../../lib/docxHelper";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      leadId,
      activeComponentIds,
      volumes,
      clientSignatoryName,
      clientSignatoryTitle,
      paymentTerms = '50-50',
      discountPercent = 0
    } = body;

    // 1. INPUT VALIDATION
    if (!leadId) {
      return NextResponse.json(
        { error: "Parameter leadId wajib disertakan!" },
        { status: 400 }
      );
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: "Supabase Service Key is not configured on the server!" },
        { status: 500 }
      );
    }

    // 2. FETCH CRM LEAD DETAILS
    const { data: lead, error: leadFetchError } = await supabaseAdmin
      .from("crm_leads")
      .select()
      .eq("id", leadId)
      .maybeSingle();

    if (leadFetchError) {
      console.error("Lead fetch failed:", leadFetchError);
      return NextResponse.json({ error: leadFetchError.message }, { status: 500 });
    }

    if (!lead) {
      return NextResponse.json(
        { error: "Data lead tidak ditemukan di CRM!" },
        { status: 404 }
      );
    }

    // 3. SERVER-SIDE DYNAMIC PRICING ENGINE RECALCULATION
    const calculated = calculatePricing({
      segment: lead.segment,
      activeComponentIds: activeComponentIds || [],
      volumes: volumes || {}
    });

    const subtotalPrice = calculated.totalPrice;
    const discountAmount = Math.round(subtotalPrice * (discountPercent / 100));
    const netAmount = subtotalPrice - discountAmount;

    // 4. PREPARE CLIENT ACCOUNT (Self-healing upsert by email)
    let { data: client, error: clientFetchError } = await supabaseAdmin
      .from("clients")
      .select()
      .eq("email", lead.email)
      .maybeSingle();

    if (clientFetchError) {
      console.error("Client fetch error:", clientFetchError);
    }

    if (!client) {
      const { data: newClient, error: clientInsertError } = await supabaseAdmin
        .from("clients")
        .insert({
          email: lead.email,
          name: lead.client_name,
          company_name: lead.company_name || null,
          phone: lead.phone || null,
          segment: lead.segment,
          status: "active"
        })
        .select()
        .single();

      if (clientInsertError) {
        console.error("Client insert error:", clientInsertError);
        return NextResponse.json({ error: clientInsertError.message }, { status: 500 });
      }
      client = newClient;
    }

    // 5. PREPARE PROJECT FOR ONBOARDING
    const projectTitle = `${lead.company_name || lead.client_name} - Project Contract`;
    let { data: project, error: projectFetchError } = await supabaseAdmin
      .from("projects")
      .select()
      .eq("client_id", client.id)
      .eq("title", projectTitle)
      .maybeSingle();

    if (projectFetchError) {
      console.error("Project fetch error:", projectFetchError);
    }

    if (!project) {
      const { data: newProject, error: projectInsertError } = await supabaseAdmin
        .from("projects")
        .insert({
          client_id: client.id,
          title: projectTitle,
          project_type: lead.segment === 'b2b' ? 'web-development' : 'document-layout',
          segment: lead.segment,
          status: "inquiry",
          total_amount_idr: netAmount
        })
        .select()
        .single();

      if (projectInsertError) {
        console.error("Project insert error:", projectInsertError);
        return NextResponse.json({ error: projectInsertError.message }, { status: 500 });
      }
      project = newProject;
    }

    // 6. PREPARE CONTRACT BRIEF
    const budgetRange = netAmount >= 500000000 ? '>500M' : netAmount >= 100000000 ? '100M-500M' : netAmount >= 50000000 ? '50M-100M' : '<50M';
    const { data: brief, error: briefInsertError } = await supabaseAdmin
      .from("briefs")
      .insert({
        project_id: project.id,
        client_id: client.id,
        budget_range: budgetRange,
        timeline_weeks: lead.segment === 'b2b' ? 8 : 4,
        key_objectives: `SOW generated for project: ${projectTitle}`,
        status: "approved"
      })
      .select()
      .single();

    if (briefInsertError) {
      console.error("Brief insert error:", briefInsertError);
      return NextResponse.json({ error: briefInsertError.message }, { status: 500 });
    }

    // 7. WRITE SCOPE OF WORK (SoW)
    const { data: sow, error: sowInsertError } = await supabaseAdmin
      .from("scope_of_work")
      .insert({
        brief_id: brief.id,
        project_id: project.id,
        total_amount_idr: subtotalPrice,
        discount_percent: discountPercent,
        net_amount_idr: netAmount,
        payment_terms: paymentTerms,
        revision_limit: lead.segment === 'academic' ? 3 : 2,
        revision_cost_idr: 500000,
        status: "draft"
      })
      .select()
      .single();

    if (sowInsertError) {
      console.error("Sow insert error:", sowInsertError);
      return NextResponse.json({ error: sowInsertError.message }, { status: 500 });
    }

    // 8. WRITE SOW LINE ITEMS (Task 3.2: Line Items Parsing Logic)
    const lineItems = calculated.breakdown.map((item, index) => ({
      sow_id: sow.id,
      line_number: index + 1,
      category: item.id.includes('base') ? 'Core Base' : (lead.segment === 'b2b' ? 'B2B Module' : 'Academic Support'),
      deliverable: item.name,
      quantity: item.volumeCount || 1,
      unit_price_idr: Math.round(item.price / (item.volumeCount || 1)),
      total_price_idr: item.price,
      notes: item.isVolume ? `Volume based: ${item.volumeCount} units` : 'Flat Rate component'
    }));

    const { error: itemsInsertError } = await supabaseAdmin
      .from("sow_line_items")
      .insert(lineItems);

    if (itemsInsertError) {
      console.error("Sow items insert error:", itemsInsertError);
      return NextResponse.json({ error: itemsInsertError.message }, { status: 500 });
    }

    // 9. WRITE AGREEMENT CONTRACT
    const { data: contract, error: contractInsertError } = await supabaseAdmin
      .from("contracts")
      .insert({
        project_id: project.id,
        sow_id: sow.id,
        contract_type: lead.segment === 'b2b' ? 'kemitraan' : 'service',
        status: "pending_signature",
        client_signatory_name: clientSignatoryName || lead.client_name,
        client_signatory_title: clientSignatoryTitle || (lead.segment === 'b2b' ? 'Direktur' : 'Mahasiswa'),
        company_signatory_name: "Muhammad Zadit",
        company_signatory_title: "CEO & Co-Founder INFRAMEET",
        signature_status: { client_signed: false, company_signed: false }
      })
      .select()
      .single();

    if (contractInsertError) {
      console.error("Contract insert error:", contractInsertError);
      return NextResponse.json({ error: contractInsertError.message }, { status: 500 });
    }

    // 10. GENERATE IN-MEMORY OPENXML DOCX AGREEMENT
    const clientIp = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const integrityClause = lead.segment === 'b2b'
      ? "Seluruh Hak Kekayaan Intelektual (HKI) termasuk namun tidak terbatas pada source code, desain antarmuka, dan arsitektur basis data yang dikembangkan dalam proyek ini adalah milik PIHAK PERTAMA (INFRAMEET) sepenuhnya, hingga PIHAK KEDUA (Klien) melunasi 100% dari total Nilai Proyek. Setelah pelunasan diterima, hak guna komersial tanpa batas waktu akan ditransfer kepada PIHAK KEDUA."
      : "PIHAK PERTAMA hanya bertindak sebagai penyedia jasa perbantuan teknis tata letak (layouting), proofreading, dan pengolahan data statistik kuantitatif (SPSS/SEM). Seluruh orisinalitas ide, data mentah riset, and substansi teoretis adalah milik Klien sepenuhnya. INFRAMEET secara mutlak bebas dari segala tuntutan hukum etika akademis di institusi Klien.";

    const formattedDate = new Date().toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

    const docxBuffer = generateDocxBuffer({
      contract_id: contract.id,
      date: formattedDate,
      client_name: lead.client_name,
      company_name: lead.company_name || "Personal/Individu",
      project_title: projectTitle,
      segment_label: lead.segment === 'b2b' ? "Enterprise & B2B Growth" : "Academic & Research Support",
      timeline_weeks: lead.segment === 'b2b' ? 8 : 4,
      start_date: new Date().toLocaleDateString("id-ID"),
      end_date: new Date(Date.now() + (lead.segment === 'b2b' ? 8 : 4) * 7 * 24 * 60 * 60 * 1000).toLocaleDateString("id-ID"),
      scope_items: lineItems.map(item => ({
        line_number: item.line_number,
        category: item.category,
        deliverable: item.deliverable,
        quantity: item.quantity,
        total_price_idr: item.total_price_idr.toLocaleString("id-ID")
      })),
      subtotal_idr: subtotalPrice.toLocaleString("id-ID"),
      discount_percent: discountPercent,
      discount_amount_idr: discountAmount.toLocaleString("id-ID"),
      net_amount_idr: netAmount.toLocaleString("id-ID"),
      payment_terms_label: paymentTerms === '50-50' ? "DP 50% + Pelunasan 50%" : paymentTerms === '30-70' ? "DP 30% + Pelunasan 70%" : paymentTerms === 'upfront' ? "Pembayaran di Muka (100% Upfront)" : "Custom terms",
      revision_limit: lead.segment === 'academic' ? 3 : 2,
      revision_cost_idr: (500000).toLocaleString("id-ID"),
      legal_clause_integrity: integrityClause,
      client_ip: clientIp,
      client_signatory_name: clientSignatoryName || lead.client_name,
      company_signatory_name: "Muhammad Zadit (CEO INFRAMEET)"
    });

    // 11. SELF-HEALING STORAGE BUCKET CREATION (Task 3.4)
    try {
      const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
      if (listError) throw listError;
      const contractsBucketExists = buckets?.some(b => b.name === "contracts");
      if (!contractsBucketExists) {
        await supabaseAdmin.storage.createBucket("contracts", { public: true });
      }
    } catch (storageSetupError) {
      console.error("Storage self-healing bucket creation error:", storageSetupError);
      // We proceed even if check fails, upload itself will catch if issues exist
    }

    // 12. UPLOAD TO SECURE SUPABASE STORAGE BUCKET
    const storagePath = `sows/${sow.id}_sow.docx`;
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from("contracts")
      .upload(storagePath, docxBuffer, {
        contentType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        upsert: true
      });

    if (uploadError) {
      console.error("Storage upload failed:", uploadError);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: urlData } = supabaseAdmin.storage
      .from("contracts")
      .getPublicUrl(storagePath);

    const documentUrl = urlData.publicUrl;

    // 13. RECONCILE RECORD DOCUMENT PATHS
    await supabaseAdmin
      .from("scope_of_work")
      .update({
        document_url: documentUrl,
        document_storage_key: storagePath
      })
      .eq("id", sow.id);

    await supabaseAdmin
      .from("contracts")
      .update({
        document_url: documentUrl,
        document_storage_key: storagePath
      })
      .eq("id", contract.id);

    // Update CRM Lead funnel stage
    await supabaseAdmin
      .from("crm_leads")
      .update({
        funnel_status: "SOW_PENDING"
      })
      .eq("id", lead.id);

    // Write audit trails
    await supabaseAdmin
      .from("crm_communications")
      .insert({
        lead_id: lead.id,
        channel: "SYSTEM",
        subject: "Scope of Work & Contract Generated",
        message_body: `Legal document rendered successfully using OpenXML template. Net amount: Rp ${netAmount.toLocaleString("id-ID")}. SOW File saved: ${documentUrl}`
      });

    return NextResponse.json({
      success: true,
      contractId: contract.id,
      sowId: sow.id,
      projectId: project.id,
      documentUrl
    });

  } catch (error: any) {
    console.error("SoW/Contract generation crash:", error);
    return NextResponse.json(
      { error: "Terjadi kegagalan pemrosesan dokumen internal server." },
      { status: 500 }
    );
  }
}
