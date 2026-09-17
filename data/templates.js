/**
 * NextHire.ai — Designer Template Definitions
 * Contains the 12 signature designer layouts matching the client's reference catalog:
 * - Left Sidebar (Jordan Mitchell Crimson)
 * - Dark Header Split (Kai Carter Dark)
 * - Minimalist ATS Standard (Full Name ATS)
 * - Soft Blue Right Sidebar (Morgan Connors)
 * - Accent Circle Badge (Jacob Hancock)
 * - Warm Sand Editorial (Kai Carter Beige)
 * - Teal Modern Card (Taylor Phillips)
 * - Lavender Boxed (Tonnie Thomsen)
 * - Timeline Rail (Liidia Peetre)
 * - Soft Lilac Banner (Janna Gardner)
 * - Clean Modern Timeline (Andree Rocher)
 * - Editorial Minimal Serif (Aneela Mohan)
 */

export const TEMPLATES = [
  {
    id: 1,
    name: "Jordan Crimson Sidebar",
    layoutFamily: "left-sidebar",
    tone: "Executive",
    accent: "#b91c1c",
    sidebarBg: "#b91c1c",
    font: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    columns: 2,
    headerStyle: "left",
    description: "Full-height crimson red sidebar with initials monogram badge & clean right column",
  },
  {
    id: 2,
    name: "Kai Dark Header",
    layoutFamily: "dark-header-split",
    tone: "Modern",
    accent: "#18181b",
    sidebarBg: null,
    font: "'Inter', Arial, sans-serif",
    columns: 2,
    headerStyle: "dark-banner",
    description: "Bold charcoal header block with high-contrast split columns for experience & skills",
  },
  {
    id: 3,
    name: "Minimalist ATS Standard",
    layoutFamily: "minimal-ats",
    tone: "Minimal",
    accent: "#111827",
    sidebarBg: null,
    font: "'Inter', Arial, sans-serif",
    columns: 1,
    headerStyle: "centered",
    description: "Ultra-clean single-column with horizontal rules, engineered for 100% ATS score",
  },
  {
    id: 4,
    name: "Morgan Right Sidebar",
    layoutFamily: "right-sidebar",
    tone: "Modern",
    accent: "#2563eb",
    sidebarBg: "#eff6ff",
    font: "'Inter', 'Segoe UI', sans-serif",
    columns: 2,
    headerStyle: "left",
    description: "Wide experience column on the left with a soft pastel blue sidebar on the right",
  },
  {
    id: 5,
    name: "Jacob Red Circle",
    layoutFamily: "badge-executive",
    tone: "Classic",
    accent: "#dc2626",
    sidebarBg: null,
    font: "Georgia, 'Times New Roman', serif",
    columns: 1,
    headerStyle: "left",
    description: "Signature red circle badge beside name with crisp underlines and serif hierarchy",
  },
  {
    id: 6,
    name: "Kai Warm Sand",
    layoutFamily: "warm-sand-split",
    tone: "Editorial",
    accent: "#78350f",
    sidebarBg: "#f8f3ed",
    font: "Georgia, 'Times New Roman', serif",
    columns: 2,
    headerStyle: "centered",
    description: "Warm cream background with centered serif typography and dual-column split",
  },
  {
    id: 7,
    name: "Taylor Teal Card",
    layoutFamily: "header-card-split",
    tone: "Creative",
    accent: "#0d9488",
    sidebarBg: "#f0fdfa",
    font: "'Inter', Arial, sans-serif",
    columns: 2,
    headerStyle: "teal-card",
    description: "Teal modern top card with bold typography and organized skill bars",
  },
  {
    id: 8,
    name: "Tonnie Purple Boxed",
    layoutFamily: "boxed-sidebar",
    tone: "Creative",
    accent: "#7c3aed",
    sidebarBg: "#faf5ff",
    font: "'Inter', sans-serif",
    columns: 2,
    headerStyle: "left",
    description: "Lavender/purple accents with boxed left sidebar and clean section badges",
  },
  {
    id: 9,
    name: "Liidia Timeline Rail",
    layoutFamily: "timeline-rail",
    tone: "Technical",
    accent: "#334155",
    sidebarBg: null,
    font: "'Trebuchet MS', 'Segoe UI', sans-serif",
    columns: 1,
    headerStyle: "left",
    description: "Engineering timeline layout with left-date rail and clean horizontal rules",
  },
  {
    id: 10,
    name: "Janna Lilac Banner",
    layoutFamily: "soft-banner",
    tone: "Classic",
    accent: "#8b5cf6",
    sidebarBg: null,
    font: "Georgia, 'Times New Roman', serif",
    columns: 1,
    headerStyle: "centered",
    description: "Soft pastel lilac top banner bar with centered name and elegant serif body",
  },
  {
    id: 11,
    name: "Andree Modern Timeline",
    layoutFamily: "clean-timeline",
    tone: "Modern",
    accent: "#18181b",
    sidebarBg: null,
    font: "'Inter', Helvetica, sans-serif",
    columns: 1,
    headerStyle: "left",
    description: "Bold black header with inline contact row and right-aligned timeline dates",
  },
  {
    id: 12,
    name: "Aneela Editorial Minimal",
    layoutFamily: "editorial-minimal",
    tone: "Editorial",
    accent: "#475569",
    sidebarBg: null,
    font: "Palatino, 'Book Antiqua', Georgia, serif",
    columns: 1,
    headerStyle: "right-contact",
    description: "Refined editorial typography with right-aligned contact block and elegant spacing",
  },
];

export const TEMPLATE_COUNT = TEMPLATES.length;

export function getTemplatePage(page = 1, pageSize = 12) {
  const start = (Math.max(1, page) - 1) * pageSize;
  return TEMPLATES.slice(start, start + pageSize);
}

export function getTemplateById(id) {
  return TEMPLATES.find((t) => t.id === Number(id)) || TEMPLATES[0];
}

/**
 * Returns inline HTML for real mini-resume preview cards in the template selection step.
 * Adapts to the exact visual style of each template family with the candidate's real data.
 */
export function getPreviewHTML(template, candidateData = {}, customPalette = null) {
  const t = template;
  const accent = customPalette?.primary || t.accent;
  const sidebarBg = customPalette?.secondary || t.sidebarBg || accent;
  const fontFamily = t.font;

  const name = (candidateData.name || "CANDIDATE NAME").toUpperCase();
  const title = candidateData.title || "Senior Professional";
  const location = candidateData.location || "City, Country";
  const email = candidateData.email || "candidate@email.com";
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("") || "CV";

  // ── Layout 1: Left Crimson Sidebar (Jordan Mitchell style) ────────
  if (t.layoutFamily === "left-sidebar") {
    return `
      <div style="font-family:${fontFamily};background:#fff;display:flex;height:100%;box-sizing:border-box;">
        <div style="width:34%;background:${sidebarBg};color:#fff;padding:8px 6px;display:flex;flex-direction:column;">
          <div style="width:24px;height:24px;background:#fff;color:${accent};font-weight:900;font-size:9px;display:flex;align-items:center;justify-content:center;border-radius:2px;margin-bottom:6px;">${initials}</div>
          <div style="font-size:8px;font-weight:800;letter-spacing:0.3px;line-height:1.2;">${name}</div>
          <div style="font-size:6px;opacity:0.85;margin-top:2px;margin-bottom:8px;">${title}</div>
          
          <div style="font-size:5.5px;font-weight:700;text-transform:uppercase;border-bottom:0.5px solid rgba(255,255,255,0.4);padding-bottom:1px;margin-bottom:3px;">Contact</div>
          <div style="font-size:4.5px;opacity:0.9;line-height:1.4;margin-bottom:6px;">${location}<br/>${email}</div>

          <div style="font-size:5.5px;font-weight:700;text-transform:uppercase;border-bottom:0.5px solid rgba(255,255,255,0.4);padding-bottom:1px;margin-bottom:3px;">Skills</div>
          <div style="font-size:4.5px;opacity:0.9;line-height:1.4;">• Strategy &amp; Ops<br/>• Project Mgmt<br/>• Team Leadership</div>
        </div>
        <div style="flex:1;padding:8px 10px;">
          <div style="font-size:6.5px;font-weight:800;color:${accent};border-bottom:1px solid ${accent};padding-bottom:1px;margin-bottom:3px;text-transform:uppercase;">Experience</div>
          <div style="margin-bottom:4px;">
            <div style="font-size:5.5px;font-weight:700;color:#111;">${title} <span style="float:right;color:#666;font-weight:400;">2021–Now</span></div>
            <div style="font-size:5px;color:${accent};font-weight:600;">Enterprise Corp</div>
            <div style="font-size:4.5px;color:#444;line-height:1.3;margin-top:1px;">• Led strategic operational improvements<br/>• Optimized key workflow deliverables</div>
          </div>
          <div style="font-size:6.5px;font-weight:800;color:${accent};border-bottom:1px solid ${accent};padding-bottom:1px;margin-top:6px;margin-bottom:3px;text-transform:uppercase;">Education</div>
          <div style="font-size:5px;color:#111;font-weight:700;">Bachelor's Degree</div>
          <div style="font-size:4.5px;color:#666;">University &bull; Graduated</div>
        </div>
      </div>
    `;
  }

  // ── Layout 2: Dark Header Split (Kai Carter Dark style) ────────────
  if (t.layoutFamily === "dark-header-split") {
    return `
      <div style="font-family:${fontFamily};background:#fff;height:100%;box-sizing:border-box;display:flex;flex-direction:column;">
        <div style="background:#18181b;color:#fff;padding:8px 10px;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-size:9.5px;font-weight:800;letter-spacing:0.5px;">${name}</div>
            <div style="font-size:6.5px;color:#a1a1aa;text-transform:uppercase;margin-top:1px;">${title}</div>
            <div style="font-size:5px;color:#71717a;margin-top:2px;">${location} &bull; ${email}</div>
          </div>
          <div style="font-size:16px;opacity:0.3;font-weight:900;">✕✕</div>
        </div>
        <div style="display:flex;flex:1;padding:8px 10px;gap:8px;">
          <div style="flex:1;">
            <div style="font-size:6px;font-weight:800;text-transform:uppercase;color:#111;border-bottom:1px solid #111;padding-bottom:1px;margin-bottom:3px;">Profile</div>
            <div style="font-size:4.5px;color:#444;line-height:1.3;margin-bottom:6px;">Proven track record delivering quantifiable results across business initiatives.</div>
            <div style="font-size:6px;font-weight:800;text-transform:uppercase;color:#111;border-bottom:1px solid #111;padding-bottom:1px;margin-bottom:3px;">Experience</div>
            <div style="font-size:5px;font-weight:700;color:#111;">${title} &mdash; Corp</div>
            <div style="font-size:4.5px;color:#444;line-height:1.3;">• Spearheaded key deliverables<br/>• Boosted throughput by 25%</div>
          </div>
          <div style="width:38%;">
            <div style="font-size:6px;font-weight:800;text-transform:uppercase;color:#111;border-bottom:1px solid #111;padding-bottom:1px;margin-bottom:3px;">Skills</div>
            <div style="font-size:4.5px;color:#333;line-height:1.4;margin-bottom:6px;">• Strategy<br/>• Workflow Tuning<br/>• Team Execution</div>
            <div style="font-size:6px;font-weight:800;text-transform:uppercase;color:#111;border-bottom:1px solid #111;padding-bottom:1px;margin-bottom:3px;">Education</div>
            <div style="font-size:4.5px;color:#333;font-weight:600;">BSc Degree &bull; Higher Ed</div>
          </div>
        </div>
      </div>
    `;
  }

  // ── Layout 4: Soft Blue Right Sidebar (Morgan Connors style) ───────
  if (t.layoutFamily === "right-sidebar") {
    return `
      <div style="font-family:${fontFamily};background:#fff;display:flex;height:100%;box-sizing:border-box;">
        <div style="flex:1;padding:8px 10px;">
          <div style="font-size:9px;font-weight:800;color:#0f172a;">${name}</div>
          <div style="font-size:6.5px;color:${accent};font-weight:600;margin-bottom:8px;">${title}</div>
          <div style="font-size:6px;font-weight:800;text-transform:uppercase;color:${accent};border-bottom:1px solid #cbd5e1;padding-bottom:1px;margin-bottom:3px;">Summary</div>
          <div style="font-size:4.5px;color:#334155;line-height:1.35;margin-bottom:6px;">Results-driven professional with deep domain mastery and leadership excellence.</div>
          <div style="font-size:6px;font-weight:800;text-transform:uppercase;color:${accent};border-bottom:1px solid #cbd5e1;padding-bottom:1px;margin-bottom:3px;">Experience</div>
          <div style="font-size:5px;font-weight:700;color:#0f172a;">${title} — Prime Org</div>
          <div style="font-size:4.5px;color:#475569;line-height:1.3;">• Accelerated key project milestones<br/>• Improved workflow turnaround by 30%</div>
        </div>
        <div style="width:34%;background:${sidebarBg};padding:8px 6px;border-left:1px solid #dbeafe;">
          <div style="font-size:6px;font-weight:800;text-transform:uppercase;color:${accent};margin-bottom:3px;">Contact</div>
          <div style="font-size:4.5px;color:#334155;line-height:1.4;margin-bottom:6px;">${location}<br/>${email}</div>
          <div style="font-size:6px;font-weight:800;text-transform:uppercase;color:${accent};margin-bottom:3px;">Skills</div>
          <div style="font-size:4.5px;color:#334155;line-height:1.4;margin-bottom:6px;">• Strategic Ops<br/>• Technical Mgmt<br/>• Data Analysis</div>
          <div style="font-size:6px;font-weight:800;text-transform:uppercase;color:${accent};margin-bottom:3px;">Education</div>
          <div style="font-size:4.5px;color:#334155;font-weight:600;">Bachelor's Degree</div>
        </div>
      </div>
    `;
  }

  // ── Layout 5: Jacob Red Circle Badge ──────────────────────────────
  if (t.layoutFamily === "badge-executive") {
    return `
      <div style="font-family:${fontFamily};background:#fff;padding:8px 10px;height:100%;box-sizing:border-box;">
        <div style="display:flex;align-items:center;gap:5px;border-bottom:1.5px solid ${accent};padding-bottom:5px;margin-bottom:6px;">
          <div style="width:12px;height:12px;border-radius:50%;background:${accent};flex-shrink:0;"></div>
          <div>
            <div style="font-size:9.5px;font-weight:800;color:#111;">${name}</div>
            <div style="font-size:6px;color:#666;">${title} &bull; ${location}</div>
          </div>
        </div>
        <div style="font-size:6px;font-weight:800;color:${accent};text-transform:uppercase;margin-bottom:2px;">Objective</div>
        <div style="font-size:4.5px;color:#333;line-height:1.3;margin-bottom:5px;">Dedicated specialist focused on delivering scalable high-impact solutions.</div>
        <div style="font-size:6px;font-weight:800;color:${accent};text-transform:uppercase;margin-bottom:2px;">Experience</div>
        <div style="font-size:5px;font-weight:700;color:#111;">${title} — Industry Lead <span style="float:right;color:#666;">2020–Now</span></div>
        <div style="font-size:4.5px;color:#444;line-height:1.3;margin-bottom:5px;">• Managed mission-critical initiatives with 99.8% precision<br/>• Coordinated cross-functional teams</div>
        <div style="font-size:6px;font-weight:800;color:${accent};text-transform:uppercase;margin-bottom:2px;">Education &amp; Skills</div>
        <div style="font-size:4.5px;color:#333;">Degree in Specialization &bull; Core Strategy, Analytics &amp; Execution</div>
      </div>
    `;
  }

  // ── Layout 6: Warm Sand Editorial (Kai Carter Beige) ───────────────
  if (t.layoutFamily === "warm-sand-split") {
    return `
      <div style="font-family:${fontFamily};background:#f8f3ed;padding:8px 10px;height:100%;box-sizing:border-box;">
        <div style="text-align:center;border-bottom:1px solid #d7c9b8;padding-bottom:5px;margin-bottom:6px;">
          <div style="font-size:10px;font-weight:bold;color:#292524;">${name}</div>
          <div style="font-size:6px;color:${accent};text-transform:uppercase;letter-spacing:0.5px;">${title}</div>
          <div style="font-size:5px;color:#78716c;">${location} &bull; ${email}</div>
        </div>
        <div style="display:flex;gap:8px;">
          <div style="width:38%;">
            <div style="font-size:6px;font-weight:700;color:#292524;text-transform:uppercase;border-bottom:0.5px solid #d7c9b8;margin-bottom:2px;">Skills</div>
            <div style="font-size:4.5px;color:#57534e;line-height:1.4;margin-bottom:5px;">• Domain Leadership<br/>• Risk Optimization<br/>• Communication</div>
            <div style="font-size:6px;font-weight:700;color:#292524;text-transform:uppercase;border-bottom:0.5px solid #d7c9b8;margin-bottom:2px;">Education</div>
            <div style="font-size:4.5px;color:#57534e;line-height:1.3;">University College<br/>Bachelor's Degree</div>
          </div>
          <div style="flex:1;">
            <div style="font-size:6px;font-weight:700;color:#292524;text-transform:uppercase;border-bottom:0.5px solid #d7c9b8;margin-bottom:2px;">Work Experience</div>
            <div style="font-size:5px;font-weight:700;color:#292524;">${title} &mdash; Global Co</div>
            <div style="font-size:4.5px;color:#57534e;line-height:1.3;">• Led core strategic roadmap<br/>• Delivered 20% operational efficiency</div>
          </div>
        </div>
      </div>
    `;
  }

  // ── Layout 7: Teal Card Header (Taylor Phillips style) ────────────
  if (t.layoutFamily === "header-card-split") {
    return `
      <div style="font-family:${fontFamily};background:#fff;height:100%;box-sizing:border-box;display:flex;flex-direction:column;">
        <div style="background:#0d9488;color:#fff;padding:8px 10px;">
          <div style="font-size:10px;font-weight:900;letter-spacing:0.3px;">${name}</div>
          <div style="font-size:6px;opacity:0.9;margin-top:2px;">${title} &bull; ${location} &bull; ${email}</div>
        </div>
        <div style="padding:6px 10px;flex:1;">
          <div style="font-size:6px;font-weight:800;color:#0d9488;text-transform:uppercase;border-bottom:1px solid #0d9488;padding-bottom:1px;margin-bottom:3px;">Experience</div>
          <div style="font-size:5px;font-weight:700;color:#111;">${title} &mdash; Lead Org <span style="float:right;color:#666;">2021–Now</span></div>
          <div style="font-size:4.5px;color:#444;line-height:1.3;margin-bottom:5px;">• Managed end-to-end deliverables<br/>• Engineered automated workflows</div>
          <div style="font-size:6px;font-weight:800;color:#0d9488;text-transform:uppercase;border-bottom:1px solid #0d9488;padding-bottom:1px;margin-bottom:3px;">Core Competencies</div>
          <div style="display:flex;gap:3px;margin-top:2px;">
            <span style="background:#ccfbf1;color:#0f766e;font-size:4.5px;padding:1px 3px;border-radius:2px;">Strategy</span>
            <span style="background:#ccfbf1;color:#0f766e;font-size:4.5px;padding:1px 3px;border-radius:2px;">Leadership</span>
            <span style="background:#ccfbf1;color:#0f766e;font-size:4.5px;padding:1px 3px;border-radius:2px;">Analytics</span>
          </div>
        </div>
      </div>
    `;
  }

  // ── Layout 8: Tonnie Purple Boxed ─────────────────────────────────
  if (t.layoutFamily === "boxed-sidebar") {
    return `
      <div style="font-family:${fontFamily};background:#fff;padding:8px 10px;height:100%;box-sizing:border-box;">
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1.5px solid ${accent};padding-bottom:4px;margin-bottom:6px;">
          <div>
            <div style="font-size:10px;font-weight:800;color:${accent};">${name}</div>
            <div style="font-size:6px;color:#64748b;">${title}</div>
          </div>
          <div style="font-size:8px;color:${accent};">★★</div>
        </div>
        <div style="display:flex;gap:6px;">
          <div style="width:36%;border:1px solid #e9d5ff;background:#faf5ff;padding:4px;border-radius:3px;">
            <div style="font-size:5.5px;font-weight:800;color:${accent};text-transform:uppercase;margin-bottom:2px;">Contact</div>
            <div style="font-size:4.5px;color:#581c87;line-height:1.3;margin-bottom:4px;">${location}<br/>${email}</div>
            <div style="font-size:5.5px;font-weight:800;color:${accent};text-transform:uppercase;margin-bottom:2px;">Skills</div>
            <div style="font-size:4.5px;color:#581c87;line-height:1.3;">• Ops &amp; Scale<br/>• Quality Mgmt</div>
          </div>
          <div style="flex:1;">
            <div style="font-size:6px;font-weight:800;color:${accent};text-transform:uppercase;margin-bottom:2px;">Experience</div>
            <div style="font-size:5px;font-weight:700;color:#111;">${title} — Corp</div>
            <div style="font-size:4.5px;color:#444;line-height:1.3;">• Scaled operations by 40%<br/>• Maintained 100% compliance</div>
          </div>
        </div>
      </div>
    `;
  }

  // ── Layout 9: Timeline Rail (Liidia Peetre) ───────────────────────
  if (t.layoutFamily === "timeline-rail") {
    return `
      <div style="font-family:${fontFamily};background:#fff;padding:8px 10px;height:100%;box-sizing:border-box;">
        <div style="display:flex;justify-content:space-between;align-items:baseline;border-bottom:2px solid #0f172a;padding-bottom:4px;margin-bottom:6px;">
          <div style="font-size:9.5px;font-weight:800;color:#0f172a;">${name}</div>
          <div style="font-size:6px;color:#64748b;font-weight:600;">${title}</div>
        </div>
        <div style="font-size:6px;font-weight:800;text-transform:uppercase;color:#0f172a;margin-bottom:3px;">Experience Timeline</div>
        <div style="display:flex;gap:6px;margin-bottom:5px;">
          <div style="font-size:4.5px;color:#64748b;font-weight:700;width:28%;">2021 &mdash; NOW</div>
          <div style="flex:1;border-left:1px solid #cbd5e1;padding-left:4px;">
            <div style="font-size:5px;font-weight:700;color:#0f172a;">${title} &bull; Enterprise</div>
            <div style="font-size:4.5px;color:#334155;line-height:1.3;">• Orchestrated key technical implementations</div>
          </div>
        </div>
        <div style="display:flex;gap:6px;">
          <div style="font-size:4.5px;color:#64748b;font-weight:700;width:28%;">2018 &mdash; 2021</div>
          <div style="flex:1;border-left:1px solid #cbd5e1;padding-left:4px;">
            <div style="font-size:5px;font-weight:700;color:#0f172a;">Associate Lead &bull; Technology Corp</div>
            <div style="font-size:4.5px;color:#334155;line-height:1.3;">• Built core systems &amp; streamlined operations</div>
          </div>
        </div>
      </div>
    `;
  }

  // ── Layout 10: Soft Lilac Banner (Janna Gardner) ───────────────────
  if (t.layoutFamily === "soft-banner") {
    return `
      <div style="font-family:${fontFamily};background:#fff;height:100%;box-sizing:border-box;display:flex;flex-direction:column;">
        <div style="background:#ede9fe;text-align:center;padding:7px 10px;border-bottom:1px solid #ddd6fe;">
          <div style="font-size:9.5px;font-weight:700;color:#5b21b6;">${name}</div>
          <div style="font-size:5.5px;color:#6b21a8;margin-top:1px;">${title} &bull; ${location} &bull; ${email}</div>
        </div>
        <div style="padding:6px 10px;flex:1;">
          <div style="font-size:6px;font-weight:700;text-transform:uppercase;color:#5b21b6;border-bottom:0.5px solid #ddd6fe;margin-bottom:3px;">Summary</div>
          <div style="font-size:4.5px;color:#444;line-height:1.35;margin-bottom:5px;">Accomplished professional with exceptional track record in driving measurable business outcomes.</div>
          <div style="font-size:6px;font-weight:700;text-transform:uppercase;color:#5b21b6;border-bottom:0.5px solid #ddd6fe;margin-bottom:3px;">Experience</div>
          <div style="font-size:5px;font-weight:700;color:#111;">${title} — Senior Associate <span style="float:right;color:#666;">2021–Now</span></div>
          <div style="font-size:4.5px;color:#444;line-height:1.3;">• Spearheaded key deliverables with quantifiable metrics</div>
        </div>
      </div>
    `;
  }

  // ── Layout 12: Editorial Minimal Serif (Aneela Mohan / Andree) ────
  return `
    <div style="font-family:${fontFamily};background:#fff;padding:8px 10px;height:100%;box-sizing:border-box;">
      <div style="display:flex;justify-content:space-between;border-bottom:1.5px solid #111;padding-bottom:4px;margin-bottom:6px;">
        <div>
          <div style="font-size:10px;font-weight:800;color:#111;letter-spacing:0.3px;">${name}</div>
          <div style="font-size:6px;color:#4b5563;text-transform:uppercase;">${title}</div>
        </div>
        <div style="text-align:right;font-size:4.5px;color:#6b7280;line-height:1.3;">
          ${location}<br/>${email}
        </div>
      </div>
      <div style="font-size:6px;font-weight:800;text-transform:uppercase;color:#111;margin-bottom:2px;letter-spacing:0.5px;">Executive Summary</div>
      <div style="font-size:4.5px;color:#374151;line-height:1.35;margin-bottom:5px;">Results-oriented professional with proven expertise in executing strategic initiatives and optimizing performance.</div>
      <div style="font-size:6px;font-weight:800;text-transform:uppercase;color:#111;margin-bottom:2px;letter-spacing:0.5px;">Professional Experience</div>
      <div style="font-size:5px;font-weight:700;color:#111;">${title} &mdash; Global Solutions <span style="float:right;color:#6b7280;">2020–Present</span></div>
      <div style="font-size:4.5px;color:#374151;line-height:1.3;margin-top:1px;">• Delivered measurable operational enhancements and team success<br/>• Streamlined cross-functional workflows</div>
      <div style="font-size:6px;font-weight:800;text-transform:uppercase;color:#111;margin-top:5px;margin-bottom:2px;letter-spacing:0.5px;">Education &amp; Credentials</div>
      <div style="font-size:4.5px;color:#374151;">Bachelor's Degree &bull; Academic Institution</div>
    </div>
  `;
}
