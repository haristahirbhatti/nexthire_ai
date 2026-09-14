/**
 * NextHire.ai Document Exporter
 * Generates Microsoft Word (.doc) and PDF documents with per-template styling.
 * Template metadata is sourced from data/templates.js to drive real CSS differences.
 *
 * COMPLETE PACKAGE includes:
 * - Page 1: ATS-Optimized Resume/CV
 * - Page 2: Tailored Cover Letter
 * - Page 3: LinkedIn Profile (Headline, About, Keywords)
 * - Page 4: Indeed Profile (Headline, Summary)
 */

import { getTemplateById } from "@/data/templates";

/**
 * Resolves template metadata (accent color, font, layout) from a templateId.
 * Falls back gracefully if templateId is missing.
 */
function resolveTemplate(templateId) {
  const t = getTemplateById(templateId);

  // Map tone to best-fit font for real visual variety
  const fontMap = {
    Classic:   "Garamond, Georgia, serif",
    Modern:    "Calibri, 'Helvetica Neue', Arial, sans-serif",
    Minimal:   "'Trebuchet MS', Helvetica, Arial, sans-serif",
    Executive: "Palatino, 'Book Antiqua', Georgia, serif",
    Creative:  "Verdana, Tahoma, Geneva, sans-serif",
    Technical: "'Courier New', Courier, monospace",
  };

  return {
    accent:  t.accent,
    font:    t.font || fontMap[t.tone] || "Calibri, Arial, sans-serif",
    columns: t.columns,
    tone:    t.tone,
    name:    t.name,
  };
}

/* ─────────────────────────────────────────────────────────────────────
   SHARED PROFILE SECTIONS (used by both Word and PDF)
   ───────────────────────────────────────────────────────────────────── */

function buildLinkedInHTML(pkg, tmpl, isForWord = false) {
  const linkedin = pkg?.linkedInProfile || {};
  const name = pkg?.personalInfo?.fullName || "Candidate";
  const pageBreak = isForWord
    ? '<div class="page-break"></div>'
    : '<div style="page-break-before: always; padding-top: 20px;"></div>';

  return `
    ${pageBreak}
    <h2 style="font-size:14pt; font-weight:800; color:${tmpl.accent}; border-bottom:2px solid ${tmpl.accent}; padding-bottom:4px; margin-bottom:12px;">LinkedIn Profile — ${name}</h2>

    <div style="margin-bottom:14px;">
      <p style="font-size:9pt; font-weight:700; text-transform:uppercase; color:${tmpl.accent}; border-bottom:1px solid ${tmpl.accent}; padding-bottom:3px; margin-bottom:6px;">Headline</p>
      <p style="font-size:11pt; font-weight:600; color:#111; background:#f8f8f8; padding:8px 12px; border-radius:4px; border-left:3px solid ${tmpl.accent};">${linkedin.headline || ""}</p>
    </div>

    <div style="margin-bottom:14px;">
      <p style="font-size:9pt; font-weight:700; text-transform:uppercase; color:${tmpl.accent}; border-bottom:1px solid ${tmpl.accent}; padding-bottom:3px; margin-bottom:6px;">About Section</p>
      <p style="font-size:10pt; line-height:1.6; white-space:pre-line;">${linkedin.aboutSection || ""}</p>
    </div>

    <div style="margin-bottom:14px;">
      <p style="font-size:9pt; font-weight:700; text-transform:uppercase; color:${tmpl.accent}; border-bottom:1px solid ${tmpl.accent}; padding-bottom:3px; margin-bottom:6px;">Featured Keywords</p>
      <p style="font-size:10pt;">${(linkedin.featuredKeywords || []).map(kw =>
        `<span style="display:inline-block; background:${tmpl.accent}22; border:1px solid ${tmpl.accent}66; border-radius:3px; padding:2px 8px; font-size:9pt; font-weight:600; color:#222; margin:2px 4px 2px 0;">#${kw}</span>`
      ).join("")}</p>
    </div>

    <div style="margin-top:16px; padding:10px 14px; border:1px solid #ddd; border-radius:6px; background:#fafafa;">
      <p style="font-size:8pt; color:#888; margin:0;">💡 <strong>How to use:</strong> Copy each section above and paste it directly into your LinkedIn profile. The headline goes in your LinkedIn headline field, the About Section goes in your About field, and add the keywords to your Skills section.</p>
    </div>
  `;
}

function buildIndeedHTML(pkg, tmpl, isForWord = false) {
  const indeed = pkg?.indeedProfile || {};
  const name = pkg?.personalInfo?.fullName || "Candidate";
  const pageBreak = isForWord
    ? '<div class="page-break"></div>'
    : '<div style="page-break-before: always; padding-top: 20px;"></div>';

  return `
    ${pageBreak}
    <h2 style="font-size:14pt; font-weight:800; color:${tmpl.accent}; border-bottom:2px solid ${tmpl.accent}; padding-bottom:4px; margin-bottom:12px;">Indeed Profile — ${name}</h2>

    <div style="margin-bottom:14px;">
      <p style="font-size:9pt; font-weight:700; text-transform:uppercase; color:${tmpl.accent}; border-bottom:1px solid ${tmpl.accent}; padding-bottom:3px; margin-bottom:6px;">Profile Headline</p>
      <p style="font-size:11pt; font-weight:600; color:#111; background:#f8f8f8; padding:8px 12px; border-radius:4px; border-left:3px solid ${tmpl.accent};">${indeed.headline || pkg?.personalInfo?.targetTitle || ""}</p>
    </div>

    <div style="margin-bottom:14px;">
      <p style="font-size:9pt; font-weight:700; text-transform:uppercase; color:${tmpl.accent}; border-bottom:1px solid ${tmpl.accent}; padding-bottom:3px; margin-bottom:6px;">Professional Summary</p>
      <p style="font-size:10pt; line-height:1.6; white-space:pre-line;">${indeed.summary || pkg?.summary || ""}</p>
    </div>

    <div style="margin-top:16px; padding:10px 14px; border:1px solid #ddd; border-radius:6px; background:#fafafa;">
      <p style="font-size:8pt; color:#888; margin:0;">💡 <strong>How to use:</strong> Copy the headline into your Indeed profile headline field. Paste the Professional Summary into your Indeed profile summary section. Upload the ATS Resume (Page 1) as your Indeed resume document.</p>
    </div>
  `;
}

/* ─────────────────────────────────────────────────────────────────────
   WORD DOCUMENT EXPORT
   ───────────────────────────────────────────────────────────────────── */

export function downloadWordDocument(pkg, templateId) {
  const tmpl = resolveTemplate(templateId);

  const name     = pkg?.personalInfo?.fullName     || "Candidate";
  const title    = pkg?.personalInfo?.targetTitle  || "Professional";
  const email    = pkg?.personalInfo?.email        || "";
  const phone    = pkg?.personalInfo?.phone        || "";
  const location = pkg?.personalInfo?.location     || "";
  const summary  = pkg?.summary                   || "";
  const skills   = pkg?.skills                    || [];
  const experience = pkg?.experience              || [];
  const education  = pkg?.education               || [];
  const coverLetter = pkg?.coverLetter            || {};

  const contactLine = [location, phone, email].filter(Boolean).join(" · ");
  const isTwo = tmpl.columns === 2;

  // ── Sidebar items for 2-column layout ────────────────────────────────
  const sidebarHTML = isTwo ? `
    <td valign="top" style="width:30%; padding-right:18pt; border-right: 1.5pt solid ${tmpl.accent};">
      <p style="font-size:9pt; font-weight:bold; text-transform:uppercase; color:${tmpl.accent}; margin-bottom:4pt; border-bottom:1pt solid ${tmpl.accent}; padding-bottom:2pt;">Skills</p>
      ${skills.map(s => `<p style="font-size:9pt; margin:0 0 3pt 0; color:#222;">• ${s}</p>`).join("")}

      ${education.length ? `
      <p style="font-size:9pt; font-weight:bold; text-transform:uppercase; color:${tmpl.accent}; margin:12pt 0 4pt 0; border-bottom:1pt solid ${tmpl.accent}; padding-bottom:2pt;">Education</p>
      ${education.map(edu => `
        <p style="font-size:9pt; font-weight:bold; margin:0 0 2pt 0; color:#111;">${edu.degree}</p>
        <p style="font-size:8.5pt; font-style:italic; color:#444; margin:0 0 2pt 0;">${edu.institution}</p>
        <p style="font-size:8pt; color:#666; margin:0 0 6pt 0;">${edu.year}</p>
      `).join("")}
      ` : ""}
    </td>
    <td valign="top" style="width:70%; padding-left:12pt;">` : "";

  const sidebarCloseHTML = isTwo ? `</td>` : "";

  // ── Experience section ────────────────────────────────────────────────
  const expHTML = experience.map(exp => `
    <p style="margin:0 0 2pt 0;">
      <strong style="font-size:10.5pt; color:#111;">${exp.role}</strong>
      &mdash; <em style="color:#444;">${exp.company}</em>
      <span style="float:right; font-size:9.5pt; font-weight:bold; color:#555;">${exp.period}</span>
    </p>
    <ul style="margin:3pt 0 10pt 18pt; padding:0;">
      ${(exp.highlights || []).map(h => `<li style="margin-bottom:3pt;">${h}</li>`).join("")}
    </ul>
  `).join("");

  // ── Education for 1-column layout ────────────────────────────────────
  const eduSingleHTML = !isTwo ? `
    <h2 style="font-size:11pt; text-transform:uppercase; border-bottom:1.5pt solid ${tmpl.accent}; padding-bottom:3pt; margin-top:14pt; margin-bottom:6pt; color:${tmpl.accent}; font-weight:bold;">Education</h2>
    ${education.map(edu => `
      <p style="margin:0 0 4pt 0;"><strong>${edu.degree}</strong> &mdash; ${edu.institution} (${edu.year})</p>
    `).join("")}
  ` : "";

  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${name} - ATS Resume</title>
      <style>
        body { font-family: ${tmpl.font}; font-size: 11pt; line-height: 1.45; color: #111; margin: 1in; }
        h1 { font-size: 22pt; margin: 0 0 3pt 0; color: #111; font-weight: bold; ${tmpl.tone === "Modern" || tmpl.tone === "Minimal" ? "text-transform: uppercase;" : ""} }
        .subtitle { font-size: 12pt; color: ${tmpl.accent}; font-weight: bold; margin-bottom: 5pt; }
        .contact { font-size: 10pt; color: #555; margin-bottom: 14pt; border-bottom: 2pt solid ${tmpl.accent}; padding-bottom: 6pt; }
        h2 { font-size: 11pt; text-transform: uppercase; border-bottom: 1.5pt solid ${tmpl.accent}; padding-bottom: 2pt; margin-top: 14pt; margin-bottom: 6pt; color: ${tmpl.accent}; font-weight: bold; }
        p { margin: 0 0 6pt 0; }
        ul { margin: 3pt 0 10pt 18pt; padding: 0; }
        li { margin-bottom: 3pt; }
        .page-break { page-break-before: always; margin-top: 30pt; }
        table { width: 100%; border-collapse: collapse; }
      </style>
    </head>
    <body>
      <h1>${name}</h1>
      <div class="subtitle">${title}</div>
      <div class="contact">${contactLine}</div>

      ${isTwo ? `<table><tr>${sidebarHTML}` : ""}

      <h2>Professional Summary</h2>
      <p>${summary}</p>

      ${!isTwo ? `
      <h2>Core Competencies &amp; Skills</h2>
      <p>${skills.join(" &nbsp;•&nbsp; ")}</p>
      ` : ""}

      <h2>Professional Experience</h2>
      ${expHTML}

      ${eduSingleHTML}

      ${isTwo ? `${sidebarCloseHTML}</tr></table>` : ""}

      ${coverLetter.body ? `
        <div class="page-break"></div>
        <h1>Cover Letter</h1>
        <div class="contact">${name} | ${email}</div>
        <p style="margin-top:20pt;"><strong>${coverLetter.greeting || "Dear Hiring Manager,"}</strong></p>
        <p style="white-space: pre-line; line-height: 1.6;">${coverLetter.body}</p>
        <p style="margin-top:20pt;">${(coverLetter.signOff || "Sincerely,\n" + name).replace(/\n/g, "<br>")}</p>
      ` : ""}

      ${buildLinkedInHTML(pkg, tmpl, true)}
      ${buildIndeedHTML(pkg, tmpl, true)}
    </body>
    </html>
  `;

  const blob = new Blob(["\ufeff" + htmlContent], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name.replace(/\s+/g, "_")}_Complete_Package_${tmpl.name.replace(/\s+/g, "_")}.doc`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ─────────────────────────────────────────────────────────────────────
   PDF DOCUMENT EXPORT (iframe print)
   ───────────────────────────────────────────────────────────────────── */

export function downloadPDFDocument(pkg, templateId) {
  const tmpl = resolveTemplate(templateId);

  const name      = pkg?.personalInfo?.fullName    || "Candidate";
  const title     = pkg?.personalInfo?.targetTitle || "Professional";
  const email     = pkg?.personalInfo?.email       || "";
  const phone     = pkg?.personalInfo?.phone       || "";
  const location  = pkg?.personalInfo?.location    || "";
  const summary   = pkg?.summary                  || "";
  const skills    = pkg?.skills                   || [];
  const experience  = pkg?.experience             || [];
  const education   = pkg?.education              || [];
  const coverLetter = pkg?.coverLetter            || {};

  const contactLine = [location, phone, email].filter(Boolean).join(" · ");
  const isTwo = tmpl.columns === 2;

  // ── Experience rows ───────────────────────────────────────────────────
  const expHTML = experience.map(exp => `
    <div style="margin-bottom:10px;">
      <div style="display:flex; justify-content:space-between; align-items:baseline;">
        <span style="font-weight:700; font-size:10.5pt;">${exp.role} &mdash; <em style="font-weight:400; color:#444;">${exp.company}</em></span>
        <span style="font-size:9pt; font-weight:600; color:#555; white-space:nowrap; margin-left:8px;">${exp.period}</span>
      </div>
      <ul style="margin:4px 0 0 18px; padding:0;">
        ${(exp.highlights || []).map(h => `<li style="margin-bottom:3px;">${h}</li>`).join("")}
      </ul>
    </div>
  `).join("");

  // ── Skill tags ────────────────────────────────────────────────────────
  const skillsHTML = skills.map(s =>
    `<span style="background:${tmpl.accent}22; border:1px solid ${tmpl.accent}66; border-radius:3px; padding:2px 8px; font-size:8.5pt; font-weight:600; color:#222; display:inline-block; margin:2px 3px 2px 0;">${s}</span>`
  ).join("");

  // ── Education block ───────────────────────────────────────────────────
  const eduHTML = education.map(edu =>
    `<p style="margin:0 0 4px 0;"><strong>${edu.degree}</strong> &mdash; ${edu.institution} (${edu.year})</p>`
  ).join("");

  // ── Two-column layout uses CSS grid ──────────────────────────────────
  const bodyHTML = isTwo ? `
    <div style="display:grid; grid-template-columns:30% 70%; gap:0; margin-top:14px;">
      <!-- Sidebar -->
      <div style="padding-right:14px; border-right:2px solid ${tmpl.accent};">
        <p style="font-size:9pt; font-weight:700; text-transform:uppercase; color:${tmpl.accent}; border-bottom:1px solid ${tmpl.accent}; padding-bottom:3px; margin-bottom:6px;">Skills</p>
        ${skills.map(s => `<p style="font-size:9pt; margin:0 0 3px 0; color:#222;">• ${s}</p>`).join("")}

        ${education.length ? `
        <p style="font-size:9pt; font-weight:700; text-transform:uppercase; color:${tmpl.accent}; border-bottom:1px solid ${tmpl.accent}; padding-bottom:3px; margin:14px 0 6px 0;">Education</p>
        ${education.map(edu => `
          <p style="font-size:9pt; font-weight:700; margin:0 0 2px 0; color:#111;">${edu.degree}</p>
          <p style="font-size:8.5pt; font-style:italic; color:#444; margin:0 0 2px 0;">${edu.institution}</p>
          <p style="font-size:8pt; color:#666; margin:0 0 8px 0;">${edu.year}</p>
        `).join("")}
        ` : ""}
      </div>
      <!-- Main -->
      <div style="padding-left:14px;">
        <p style="font-size:9pt; font-weight:700; text-transform:uppercase; color:${tmpl.accent}; border-bottom:1px solid ${tmpl.accent}; padding-bottom:3px; margin-bottom:6px;">Professional Summary</p>
        <p style="font-size:10pt; margin-bottom:14px;">${summary}</p>

        <p style="font-size:9pt; font-weight:700; text-transform:uppercase; color:${tmpl.accent}; border-bottom:1px solid ${tmpl.accent}; padding-bottom:3px; margin-bottom:8px;">Experience</p>
        ${expHTML}
      </div>
    </div>
  ` : `
    <div style="margin-top:14px;">
      <p style="font-size:9pt; font-weight:700; text-transform:uppercase; color:${tmpl.accent}; border-bottom:1.5px solid ${tmpl.accent}; padding-bottom:3px; margin-bottom:6px;">Professional Summary</p>
      <p style="margin-bottom:14px;">${summary}</p>

      <p style="font-size:9pt; font-weight:700; text-transform:uppercase; color:${tmpl.accent}; border-bottom:1.5px solid ${tmpl.accent}; padding-bottom:3px; margin-bottom:8px;">Core Competencies &amp; Skills</p>
      <div style="margin-bottom:14px;">${skillsHTML}</div>

      <p style="font-size:9pt; font-weight:700; text-transform:uppercase; color:${tmpl.accent}; border-bottom:1.5px solid ${tmpl.accent}; padding-bottom:3px; margin-bottom:8px;">Professional Experience</p>
      ${expHTML}

      <p style="font-size:9pt; font-weight:700; text-transform:uppercase; color:${tmpl.accent}; border-bottom:1.5px solid ${tmpl.accent}; padding-bottom:3px; margin-bottom:8px;">Education</p>
      ${eduHTML}
    </div>
  `;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${name} - Complete Career Package</title>
      <style>
        @page { size: A4; margin: 14mm 16mm; }
        * { box-sizing: border-box; }
        body {
          font-family: ${tmpl.font};
          font-size: 10pt;
          line-height: 1.45;
          color: #111;
          margin: 0;
          padding: 16px 20px;
          background: #fff;
        }
        h1 {
          font-size: 22pt;
          margin: 0 0 3px 0;
          color: #111;
          font-weight: 800;
          ${tmpl.tone === "Modern" || tmpl.tone === "Minimal" ? "text-transform: uppercase; letter-spacing: 1px;" : ""}
        }
        .subtitle { font-size: 12pt; color: ${tmpl.accent}; font-weight: 700; margin-bottom: 4px; }
        .contact {
          font-size: 9.5pt;
          color: #555;
          border-bottom: 2.5px solid ${tmpl.accent};
          padding-bottom: 6px;
          margin-bottom: 0;
        }
        ul { margin: 4px 0 0 18px; padding: 0; }
        li { margin-bottom: 3px; font-size: 10pt; }
        p { margin: 0 0 6px 0; font-size: 10pt; }
        @media print {
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      <h1>${name}</h1>
      <div class="subtitle">${title}</div>
      <div class="contact">${contactLine}</div>

      ${bodyHTML}

      ${coverLetter.body ? `
        <div style="page-break-before: always; padding-top: 20px;">
          <h2 style="font-size:14pt; font-weight:800; color:${tmpl.accent}; border-bottom:2px solid ${tmpl.accent}; padding-bottom:4px; margin-bottom:12px;">Cover Letter</h2>
          <p><strong>${coverLetter.greeting || "Dear Hiring Manager,"}</strong></p>
          <p style="white-space: pre-line; line-height: 1.7; margin-top:10px;">${coverLetter.body}</p>
          <p style="margin-top: 24px;">${(coverLetter.signOff || "Sincerely,\n" + name).replace(/\n/g, "<br>")}</p>
        </div>
      ` : ""}

      ${buildLinkedInHTML(pkg, tmpl, false)}
      ${buildIndeedHTML(pkg, tmpl, false)}
    </body>
    </html>
  `;

  const iframe = document.createElement("iframe");
  iframe.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(htmlContent);
  doc.close();

  iframe.contentWindow.focus();
  setTimeout(() => {
    iframe.contentWindow.print();
    setTimeout(() => {
      if (document.body.contains(iframe)) document.body.removeChild(iframe);
    }, 1500);
  }, 400);
}
