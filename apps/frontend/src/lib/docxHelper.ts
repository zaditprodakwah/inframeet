import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

export interface DocxSowData {
  contract_id: string;
  date: string;
  client_name: string;
  company_name: string;
  project_title: string;
  segment_label: string;
  timeline_weeks: number;
  start_date: string;
  end_date: string;
  scope_items: Array<{
    line_number: number;
    category: string;
    deliverable: string;
    quantity: number;
    total_price_idr: string;
  }>;
  subtotal_idr: string;
  discount_percent: number;
  discount_amount_idr: string;
  net_amount_idr: string;
  payment_terms_label: string;
  revision_limit: number;
  revision_cost_idr: string;
  legal_clause_integrity: string;
  client_ip: string;
  client_signatory_name: string;
  company_signatory_name: string;
}

// Generates a valid zip package containing minimal WordprocessingML OpenXML elements
export function generateDocxBuffer(data: DocxSowData): Buffer {
  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

  const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:b/>
          <w:sz w:val="32"/>
          <w:color w:val="4F46E5"/>
        </w:rPr>
        <w:t>INFRAMEET - SCOPE OF WORK (SoW) &amp; KONTRAK</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:sz w:val="20"/>
          <w:color w:val="64748B"/>
        </w:rPr>
        <w:t>No. Kontrak: {contract_id} | Tanggal: {date}</w:t>
      </w:r>
    </w:p>
    <w:p/>
    
    <w:p>
      <w:r>
        <w:rPr><w:b/></w:rPr>
        <w:t>1. DATA KLIEN &amp; DETAIL PROYEK</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r><w:t>Nama Klien: {client_name}</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>Perusahaan: {company_name}</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>Judul Proyek: {project_title}</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>Segmentasi Layanan: {segment_label}</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>Estimasi Linimasa: {timeline_weeks} Minggu ({start_date} s/d {end_date})</w:t></w:r>
    </w:p>
    <w:p/>

    <w:p>
      <w:r>
        <w:rPr><w:b/></w:rPr>
        <w:t>2. RINCIAN SPESIFIKASI FITUR &amp; ANGGARAN</w:t>
      </w:r>
    </w:p>
    
    <w:tbl>
      <w:tblPr>
        <w:tblBorders>
          <w:top w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
          <w:left w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
          <w:bottom w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
          <w:right w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
          <w:insideH w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
          <w:insideV w:val="single" w:sz="4" w:space="0" w:color="CCCCCC"/>
        </w:tblBorders>
      </w:tblPr>
      <w:tr>
        <w:tc><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>#</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Kategori</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Spesifikasi Fitur / Deliverable</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Volume</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Harga (IDR)</w:t></w:r></w:p></w:tc>
      </w:tr>
      {#scope_items}
      <w:tr>
        <w:tc><w:p><w:r><w:t>{line_number}</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>{category}</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>{deliverable}</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>{quantity}</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:r><w:t>{total_price_idr}</w:t></w:r></w:p></w:tc>
      </w:tr>
      {/scope_items}
    </w:tbl>
    <w:p/>

    <w:p>
      <w:r>
        <w:rPr><w:b/></w:rPr>
        <w:t>3. RINGKASAN PEMBAYARAN &amp; TERMIN</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r><w:t>Subtotal Harga: IDR {subtotal_idr}</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>Diskon ({discount_percent}%): IDR {discount_amount_idr}</w:t></w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:rPr><w:b/></w:rPr>
        <w:t>TOTAL NET PROYEK: IDR {net_amount_idr}</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r><w:t>Termin Pembayaran: {payment_terms_label}</w:t></w:r>
    </w:p>
    <w:p/>

    <w:p>
      <w:r>
        <w:rPr><w:b/></w:rPr>
        <w:t>4. KEBIJAKAN REVISI &amp; KLAUSUL INTEGRITAS AKADEMIK</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r><w:t>• Batas Putaran Revisi: {revision_limit} Kali</w:t></w:r>
    </w:p>
    <w:p>
      <w:r><w:t>• Biaya Per Tambahan Revisi: IDR {revision_cost_idr} per revisi</w:t></w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:rPr><w:b/></w:rPr>
        <w:t>• Klausul Perlindungan &amp; Integritas:</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:t>{legal_clause_integrity}</w:t>
      </w:r>
    </w:p>
    <w:p/>

    <w:p>
      <w:r>
        <w:rPr><w:b/></w:rPr>
        <w:t>5. PERSETUJUAN &amp; SIGNATURE DATA VALIDATOR</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:r>
        <w:t>Dengan menandatangani lembaran ini secara digital melalui signature pad, Klien secara sadar menyetujui seluruh isi SOW dan siap mematuhi aturan legalitas.</w:t>
      </w:r>
    </w:p>
    <w:p/>

    <w:tbl>
      <w:tblPr>
        <w:tblBorders>
          <w:top w:val="none"/>
          <w:left w:val="none"/>
          <w:bottom w:val="none"/>
          <w:right w:val="none"/>
          <w:insideH w:val="none"/>
          <w:insideV w:val="none"/>
        </w:tblBorders>
      </w:tblPr>
      <w:tr>
        <w:tc>
          <w:p>
            <w:r>
              <w:rPr><w:b/></w:rPr>
              <w:t>PIHAK PERTAMA (KLIEN)</w:t>
            </w:r>
          </w:p>
          <w:p/>
          <w:p>
            <w:r><w:t>Tanda Tangan Elektronik Terlampir</w:t></w:r>
          </w:p>
          <w:p>
            <w:r><w:t>IP Address: {client_ip}</w:t></w:r>
          </w:p>
          <w:p>
            <w:r><w:t>Nama: {client_signatory_name}</w:t></w:r>
          </w:p>
        </w:tc>
        <w:tc>
          <w:p>
            <w:r>
              <w:rPr><w:b/></w:rPr>
              <w:t>PIHAK KEDUA (INFRAMEET)</w:t>
            </w:r>
          </w:p>
          <w:p/>
          <w:p>
            <w:r><w:t>Tanda Tangan Elektronik Terlampir</w:t></w:r>
          </w:p>
          <w:p>
            <w:r><w:t>Nama: {company_signatory_name}</w:t></w:r>
          </w:p>
        </w:tc>
      </w:tr>
    </w:tbl>

  </w:body>
</w:document>`;

  try {
    // 1. Pack basic OpenXML file nodes into the Zip container
    let zip: PizZip | null = new PizZip();
    zip.file("[Content_Types].xml", contentTypesXml);
    zip.file("_rels/.rels", relsXml);
    zip.file("word/document.xml", documentXml);

    // 2. Parse OpenXML tree nodes via docxtemplater
    let doc: Docxtemplater | null = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // 3. Render tags dynamically
    doc.render(data);

    // 4. Return as native binary node Buffer
    const out = doc.getZip().generate({
      type: "nodebuffer",
      compression: "DEFLATE",
    });

    // Clean references to prevent memory leaks in serverless edge container environments
    doc = null;
    zip = null;

    return out;
  } catch (err: any) {
    console.error("Gagal melakukan render dokumen SOW DOCX:", err);
    throw new Error(`Kesalahan Docx Templating: ${err.message}`);
  }
}
