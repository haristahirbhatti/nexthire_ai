/**
 * NextHire.ai Document Exporter
 * Generates Microsoft Word (.doc) and PDF documents with high-fidelity template styling.
 * Supports all 12 signature designer templates across 6 layout families:
 * - Left Sidebar (Jordan Mitchell Crimson / Tonnie Purple Boxed)
 * - Right Sidebar (Morgan Connors Soft Blue)
 * - Dark Header / Banner Split (Kai Carter Dark / Taylor Teal Card / Janna Soft Lilac)
 * - Accent Badge Executive (Jacob Hancock Red Circle)
 * - Timeline Rail (Liidia Peetre / Andree Rocher)
 * - Minimalist & Editorial ATS (Full Name ATS / Kai Warm Sand / Aneela Editorial)
 *
 * COMPLETE PACKAGE includes:
 * - Section 1: ATS-Optimized Resume/CV
 * - Section 2: Tailored Cover Letter
 * - Section 3: LinkedIn Profile Optimization
 * - Section 4: Indeed Profile Optimization
 */

import { getTemplateById } from "@/data/templates";

/**
 * Resolves template metadata from templateId with optional custom palette override.
 */
function resolveTemplate(templateId, customPalette = null) {
  const t = getTemplateById(templateId);

  const fontMap = {
    Classic: "Georgia, 'Times New Roman', serif",
    Modern: "Calibri, 'Helvetica Neue', Arial, sans-serif",
    Minimal: "'Trebuchet MS', Helvetica, Arial, sans-serif",
    Executive: "Palatino, 'Book Antiqua', Georgia, serif",
    Creative: "Verdana, Tahoma, Geneva, sans-serif",
    Technical: "'Courier New', Courier, monospace",
    Editorial: "Palatino, 'Book Antiqua', Georgia, serif",
  };

  return {
    id: t.id,
    accent: customPalette?.primary || t.accent || "#B8922A",
    sidebarBg: customPalette?.secondary || t.sidebarBg || (t.columns === 2 ? "#181e24" : null),
    font: t.font || fontMap[t.tone] || "Calibri, Arial, sans-serif",
    columns: t.columns || 1,
    headerStyle: t.headerStyle || "left",
    tone: t.tone || "Modern",
    name: t.name || "Modern Template",
    layoutFamily: t.layoutFamily || "minimal-ats",
  };
}

/**
 * Extracts candidate initials for monogram badge (e.g. "John Doe" -> "JD")
 */
function getInitials(name) {
  if (!name) return "CV";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/* ─────────────────────────────────────────────────────────────────────
   SHARED PROFILE SECTIONS (LinkedIn & Indeed)
   ───────────────────────────────────────────────────────────────────── */

function buildLinkedInHTML(pkg, tmpl, isForWord = false) {
  const linkedin = pkg?.linkedInProfile || {};
  const name = pkg?.personalInfo?.fullName || "Candidate";
  const pageBreak = isForWord
    ? '<div class="page-break"></div>'
    : '<div style="page-break-before: always; padding-top: 24px;"></div>';

  return `
    ${pageBreak}
    <div style="border-bottom:2.5pt solid ${tmpl.accent}; padding-bottom:6pt; margin-bottom:14pt;">
      <h2 style="font-size:15pt; font-weight:bold; color:${tmpl.accent}; margin:0 0 2pt 0; text-transform:uppercase;">LinkedIn Profile Optimization</h2>
      <p style="font-size:9.5pt; color:#666; margin:0;">Prepared for ${name} · Ready to copy &amp; paste into LinkedIn</p>
    </div>

    <div style="margin-bottom:14pt; background:#f9fafb; padding:12pt; border-left:3.5pt solid ${tmpl.accent}; border-radius:4px;">
      <p style="font-size:8.5pt; font-weight:bold; text-transform:uppercase; color:${tmpl.accent}; margin:0 0 4pt 0; letter-spacing:0.5px;">Optimized Headline</p>
      <p style="font-size:11pt; font-weight:bold; color:#111; margin:0; line-height:1.4;">${linkedin.headline || pkg?.personalInfo?.targetTitle || ""}</p>
    </div>

    <div style="margin-bottom:14pt; background:#ffffff; padding:12pt; border:1pt solid #e5e7eb; border-radius:4px;">
      <p style="font-size:8.5pt; font-weight:bold; text-transform:uppercase; color:${tmpl.accent}; margin:0 0 6pt 0; letter-spacing:0.5px; border-bottom:1pt solid #eee; padding-bottom:3pt;">About / Summary Section</p>
      <p style="font-size:9.5pt; line-height:1.6; color:#222; margin:0; white-space:pre-line;">${linkedin.aboutSection || pkg?.summary || ""}</p>
    </div>

    <div style="margin-bottom:14pt; background:#ffffff; padding:12pt; border:1pt solid #e5e7eb; border-radius:4px;">
      <p style="font-size:8.5pt; font-weight:bold; text-transform:uppercase; color:${tmpl.accent}; margin:0 0 6pt 0; letter-spacing:0.5px; border-bottom:1pt solid #eee; padding-bottom:3pt;">High-Ranking Search Keywords</p>
      <div style="margin-top:4pt;">
        ${(linkedin.featuredKeywords || pkg?.skills || []).map(kw =>
          `<span style="display:inline-block; background:${tmpl.accent}18; border:1pt solid ${tmpl.accent}55; border-radius:3px; padding:2pt 6pt; font-size:8.5pt; font-weight:bold; color:#111; margin:2pt 4pt 2pt 0;">#${kw}</span>`
        ).join(" ")}
      </div>
    </div>

    <div style="padding:10pt 12pt; border:1pt dashed #cbd5e1; border-radius:4px; background:#f8fafc;">
      <p style="font-size:8pt; color:#64748b; margin:0; line-height:1.4;">
        💡 <strong>How to apply:</strong> Paste the Headline into your LinkedIn headline field. Add the About section to your profile summary. Add the keywords to your Skills section to boost recruiter search ranking.
      </p>
    </div>
  `;
}

function buildIndeedHTML(pkg, tmpl, isForWord = false) {
  const indeed = pkg?.indeedProfile || {};
  const name = pkg?.personalInfo?.fullName || "Candidate";
  const pageBreak = isForWord
    ? '<div class="page-break"></div>'
    : '<div style="page-break-before: always; padding-top: 24px;"></div>';

  return `
    ${pageBreak}
    <div style="border-bottom:2.5pt solid ${tmpl.accent}; padding-bottom:6pt; margin-bottom:14pt;">
      <h2 style="font-size:15pt; font-weight:bold; color:${tmpl.accent}; margin:0 0 2pt 0; text-transform:uppercase;">Indeed Profile Optimization</h2>
      <p style="font-size:9.5pt; color:#666; margin:0;">Prepared for ${name} · Ready for Indeed Career Portal</p>
    </div>

    <div style="margin-bottom:14pt; background:#f9fafb; padding:12pt; border-left:3.5pt solid ${tmpl.accent}; border-radius:4px;">
      <p style="font-size:8.5pt; font-weight:bold; text-transform:uppercase; color:${tmpl.accent}; margin:0 0 4pt 0; letter-spacing:0.5px;">Target Job Title / Headline</p>
      <p style="font-size:11pt; font-weight:bold; color:#111; margin:0;">${indeed.headline || pkg?.personalInfo?.targetTitle || ""}</p>
    </div>

    <div style="margin-bottom:14pt; background:#ffffff; padding:12pt; border:1pt solid #e5e7eb; border-radius:4px;">
      <p style="font-size:8.5pt; font-weight:bold; text-transform:uppercase; color:${tmpl.accent}; margin:0 0 6pt 0; letter-spacing:0.5px; border-bottom:1pt solid #eee; padding-bottom:3pt;">Professional Summary for Indeed</p>
      <p style="font-size:9.5pt; line-height:1.6; color:#222; margin:0; white-space:pre-line;">${indeed.summary || pkg?.summary || ""}</p>
    </div>

    <div style="padding:10pt 12pt; border:1pt dashed #cbd5e1; border-radius:4px; background:#f8fafc;">
      <p style="font-size:8pt; color:#64748b; margin:0; line-height:1.4;">
        💡 <strong>How to apply:</strong> Copy the headline into your Indeed profile headline. Paste the summary into your Indeed summary box. Upload Section 1 as your standard CV document.
      </p>
    </div>
  `;
}

/* ─────────────────────────────────────────────────────────────────────
   WORD DOCUMENT EXPORT (.doc HTML format)
   ───────────────────────────────────────────────────────────────────── */

export function downloadWordDocument(pkg, templateId, customPalette = null) {
  const tmpl = resolveTemplate(templateId, customPalette);

  const name       = pkg?.personalInfo?.fullName    || "Candidate Name";
  const title      = pkg?.personalInfo?.targetTitle || "Professional";
  const email      = pkg?.personalInfo?.email       || "";
  const phone      = pkg?.personalInfo?.phone       || "";
  const location   = pkg?.personalInfo?.location    || "";
  const photoUrl   = pkg?.personalInfo?.photoUrl    || "";
  const summary    = pkg?.summary                  || "";
  const skills     = pkg?.skills                   || [];
  const experience = pkg?.experience               || [];
  const education  = pkg?.education                || [];
  const certs      = pkg?.certifications           || [];
  const projects   = pkg?.projects                 || [];
  const languages  = pkg?.languages                || [];
  const coverLetter = pkg?.coverLetter             || {};

  const initials = getInitials(name);
  const layout = tmpl.layoutFamily;
  const isLeftSidebar = layout === "left-sidebar" || layout === "boxed-sidebar";
  const isRightSidebar = layout === "right-sidebar";
  const isDarkHeader = layout === "dark-header-split" || layout === "header-card-split" || layout === "soft-banner";
  const isBadge = layout === "badge-executive";
  const isTimeline = layout === "timeline-rail" || layout === "clean-timeline";
  const isWarmSand = layout === "warm-sand-split";

  const sidebarBgColor = tmpl.sidebarBg || (isLeftSidebar ? tmpl.accent : "#eff6ff");
  const sidebarTextColor = (layout === "left-sidebar" || sidebarBgColor === tmpl.accent || sidebarBgColor === "#b91c1c" || sidebarBgColor === "#181e24") ? "#ffffff" : "#1e293b";

  // Avatar / Monogram block for Word
  const avatarWordHTML = photoUrl
    ? `<img src="${photoUrl}" width="55" height="55" style="border-radius:28pt; border:2pt solid ${tmpl.accent}; margin-bottom:8pt; display:block;" />`
    : `<table cellpadding="0" cellspacing="0" style="margin-bottom:8pt;"><tr><td align="center" valign="middle" style="width:40pt; height:40pt; background-color:${sidebarTextColor === '#ffffff' ? '#ffffff' : tmpl.accent}; border-radius:20pt; color:${sidebarTextColor === '#ffffff' ? tmpl.accent : '#ffffff'}; font-size:15pt; font-weight:bold; font-family:${tmpl.font}; text-align:center;">${initials}</td></tr></table>`;

  // Contact items for Word
  const contactLines = [
    phone ? `📱 ${phone}` : "",
    email ? `✉️ ${email}` : "",
    location ? `📍 ${location}` : "",
  ].filter(Boolean);

  // ── Experience section for Word ──────────────────────────────────────
  const expWordHTML = experience.map(exp => `
    <div style="margin-bottom:12pt;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td valign="top" style="text-align:left;">
            <strong style="font-size:10.5pt; color:#0f172a;">${exp.role}</strong>
            <span style="font-size:9.5pt; color:${tmpl.accent}; font-weight:bold;"> &mdash; ${exp.company}</span>
            ${exp.location ? `<span style="font-size:8.5pt; color:#64748b;"> &bull; ${exp.location}</span>` : ""}
          </td>
          <td valign="top" align="right" style="text-align:right; font-size:8.5pt; font-weight:bold; color:#64748b; white-space:nowrap;">
            ${exp.period}
          </td>
        </tr>
      </table>
      <ul style="margin:4pt 0 6pt 16pt; padding:0;">
        ${(exp.highlights || []).map(h => `<li style="font-size:9pt; color:#334155; margin-bottom:3pt; line-height:1.35;">${h}</li>`).join("")}
      </ul>
    </div>
  `).join("");

  // ── Projects section for Word ──────────────────────────────────────
  const projectsWordHTML = projects.length ? `
    <h2 style="font-size:10.5pt; text-transform:uppercase; border-bottom:1.5pt solid ${tmpl.accent}; padding-bottom:2pt; margin-top:12pt; margin-bottom:6pt; color:${tmpl.accent}; font-weight:bold; letter-spacing:0.5px;">Key Projects &amp; Technical Highlights</h2>
    ${projects.map(p => `
      <div style="margin-bottom:8pt;">
        <strong style="font-size:9.5pt; color:#0f172a;">${p.name}</strong>
        ${p.period ? `<span style="font-size:8pt; color:#64748b;"> &bull; ${p.period}</span>` : ""}
        <p style="font-size:9pt; color:#334155; margin:2pt 0 4pt 0; line-height:1.35;">${p.description}</p>
      </div>
    `).join("")}
  ` : "";

  // ── Left Sidebar Body for Word ───────────────────────────────────────
  let bodyWordHTML = "";

  if (isLeftSidebar) {
    bodyWordHTML = `
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <!-- Left Sidebar -->
          <td valign="top" style="width:33%; background-color:${sidebarBgColor}; padding:18pt 14pt; color:${sidebarTextColor}; border-radius:4pt;">
            ${avatarWordHTML}
            <p style="font-size:14pt; font-weight:bold; color:${sidebarTextColor}; margin:0 0 2pt 0; line-height:1.2;">${name}</p>
            <p style="font-size:9.5pt; font-weight:bold; color:${sidebarTextColor === '#ffffff' ? 'rgba(255,255,255,0.9)' : tmpl.accent}; margin:0 0 14pt 0;">${title}</p>

            <p style="font-size:8.5pt; font-weight:bold; text-transform:uppercase; color:${sidebarTextColor === '#ffffff' ? '#ffffff' : tmpl.accent}; margin:0 0 6pt 0; border-bottom:1pt solid ${sidebarTextColor === '#ffffff' ? 'rgba(255,255,255,0.4)' : tmpl.accent}; padding-bottom:2pt; letter-spacing:0.5px;">Contact</p>
            ${contactLines.map(c => `<p style="font-size:8pt; color:${sidebarTextColor}; margin:0 0 4pt 0; line-height:1.3;">${c}</p>`).join("")}

            <p style="font-size:8.5pt; font-weight:bold; text-transform:uppercase; color:${sidebarTextColor === '#ffffff' ? '#ffffff' : tmpl.accent}; margin:14pt 0 6pt 0; border-bottom:1pt solid ${sidebarTextColor === '#ffffff' ? 'rgba(255,255,255,0.4)' : tmpl.accent}; padding-bottom:2pt; letter-spacing:0.5px;">Core Skills</p>
            ${skills.map(s => `<p style="font-size:8pt; color:${sidebarTextColor}; margin:0 0 3pt 0;">▪ ${s}</p>`).join("")}

            ${education.length ? `
            <p style="font-size:8.5pt; font-weight:bold; text-transform:uppercase; color:${sidebarTextColor === '#ffffff' ? '#ffffff' : tmpl.accent}; margin:14pt 0 6pt 0; border-bottom:1pt solid ${sidebarTextColor === '#ffffff' ? 'rgba(255,255,255,0.4)' : tmpl.accent}; padding-bottom:2pt; letter-spacing:0.5px;">Education</p>
            ${education.map(edu => `
              <div style="margin-bottom:6pt;">
                <p style="font-size:8.5pt; font-weight:bold; color:${sidebarTextColor}; margin:0 0 1pt 0;">${edu.degree}</p>
                <p style="font-size:7.5pt; color:${sidebarTextColor === '#ffffff' ? '#cbd5e1' : '#64748b'}; margin:0;">${edu.institution} &bull; ${edu.year}</p>
              </div>
            `).join("")}
            ` : ""}

            ${certs.length ? `
            <p style="font-size:8.5pt; font-weight:bold; text-transform:uppercase; color:${sidebarTextColor === '#ffffff' ? '#ffffff' : tmpl.accent}; margin:14pt 0 6pt 0; border-bottom:1pt solid ${sidebarTextColor === '#ffffff' ? 'rgba(255,255,255,0.4)' : tmpl.accent}; padding-bottom:2pt; letter-spacing:0.5px;">Certifications</p>
            ${certs.map(c => `<p style="font-size:8pt; color:${sidebarTextColor}; margin:0 0 3pt 0;">🏆 <strong>${c.name}</strong></p>`).join("")}
            ` : ""}

            ${languages.length ? `
            <p style="font-size:8.5pt; font-weight:bold; text-transform:uppercase; color:${sidebarTextColor === '#ffffff' ? '#ffffff' : tmpl.accent}; margin:14pt 0 6pt 0; border-bottom:1pt solid ${sidebarTextColor === '#ffffff' ? 'rgba(255,255,255,0.4)' : tmpl.accent}; padding-bottom:2pt; letter-spacing:0.5px;">Languages</p>
            ${languages.map(l => `<p style="font-size:8pt; color:${sidebarTextColor}; margin:0 0 3pt 0;">🌐 ${l.language} ${l.proficiency ? `(${l.proficiency})` : ""}</p>`).join("")}
            ` : ""}
          </td>

          <!-- Main Content -->
          <td valign="top" style="width:67%; padding:10pt 0 10pt 18pt;">
            <h2 style="font-size:10.5pt; text-transform:uppercase; border-bottom:1.5pt solid ${tmpl.accent}; padding-bottom:2pt; margin-top:0; margin-bottom:6pt; color:${tmpl.accent}; font-weight:bold; letter-spacing:0.5px;">Executive Summary</h2>
            <p style="line-height:1.45; color:#334155; margin-bottom:14pt;">${summary}</p>

            <h2 style="font-size:10.5pt; text-transform:uppercase; border-bottom:1.5pt solid ${tmpl.accent}; padding-bottom:2pt; margin-top:12pt; margin-bottom:8pt; color:${tmpl.accent}; font-weight:bold; letter-spacing:0.5px;">Professional Experience</h2>
            ${expWordHTML}

            ${projectsWordHTML}
          </td>
        </tr>
      </table>
    `;
  } else if (isRightSidebar) {
    // ── Right Sidebar Layout ─────────────────────────────────────────
    bodyWordHTML = `
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <!-- Left Main Content -->
          <td valign="top" style="width:67%; padding:8pt 18pt 8pt 0;">
            <h1 style="font-size:22pt; margin:0 0 2pt 0; color:#0f172a; font-weight:bold;">${name}</h1>
            <div style="font-size:11pt; color:${tmpl.accent}; font-weight:bold; margin-bottom:14pt;">${title}</div>

            <h2 style="font-size:10.5pt; text-transform:uppercase; border-bottom:1.5pt solid ${tmpl.accent}; padding-bottom:2pt; margin-top:0; margin-bottom:6pt; color:${tmpl.accent}; font-weight:bold; letter-spacing:0.5px;">Professional Summary</h2>
            <p style="line-height:1.45; color:#334155; margin-bottom:14pt;">${summary}</p>

            <h2 style="font-size:10.5pt; text-transform:uppercase; border-bottom:1.5pt solid ${tmpl.accent}; padding-bottom:2pt; margin-top:12pt; margin-bottom:8pt; color:${tmpl.accent}; font-weight:bold; letter-spacing:0.5px;">Experience</h2>
            ${expWordHTML}

            ${projectsWordHTML}
          </td>

          <!-- Right Sidebar -->
          <td valign="top" style="width:33%; background-color:${sidebarBgColor}; padding:18pt 14pt; border-left:1.5pt solid #dbeafe;">
            ${avatarWordHTML}
            <p style="font-size:8.5pt; font-weight:bold; text-transform:uppercase; color:${tmpl.accent}; margin:0 0 6pt 0; border-bottom:1pt solid #cbd5e1; padding-bottom:2pt; letter-spacing:0.5px;">Contact</p>
            ${contactLines.map(c => `<p style="font-size:8pt; color:#334155; margin:0 0 4pt 0; line-height:1.3;">${c}</p>`).join("")}

            <p style="font-size:8.5pt; font-weight:bold; text-transform:uppercase; color:${tmpl.accent}; margin:14pt 0 6pt 0; border-bottom:1pt solid #cbd5e1; padding-bottom:2pt; letter-spacing:0.5px;">Key Skills</p>
            ${skills.map(s => `<p style="font-size:8pt; color:#334155; margin:0 0 3pt 0;">▪ ${s}</p>`).join("")}

            ${education.length ? `
            <p style="font-size:8.5pt; font-weight:bold; text-transform:uppercase; color:${tmpl.accent}; margin:14pt 0 6pt 0; border-bottom:1pt solid #cbd5e1; padding-bottom:2pt; letter-spacing:0.5px;">Education</p>
            ${education.map(edu => `
              <div style="margin-bottom:6pt;">
                <p style="font-size:8.5pt; font-weight:bold; color:#0f172a; margin:0 0 1pt 0;">${edu.degree}</p>
                <p style="font-size:7.5pt; color:#64748b; margin:0;">${edu.institution} &bull; ${edu.year}</p>
              </div>
            `).join("")}
            ` : ""}

            ${certs.length ? `
            <p style="font-size:8.5pt; font-weight:bold; text-transform:uppercase; color:${tmpl.accent}; margin:14pt 0 6pt 0; border-bottom:1pt solid #cbd5e1; padding-bottom:2pt; letter-spacing:0.5px;">Certifications</p>
            ${certs.map(c => `<p style="font-size:8pt; color:#334155; margin:0 0 3pt 0;">🏆 <strong>${c.name}</strong></p>`).join("")}
            ` : ""}
          </td>
        </tr>
      </table>
    `;
  } else if (isDarkHeader) {
    // ── Dark / Color Header Banner Layout ────────────────────────────
    const headerBg = layout === "dark-header-split" ? "#18181b" : (layout === "header-card-split" ? "#0d9488" : "#8b5cf6");
    const headerText = "#ffffff";

    bodyWordHTML = `
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${headerBg}; color:${headerText}; padding:16pt 18pt; margin-bottom:14pt; border-radius:4pt;">
        <tr>
          <td valign="middle">
            <h1 style="font-size:22pt; margin:0 0 2pt 0; color:#ffffff; font-weight:bold; letter-spacing:0.5px;">${name}</h1>
            <div style="font-size:11pt; color:rgba(255,255,255,0.9); font-weight:bold; margin-bottom:4pt;">${title}</div>
            <div style="font-size:8.5pt; color:rgba(255,255,255,0.8);">${[location, phone, email].filter(Boolean).join(" &nbsp;&bull;&nbsp; ")}</div>
          </td>
          ${photoUrl ? `<td align="right" valign="middle">${avatarWordHTML}</td>` : ""}
        </tr>
      </table>

      <h2 style="font-size:10.5pt; text-transform:uppercase; border-bottom:1.5pt solid ${tmpl.accent}; padding-bottom:2pt; margin-top:10pt; margin-bottom:6pt; color:${tmpl.accent}; font-weight:bold; letter-spacing:0.5px;">Profile Summary</h2>
      <p style="line-height:1.45; color:#334155; margin-bottom:12pt;">${summary}</p>

      <h2 style="font-size:10.5pt; text-transform:uppercase; border-bottom:1.5pt solid ${tmpl.accent}; padding-bottom:2pt; margin-top:10pt; margin-bottom:6pt; color:${tmpl.accent}; font-weight:bold; letter-spacing:0.5px;">Skills &amp; Expertise</h2>
      <p style="margin-bottom:12pt; line-height:1.6;">${skills.map(s => `<strong>&bull;</strong> ${s}`).join(" &nbsp;&nbsp; ")}</p>

      <h2 style="font-size:10.5pt; text-transform:uppercase; border-bottom:1.5pt solid ${tmpl.accent}; padding-bottom:2pt; margin-top:10pt; margin-bottom:6pt; color:${tmpl.accent}; font-weight:bold; letter-spacing:0.5px;">Professional Experience</h2>
      ${expWordHTML}

      ${projectsWordHTML}

      ${education.length ? `
      <h2 style="font-size:10.5pt; text-transform:uppercase; border-bottom:1.5pt solid ${tmpl.accent}; padding-bottom:2pt; margin-top:10pt; margin-bottom:6pt; color:${tmpl.accent}; font-weight:bold; letter-spacing:0.5px;">Education</h2>
      ${education.map(edu => `<p style="margin:0 0 3pt 0;"><strong style="color:#0f172a;">${edu.degree}</strong> &mdash; ${edu.institution} (${edu.year})</p>`).join("")}
      ` : ""}
    `;
  } else if (isBadge) {
    // ── Jacob Hancock Badge Executive Layout ──────────────────────────
    bodyWordHTML = `
      <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:2.5pt solid ${tmpl.accent}; padding-bottom:10pt; margin-bottom:14pt;">
        <tr>
          <td valign="middle" style="width:24pt;">
            <div style="width:16pt; height:16pt; background-color:${tmpl.accent}; border-radius:8pt;"></div>
          </td>
          <td valign="middle" style="padding-left:8pt;">
            <h1 style="font-size:22pt; margin:0; color:#0f172a; font-weight:bold; text-transform:uppercase; letter-spacing:0.5px;">${name}</h1>
            <div style="font-size:10.5pt; color:${tmpl.accent}; font-weight:bold;">${title} &nbsp;&bull;&nbsp; ${location} &nbsp;&bull;&nbsp; ${email}</div>
          </td>
        </tr>
      </table>

      <h2 style="font-size:10.5pt; text-transform:uppercase; border-bottom:1.5pt solid ${tmpl.accent}; padding-bottom:2pt; margin-top:10pt; margin-bottom:6pt; color:${tmpl.accent}; font-weight:bold; letter-spacing:0.5px;">Objective &amp; Executive Summary</h2>
      <p style="line-height:1.45; color:#334155; margin-bottom:12pt;">${summary}</p>

      <h2 style="font-size:10.5pt; text-transform:uppercase; border-bottom:1.5pt solid ${tmpl.accent}; padding-bottom:2pt; margin-top:10pt; margin-bottom:6pt; color:${tmpl.accent}; font-weight:bold; letter-spacing:0.5px;">Professional Experience</h2>
      ${expWordHTML}

      ${projectsWordHTML}

      <h2 style="font-size:10.5pt; text-transform:uppercase; border-bottom:1.5pt solid ${tmpl.accent}; padding-bottom:2pt; margin-top:10pt; margin-bottom:6pt; color:${tmpl.accent}; font-weight:bold; letter-spacing:0.5px;">Core Skills</h2>
      <p style="margin-bottom:12pt; line-height:1.6;">${skills.map(s => `<strong>&bull;</strong> ${s}`).join(" &nbsp;&nbsp; ")}</p>

      ${education.length ? `
      <h2 style="font-size:10.5pt; text-transform:uppercase; border-bottom:1.5pt solid ${tmpl.accent}; padding-bottom:2pt; margin-top:10pt; margin-bottom:6pt; color:${tmpl.accent}; font-weight:bold; letter-spacing:0.5px;">Education</h2>
      ${education.map(edu => `<p style="margin:0 0 3pt 0;"><strong style="color:#0f172a;">${edu.degree}</strong> &mdash; ${edu.institution} (${edu.year})</p>`).join("")}
      ` : ""}
    `;
  } else {
    // ── Minimalist ATS / Editorial / Timeline Layout ───────────────────
    const isCentered = tmpl.headerStyle === "centered";
    bodyWordHTML = `
      <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:2.5pt solid ${tmpl.accent}; padding-bottom:8pt; margin-bottom:12pt;">
        <tr>
          <td valign="middle" style="${isCentered ? "text-align:center;" : ""}">
            ${!isCentered && photoUrl ? `<div style="float:left; margin-right:12pt;">${avatarWordHTML}</div>` : ""}
            <h1 style="font-size:22pt; margin:0 0 2pt 0; color:#0f172a; font-weight:bold; ${tmpl.tone === 'Modern' ? 'text-transform:uppercase; letter-spacing:1px;' : ''}">${name}</h1>
            <div style="font-size:12pt; color:${tmpl.accent}; font-weight:bold; margin-bottom:4pt;">${title}</div>
            <div style="font-size:9pt; color:#64748b;">${[location, phone, email].filter(Boolean).join(" &nbsp;&bull;&nbsp; ")}</div>
          </td>
        </tr>
      </table>

      <h2 style="font-size:10.5pt; text-transform:uppercase; border-bottom:1.5pt solid ${tmpl.accent}; padding-bottom:2pt; margin-top:10pt; margin-bottom:6pt; color:${tmpl.accent}; font-weight:bold; letter-spacing:0.5px;">Executive Summary</h2>
      <p style="line-height:1.45; color:#334155; margin-bottom:12pt;">${summary}</p>

      <h2 style="font-size:10.5pt; text-transform:uppercase; border-bottom:1.5pt solid ${tmpl.accent}; padding-bottom:2pt; margin-top:10pt; margin-bottom:6pt; color:${tmpl.accent}; font-weight:bold; letter-spacing:0.5px;">Core Competencies &amp; Key Skills</h2>
      <p style="margin-bottom:12pt; line-height:1.6;">${skills.map(s => `<strong>&bull;</strong> ${s}`).join(" &nbsp;&nbsp; ")}</p>

      <h2 style="font-size:10.5pt; text-transform:uppercase; border-bottom:1.5pt solid ${tmpl.accent}; padding-bottom:2pt; margin-top:10pt; margin-bottom:6pt; color:${tmpl.accent}; font-weight:bold; letter-spacing:0.5px;">Professional Experience</h2>
      ${expWordHTML}

      ${projectsWordHTML}

      ${education.length ? `
      <h2 style="font-size:10.5pt; text-transform:uppercase; border-bottom:1.5pt solid ${tmpl.accent}; padding-bottom:2pt; margin-top:10pt; margin-bottom:6pt; color:${tmpl.accent}; font-weight:bold; letter-spacing:0.5px;">Education &amp; Credentials</h2>
      ${education.map(edu => `<p style="margin:0 0 3pt 0;"><strong style="color:#0f172a;">${edu.degree}</strong> &mdash; ${edu.institution} (${edu.year})</p>`).join("")}
      ` : ""}

      ${certs.length ? `
      <h2 style="font-size:10.5pt; text-transform:uppercase; border-bottom:1.5pt solid ${tmpl.accent}; padding-bottom:2pt; margin-top:10pt; margin-bottom:6pt; color:${tmpl.accent}; font-weight:bold; letter-spacing:0.5px;">Certifications</h2>
      ${certs.map(c => `<p style="margin:0 0 3pt 0;">🏆 <strong style="color:#0f172a;">${c.name}</strong>${c.issuer ? ` &mdash; ${c.issuer}` : ""}</p>`).join("")}
      ` : ""}

      ${languages.length ? `
      <h2 style="font-size:10.5pt; text-transform:uppercase; border-bottom:1.5pt solid ${tmpl.accent}; padding-bottom:2pt; margin-top:10pt; margin-bottom:6pt; color:${tmpl.accent}; font-weight:bold; letter-spacing:0.5px;">Languages</h2>
      <p style="margin-bottom:10pt;">${languages.map(l => `<strong>${l.language}</strong>${l.proficiency ? ` (${l.proficiency})` : ""}`).join(" &nbsp;&bull;&nbsp; ")}</p>
      ` : ""}
    `;
  }

  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${name} - Professional CV Package</title>
      <style>
        body { font-family: ${tmpl.font}; font-size: 10pt; line-height: 1.4; color: #1e293b; margin: 0.8in; background: ${isWarmSand ? '#f8f3ed' : '#ffffff'}; }
        h1 { font-size: 20pt; margin: 0; color: #0f172a; font-weight: bold; }
        p { margin: 0 0 5pt 0; font-size: 9.5pt; }
        ul { margin: 3pt 0 8pt 16pt; padding: 0; }
        li { margin-bottom: 2.5pt; font-size: 9pt; }
        .page-break { page-break-before: always; margin-top: 24pt; }
        table { width: 100%; border-collapse: collapse; }
      </style>
    </head>
    <body>
      ${bodyWordHTML}

      ${coverLetter.body ? `
        <div class="page-break"></div>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-bottom:2pt solid ${tmpl.accent}; padding-bottom:6pt; margin-bottom:16pt;">
          <tr>
            <td>
              <h1 style="font-size:18pt; margin:0 0 2pt 0; color:#0f172a; font-weight:bold;">Cover Letter</h1>
              <p style="font-size:9pt; color:#64748b; margin:0;">${name} &bull; ${title} &bull; ${email}</p>
            </td>
          </tr>
        </table>
        <p style="margin-top:14pt;"><strong>${coverLetter.greeting || "Dear Hiring Manager,"}</strong></p>
        <p style="white-space: pre-line; line-height: 1.6; color:#334155; margin-top:10pt;">${coverLetter.body}</p>
        <p style="margin-top:20pt; font-weight:bold; color:#0f172a;">${(coverLetter.signOff || "Sincerely,\n" + name).replace(/\n/g, "<br>")}</p>
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
  a.download = `${name.replace(/\s+/g, "_")}_CV_Package_${tmpl.name.replace(/\s+/g, "_")}.doc`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ─────────────────────────────────────────────────────────────────────
   PDF DOCUMENT EXPORT (Browser print dialog / Save as PDF)
   ───────────────────────────────────────────────────────────────────── */

export function downloadPDFDocument(pkg, templateId, customPalette = null) {
  const tmpl = resolveTemplate(templateId, customPalette);

  const name        = pkg?.personalInfo?.fullName    || "Candidate Name";
  const title       = pkg?.personalInfo?.targetTitle || "Professional";
  const email       = pkg?.personalInfo?.email       || "";
  const phone       = pkg?.personalInfo?.phone       || "";
  const location    = pkg?.personalInfo?.location    || "";
  const photoUrl    = pkg?.personalInfo?.photoUrl    || "";
  const summary     = pkg?.summary                  || "";
  const skills      = pkg?.skills                   || [];
  const experience  = pkg?.experience               || [];
  const education   = pkg?.education                || [];
  const certs       = pkg?.certifications           || [];
  const projects    = pkg?.projects                 || [];
  const languages   = pkg?.languages                || [];
  const coverLetter = pkg?.coverLetter              || {};

  const initials = getInitials(name);
  const layout = tmpl.layoutFamily;
  const isLeftSidebar = layout === "left-sidebar" || layout === "boxed-sidebar";
  const isRightSidebar = layout === "right-sidebar";
  const isDarkHeader = layout === "dark-header-split" || layout === "header-card-split" || layout === "soft-banner";
  const isBadge = layout === "badge-executive";
  const isWarmSand = layout === "warm-sand-split";

  const sidebarBgColor = tmpl.sidebarBg || (isLeftSidebar ? tmpl.accent : "#eff6ff");
  const sidebarTextColor = (layout === "left-sidebar" || sidebarBgColor === tmpl.accent || sidebarBgColor === "#b91c1c" || sidebarBgColor === "#181e24") ? "#ffffff" : "#1e293b";

  // Avatar / Monogram for PDF
  const avatarPDFHTML = photoUrl
    ? `<img src="${photoUrl}" style="width:68px; height:68px; border-radius:50%; object-fit:cover; border:2.5px solid ${tmpl.accent}; display:block; margin-bottom:12px;" />`
    : `<div style="width:52px; height:52px; border-radius:50%; background:${sidebarTextColor === '#ffffff' ? '#ffffff' : tmpl.accent}; color:${sidebarTextColor === '#ffffff' ? tmpl.accent : '#ffffff'}; font-size:16pt; font-weight:bold; font-family:${tmpl.font}; display:flex; align-items:center; justify-content:center; margin-bottom:12px; box-shadow:0 2px 8px rgba(0,0,0,0.15);">${initials}</div>`;

  // Contact items for PDF
  const contactLines = [
    phone ? `<span>📞 ${phone}</span>` : "",
    email ? `<span>✉️ ${email}</span>` : "",
    location ? `<span>📍 ${location}</span>` : "",
  ].filter(Boolean);

  // ── Experience block for PDF ──────────────────────────────────────────
  const expPDFHTML = experience.map(exp => `
    <div style="margin-bottom:12px; page-break-inside:avoid;">
      <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:3px;">
        <span style="font-weight:700; font-size:10.5pt; color:#0f172a;">${exp.role} <span style="color:${tmpl.accent}; font-weight:600;">&mdash; ${exp.company}</span></span>
        <span style="font-size:8.5pt; font-weight:700; color:#64748b; background:#f1f5f9; padding:2px 8px; border-radius:4px; white-space:nowrap; margin-left:8px;">${exp.period}</span>
      </div>
      <ul style="margin:4px 0 0 16px; padding:0;">
        ${(exp.highlights || []).map(h => `<li style="margin-bottom:3px; color:#334155; font-size:9pt; line-height:1.4;">${h}</li>`).join("")}
      </ul>
    </div>
  `).join("");

  // ── Projects block for PDF ──────────────────────────────────────────
  const projectsPDFHTML = projects.length ? `
    <div style="font-size:9.5pt; font-weight:800; text-transform:uppercase; color:${tmpl.accent}; border-bottom:1.5px solid ${tmpl.accent}; padding-bottom:3px; margin:14px 0 8px 0; letter-spacing:0.5px;">Key Projects &amp; Initiatives</div>
    ${projects.map(p => `
      <div style="margin-bottom:8px; page-break-inside:avoid;">
        <div style="display:flex; justify-content:space-between; font-size:9.5pt;">
          <strong style="color:#0f172a;">${p.name}</strong>
          ${p.period ? `<span style="font-size:8pt; color:#64748b;">${p.period}</span>` : ""}
        </div>
        <p style="font-size:9pt; color:#334155; margin:2px 0 0 0; line-height:1.35;">${p.description}</p>
      </div>
    `).join("")}
  ` : "";

  let pdfMainBodyHTML = "";

  if (isLeftSidebar) {
    pdfMainBodyHTML = `
      <div style="display:grid; grid-template-columns:32% 68%; min-height:850px; background:#fff; border-radius:6px; overflow:hidden;">
        <!-- Left Sidebar -->
        <div style="background:${sidebarBgColor}; padding:24px 18px; color:${sidebarTextColor};">
          ${avatarPDFHTML}
          <h1 style="font-size:17pt; font-weight:800; color:${sidebarTextColor}; margin:0 0 4px 0; line-height:1.2;">${name}</h1>
          <div style="font-size:9.5pt; font-weight:700; color:${sidebarTextColor === '#ffffff' ? 'rgba(255,255,255,0.9)' : tmpl.accent}; margin-bottom:18px;">${title}</div>

          <div style="font-size:8pt; font-weight:800; text-transform:uppercase; color:${sidebarTextColor === '#ffffff' ? '#fff' : tmpl.accent}; border-bottom:1.5px solid ${sidebarTextColor === '#ffffff' ? 'rgba(255,255,255,0.4)' : tmpl.accent}; padding-bottom:3px; margin-bottom:8px; letter-spacing:0.8px;">Contact</div>
          <div style="display:flex; flex-direction:column; gap:6px; font-size:8.5pt; color:${sidebarTextColor}; margin-bottom:20px; line-height:1.3;">
            ${contactLines.join("")}
          </div>

          <div style="font-size:8pt; font-weight:800; text-transform:uppercase; color:${sidebarTextColor === '#ffffff' ? '#fff' : tmpl.accent}; border-bottom:1.5px solid ${sidebarTextColor === '#ffffff' ? 'rgba(255,255,255,0.4)' : tmpl.accent}; padding-bottom:3px; margin-bottom:8px; letter-spacing:0.8px;">Skills &amp; Expertise</div>
          <div style="display:flex; flex-wrap:wrap; gap:4px; margin-bottom:20px;">
            ${skills.map(s => `<span style="background:${sidebarTextColor === '#ffffff' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.06)'}; border:1px solid ${sidebarTextColor === '#ffffff' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}; border-radius:3px; padding:3px 7px; font-size:8pt; color:${sidebarTextColor};">${s}</span>`).join("")}
          </div>

          ${education.length ? `
          <div style="font-size:8pt; font-weight:800; text-transform:uppercase; color:${sidebarTextColor === '#ffffff' ? '#fff' : tmpl.accent}; border-bottom:1.5px solid ${sidebarTextColor === '#ffffff' ? 'rgba(255,255,255,0.4)' : tmpl.accent}; padding-bottom:3px; margin-bottom:8px; letter-spacing:0.8px;">Education</div>
          <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px;">
            ${education.map(edu => `
              <div>
                <div style="font-size:8.5pt; font-weight:700; color:${sidebarTextColor};">${edu.degree}</div>
                <div style="font-size:7.5pt; color:${sidebarTextColor === '#ffffff' ? '#cbd5e1' : '#64748b'};">${edu.institution} &bull; ${edu.year}</div>
              </div>
            `).join("")}
          </div>
          ` : ""}

          ${certs.length ? `
          <div style="font-size:8pt; font-weight:800; text-transform:uppercase; color:${sidebarTextColor === '#ffffff' ? '#fff' : tmpl.accent}; border-bottom:1.5px solid ${sidebarTextColor === '#ffffff' ? 'rgba(255,255,255,0.4)' : tmpl.accent}; padding-bottom:3px; margin-bottom:8px; letter-spacing:0.8px;">Certifications</div>
          <div style="display:flex; flex-direction:column; gap:6px; margin-bottom:16px;">
            ${certs.map(c => `<div style="font-size:8pt; color:${sidebarTextColor};">🏆 <strong>${c.name}</strong></div>`).join("")}
          </div>
          ` : ""}
        </div>

        <!-- Main Column -->
        <div style="padding:20px 24px 20px 24px;">
          <div style="font-size:9pt; font-weight:800; text-transform:uppercase; color:${tmpl.accent}; border-bottom:2px solid ${tmpl.accent}; padding-bottom:4px; margin-bottom:8px; letter-spacing:0.5px;">Executive Summary</div>
          <p style="font-size:9.5pt; color:#334155; line-height:1.5; margin-bottom:18px;">${summary}</p>

          <div style="font-size:9pt; font-weight:800; text-transform:uppercase; color:${tmpl.accent}; border-bottom:2px solid ${tmpl.accent}; padding-bottom:4px; margin-bottom:12px; letter-spacing:0.5px;">Professional Experience</div>
          ${expPDFHTML}

          ${projectsPDFHTML}
        </div>
      </div>
    `;
  } else if (isRightSidebar) {
    pdfMainBodyHTML = `
      <div style="display:grid; grid-template-columns:68% 32%; min-height:850px; background:#fff; border-radius:6px; overflow:hidden;">
        <!-- Main Column -->
        <div style="padding:20px 24px 20px 24px;">
          <h1 style="font-size:22pt; font-weight:800; color:#0f172a; margin:0 0 4px 0;">${name}</h1>
          <div style="font-size:11pt; font-weight:700; color:${tmpl.accent}; margin-bottom:16px;">${title}</div>

          <div style="font-size:9pt; font-weight:800; text-transform:uppercase; color:${tmpl.accent}; border-bottom:2px solid ${tmpl.accent}; padding-bottom:4px; margin-bottom:8px; letter-spacing:0.5px;">Executive Summary</div>
          <p style="font-size:9.5pt; color:#334155; line-height:1.5; margin-bottom:18px;">${summary}</p>

          <div style="font-size:9pt; font-weight:800; text-transform:uppercase; color:${tmpl.accent}; border-bottom:2px solid ${tmpl.accent}; padding-bottom:4px; margin-bottom:12px; letter-spacing:0.5px;">Professional Experience</div>
          ${expPDFHTML}

          ${projectsPDFHTML}
        </div>

        <!-- Right Sidebar -->
        <div style="background:${sidebarBgColor}; padding:24px 18px; border-left:1px solid #dbeafe;">
          ${avatarPDFHTML}
          <div style="font-size:8pt; font-weight:800; text-transform:uppercase; color:${tmpl.accent}; border-bottom:1.5px solid #cbd5e1; padding-bottom:3px; margin-bottom:8px; letter-spacing:0.8px;">Contact</div>
          <div style="display:flex; flex-direction:column; gap:6px; font-size:8.5pt; color:#334155; margin-bottom:20px; line-height:1.3;">
            ${contactLines.join("")}
          </div>

          <div style="font-size:8pt; font-weight:800; text-transform:uppercase; color:${tmpl.accent}; border-bottom:1.5px solid #cbd5e1; padding-bottom:3px; margin-bottom:8px; letter-spacing:0.8px;">Skills &amp; Expertise</div>
          <div style="display:flex; flex-wrap:wrap; gap:4px; margin-bottom:20px;">
            ${skills.map(s => `<span style="background:rgba(37,99,235,0.08); border:1px solid rgba(37,99,235,0.2); border-radius:3px; padding:3px 7px; font-size:8pt; color:#1e3a8a;">${s}</span>`).join("")}
          </div>

          ${education.length ? `
          <div style="font-size:8pt; font-weight:800; text-transform:uppercase; color:${tmpl.accent}; border-bottom:1.5px solid #cbd5e1; padding-bottom:3px; margin-bottom:8px; letter-spacing:0.8px;">Education</div>
          <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:16px;">
            ${education.map(edu => `
              <div>
                <div style="font-size:8.5pt; font-weight:700; color:#0f172a;">${edu.degree}</div>
                <div style="font-size:7.5pt; color:#64748b;">${edu.institution} &bull; ${edu.year}</div>
              </div>
            `).join("")}
          </div>
          ` : ""}
        </div>
      </div>
    `;
  } else if (isDarkHeader) {
    const headerBg = layout === "dark-header-split" ? "#18181b" : (layout === "header-card-split" ? "#0d9488" : "#8b5cf6");
    pdfMainBodyHTML = `
      <div style="padding:0; background:#fff; border-radius:6px; overflow:hidden;">
        <div style="background:${headerBg}; color:#fff; padding:20px 24px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h1 style="font-size:22pt; font-weight:800; color:#fff; margin:0 0 4px 0; letter-spacing:0.5px;">${name}</h1>
            <div style="font-size:11pt; color:rgba(255,255,255,0.9); font-weight:600; margin-bottom:6px;">${title}</div>
            <div style="font-size:8.5pt; color:rgba(255,255,255,0.8); display:flex; gap:10px;">
              ${[location, phone, email].filter(Boolean).map(c => `<span>${c}</span>`).join(" &bull; ")}
            </div>
          </div>
          ${photoUrl ? avatarPDFHTML : ""}
        </div>

        <div style="padding:20px 24px;">
          <div style="font-size:9.5pt; font-weight:800; text-transform:uppercase; color:${tmpl.accent}; border-bottom:1.5px solid ${tmpl.accent}; padding-bottom:3px; margin-bottom:6px; letter-spacing:0.5px;">Profile Summary</div>
          <p style="font-size:9.5pt; color:#334155; line-height:1.5; margin-bottom:16px;">${summary}</p>

          <div style="font-size:9.5pt; font-weight:800; text-transform:uppercase; color:${tmpl.accent}; border-bottom:1.5px solid ${tmpl.accent}; padding-bottom:3px; margin-bottom:8px; letter-spacing:0.5px;">Core Competencies &amp; Skills</div>
          <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:16px;">
            ${skills.map(s => `<span style="background:${tmpl.accent}15; border:1px solid ${tmpl.accent}50; border-radius:4px; padding:3px 8px; font-size:8.5pt; font-weight:600; color:#1e293b;">${s}</span>`).join("")}
          </div>

          <div style="font-size:9.5pt; font-weight:800; text-transform:uppercase; color:${tmpl.accent}; border-bottom:1.5px solid ${tmpl.accent}; padding-bottom:3px; margin-bottom:10px; letter-spacing:0.5px;">Professional Experience</div>
          ${expPDFHTML}

          ${projectsPDFHTML}

          ${education.length ? `
          <div style="font-size:9.5pt; font-weight:800; text-transform:uppercase; color:${tmpl.accent}; border-bottom:1.5px solid ${tmpl.accent}; padding-bottom:3px; margin-bottom:8px; letter-spacing:0.5px;">Education</div>
          <div style="display:flex; flex-direction:column; gap:6px;">
            ${education.map(edu => `<div style="font-size:9.5pt;"><strong style="color:#0f172a;">${edu.degree}</strong> &mdash; ${edu.institution} (${edu.year})</div>`).join("")}
          </div>
          ` : ""}
        </div>
      </div>
    `;
  } else if (isBadge) {
    pdfMainBodyHTML = `
      <div style="padding:20px 24px; background:#fff;">
        <div style="display:flex; align-items:center; gap:12px; border-bottom:2.5px solid ${tmpl.accent}; padding-bottom:12px; margin-bottom:16px;">
          <div style="width:20px; height:20px; border-radius:50%; background:${tmpl.accent}; flex-shrink:0;"></div>
          <div>
            <h1 style="font-size:22pt; font-weight:800; color:#0f172a; margin:0 0 2px 0; text-transform:uppercase;">${name}</h1>
            <div style="font-size:10.5pt; color:${tmpl.accent}; font-weight:600;">${title} &nbsp;&bull;&nbsp; ${location} &nbsp;&bull;&nbsp; ${email}</div>
          </div>
        </div>

        <div style="font-size:9.5pt; font-weight:800; text-transform:uppercase; color:${tmpl.accent}; border-bottom:1.5px solid ${tmpl.accent}; padding-bottom:3px; margin-bottom:6px; letter-spacing:0.5px;">Objective &amp; Executive Summary</div>
        <p style="font-size:9.5pt; color:#334155; line-height:1.5; margin-bottom:16px;">${summary}</p>

        <div style="font-size:9.5pt; font-weight:800; text-transform:uppercase; color:${tmpl.accent}; border-bottom:1.5px solid ${tmpl.accent}; padding-bottom:3px; margin-bottom:10px; letter-spacing:0.5px;">Professional Experience</div>
        ${expPDFHTML}

        ${projectsPDFHTML}

        <div style="font-size:9.5pt; font-weight:800; text-transform:uppercase; color:${tmpl.accent}; border-bottom:1.5px solid ${tmpl.accent}; padding-bottom:3px; margin-bottom:8px; letter-spacing:0.5px;">Core Skills</div>
        <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:16px;">
          ${skills.map(s => `<span style="background:${tmpl.accent}15; border:1px solid ${tmpl.accent}50; border-radius:4px; padding:3px 8px; font-size:8.5pt; font-weight:600; color:#1e293b;">${s}</span>`).join("")}
        </div>

        ${education.length ? `
        <div style="font-size:9.5pt; font-weight:800; text-transform:uppercase; color:${tmpl.accent}; border-bottom:1.5px solid ${tmpl.accent}; padding-bottom:3px; margin-bottom:8px; letter-spacing:0.5px;">Education</div>
        <div style="display:flex; flex-direction:column; gap:6px;">
          ${education.map(edu => `<div style="font-size:9.5pt;"><strong style="color:#0f172a;">${edu.degree}</strong> &mdash; ${edu.institution} (${edu.year})</div>`).join("")}
        </div>
        ` : ""}
      </div>
    `;
  } else {
    // Standard Minimal / Editorial / Single Column
    const isCentered = tmpl.headerStyle === "centered";
    pdfMainBodyHTML = `
      <div style="padding:16px 20px; background:${isWarmSand ? '#f8f3ed' : '#ffffff'};">
        <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:3px solid ${tmpl.accent}; padding-bottom:12px; margin-bottom:16px; ${isCentered ? "flex-direction:column; text-align:center;" : ""}">
          <div style="${isCentered ? "text-align:center;" : ""}">
            <h1 style="font-size:24pt; font-weight:800; color:#0f172a; margin:0 0 4px 0; ${tmpl.tone === 'Modern' ? 'text-transform:uppercase; letter-spacing:1px;' : ''}">${name}</h1>
            <div style="font-size:12pt; font-weight:700; color:${tmpl.accent}; margin-bottom:6px;">${title}</div>
            <div style="font-size:9pt; color:#64748b; display:flex; gap:12px; flex-wrap:wrap; ${isCentered ? "justify-content:center;" : ""}">
              ${[location, phone, email].filter(Boolean).map(c => `<span>${c}</span>`).join(" &bull; ")}
            </div>
          </div>
          ${photoUrl ? `<div style="margin-left:16px;">${avatarPDFHTML}</div>` : ""}
        </div>

        <div style="font-size:9.5pt; font-weight:800; text-transform:uppercase; color:${tmpl.accent}; border-bottom:1.5px solid ${tmpl.accent}; padding-bottom:3px; margin-bottom:6px; letter-spacing:0.5px;">Executive Summary</div>
        <p style="font-size:9.5pt; color:#334155; line-height:1.5; margin-bottom:16px;">${summary}</p>

        <div style="font-size:9.5pt; font-weight:800; text-transform:uppercase; color:${tmpl.accent}; border-bottom:1.5px solid ${tmpl.accent}; padding-bottom:3px; margin-bottom:8px; letter-spacing:0.5px;">Core Competencies &amp; Skills</div>
        <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:16px;">
          ${skills.map(s => `<span style="background:${tmpl.accent}15; border:1px solid ${tmpl.accent}50; border-radius:4px; padding:3px 8px; font-size:8.5pt; font-weight:600; color:#1e293b;">${s}</span>`).join("")}
        </div>

        <div style="font-size:9.5pt; font-weight:800; text-transform:uppercase; color:${tmpl.accent}; border-bottom:1.5px solid ${tmpl.accent}; padding-bottom:3px; margin-bottom:10px; letter-spacing:0.5px;">Professional Experience</div>
        ${expPDFHTML}

        ${projectsPDFHTML}

        ${education.length ? `
        <div style="font-size:9.5pt; font-weight:800; text-transform:uppercase; color:${tmpl.accent}; border-bottom:1.5px solid ${tmpl.accent}; padding-bottom:3px; margin-bottom:8px; letter-spacing:0.5px;">Education &amp; Credentials</div>
        <div style="display:flex; flex-direction:column; gap:6px; margin-bottom:14px;">
          ${education.map(edu => `
            <div style="font-size:9.5pt;"><strong style="color:#0f172a;">${edu.degree}</strong> &mdash; <span style="color:#475569;">${edu.institution}</span> <span style="color:#64748b; font-size:8.5pt;">(${edu.year})</span></div>
          `).join("")}
        </div>
        ` : ""}

        ${certs.length ? `
        <div style="font-size:9.5pt; font-weight:800; text-transform:uppercase; color:${tmpl.accent}; border-bottom:1.5px solid ${tmpl.accent}; padding-bottom:3px; margin-bottom:8px; letter-spacing:0.5px;">Certifications &amp; Licenses</div>
        <div style="display:flex; flex-direction:column; gap:4px; margin-bottom:14px;">
          ${certs.map(c => `
            <div style="font-size:9pt;">🏆 <strong style="color:#0f172a;">${c.name}</strong>${c.issuer ? ` &mdash; <span style="color:#475569;">${c.issuer}</span>` : ""}</div>
          `).join("")}
        </div>
        ` : ""}

        ${languages.length ? `
        <div style="font-size:9.5pt; font-weight:800; text-transform:uppercase; color:${tmpl.accent}; border-bottom:1.5px solid ${tmpl.accent}; padding-bottom:3px; margin-bottom:8px; letter-spacing:0.5px;">Languages</div>
        <div style="display:flex; gap:12px; flex-wrap:wrap;">
          ${languages.map(l => `<span style="font-size:9pt; color:#334155;"><strong>${l.language}</strong>${l.proficiency ? ` (${l.proficiency})` : ""}</span>`).join("")}
        </div>
        ` : ""}
      </div>
    `;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${name} - Complete Career Package (${tmpl.name})</title>
      <style>
        @page { size: A4; margin: 10mm 12mm; }
        * { box-sizing: border-box; }
        body {
          font-family: ${tmpl.font};
          font-size: 10pt;
          line-height: 1.45;
          color: #1e293b;
          margin: 0;
          padding: 0;
          background: ${isWarmSand ? '#f8f3ed' : '#ffffff'};
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        @media print {
          body { margin: 0; padding: 0; }
        }
      </style>
    </head>
    <body>
      ${pdfMainBodyHTML}

      ${coverLetter.body ? `
        <div style="page-break-before: always; padding: 24px 20px;">
          <div style="border-bottom: 2.5px solid ${tmpl.accent}; padding-bottom: 8px; margin-bottom: 18px;">
            <h2 style="font-size:16pt; font-weight:800; color:${tmpl.accent}; margin:0 0 2px 0; text-transform:uppercase;">Cover Letter</h2>
            <p style="font-size:9pt; color:#64748b; margin:0;">${name} &bull; ${title} &bull; ${email}</p>
          </div>
          <p style="font-size:10pt; font-weight:bold; color:#0f172a;">${coverLetter.greeting || "Dear Hiring Manager,"}</p>
          <p style="white-space: pre-line; line-height: 1.7; font-size:9.5pt; color:#334155; margin-top:14px;">${coverLetter.body}</p>
          <p style="margin-top: 28px; font-weight:bold; color:#0f172a;">${(coverLetter.signOff || "Sincerely,\n" + name).replace(/\n/g, "<br>")}</p>
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
    }, 2000);
  }, 400);
}
