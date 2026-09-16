/**
 * NextHire.ai — Template Definitions
 * Each template has a unique layout, color accent, font, and a
 * getPreviewHTML() factory that returns a real mini-resume preview.
 */

export const TEMPLATES = [
  {
    id: 1,
    name: "Meridian Classic",
    tone: "Classic",
    accent: "#B8922A",
    sidebarBg: null,
    font: "Georgia, 'Times New Roman', serif",
    columns: 1,
    headerStyle: "centered",
  },
  {
    id: 2,
    name: "Blueprint Modern",
    tone: "Modern",
    accent: "#3E8F63",
    sidebarBg: "#1a2e25",
    font: "Calibri, 'Helvetica Neue', Arial, sans-serif",
    columns: 2,
    headerStyle: "left",
  },
  {
    id: 3,
    name: "Ledger Executive",
    tone: "Executive",
    accent: "#C24B4B",
    sidebarBg: "#1e1414",
    font: "Palatino, 'Book Antiqua', Georgia, serif",
    columns: 2,
    headerStyle: "left",
  },
  {
    id: 4,
    name: "Aster Minimal",
    tone: "Minimal",
    accent: "#5A7FA8",
    sidebarBg: null,
    font: "'Trebuchet MS', Helvetica, Arial, sans-serif",
    columns: 1,
    headerStyle: "left",
  },
  {
    id: 5,
    name: "Pinnacle Creative",
    tone: "Creative",
    accent: "#8B5CF6",
    sidebarBg: "#1c1030",
    font: "Verdana, Tahoma, Geneva, sans-serif",
    columns: 2,
    headerStyle: "left",
  },
  {
    id: 6,
    name: "Ionic Technical",
    tone: "Technical",
    accent: "#0EA5E9",
    sidebarBg: null,
    font: "'Courier New', Courier, monospace",
    columns: 1,
    headerStyle: "left",
  },
  {
    id: 7,
    name: "Lumen Gold",
    tone: "Modern",
    accent: "#D4A72C",
    sidebarBg: "#1e1a0e",
    font: "Calibri, 'Helvetica Neue', Arial, sans-serif",
    columns: 2,
    headerStyle: "centered",
  },
  {
    id: 8,
    name: "Northline Clean",
    tone: "Minimal",
    accent: "#14B8A6",
    sidebarBg: null,
    font: "'Trebuchet MS', Helvetica, Arial, sans-serif",
    columns: 1,
    headerStyle: "centered",
  },
  {
    id: 9,
    name: "Zephyr Bold",
    tone: "Executive",
    accent: "#E97C2C",
    sidebarBg: "#1e140a",
    font: "Palatino, 'Book Antiqua', Georgia, serif",
    columns: 2,
    headerStyle: "left",
  },
  // ── NEW TEMPLATES ─────────────────────────────────────────────────
  {
    id: 10,
    name: "Obsidian Pro",
    tone: "Executive",
    accent: "#64748B",
    sidebarBg: "#0f172a",
    font: "Georgia, 'Times New Roman', serif",
    columns: 2,
    headerStyle: "centered",
  },
  {
    id: 11,
    name: "Nova Gradient",
    tone: "Creative",
    accent: "#EC4899",
    sidebarBg: "#1a0a14",
    font: "Verdana, Tahoma, Geneva, sans-serif",
    columns: 2,
    headerStyle: "centered",
  },
  {
    id: 12,
    name: "Apex Corporate",
    tone: "Classic",
    accent: "#1E3A5F",
    sidebarBg: null,
    font: "Georgia, 'Times New Roman', serif",
    columns: 1,
    headerStyle: "left",
  },
  {
    id: 13,
    name: "Clarity Swiss",
    tone: "Minimal",
    accent: "#334155",
    sidebarBg: null,
    font: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    columns: 1,
    headerStyle: "centered",
  },
  {
    id: 14,
    name: "Forge Industrial",
    tone: "Technical",
    accent: "#F59E0B",
    sidebarBg: "#1a1400",
    font: "'Courier New', Courier, monospace",
    columns: 2,
    headerStyle: "left",
  },
  {
    id: 15,
    name: "Serif Heritage",
    tone: "Classic",
    accent: "#7C3AED",
    sidebarBg: null,
    font: "Palatino, 'Book Antiqua', Georgia, serif",
    columns: 1,
    headerStyle: "centered",
  },
  {
    id: 16,
    name: "Metro Edge",
    tone: "Modern",
    accent: "#06B6D4",
    sidebarBg: "#0a1a1e",
    font: "Calibri, 'Helvetica Neue', Arial, sans-serif",
    columns: 2,
    headerStyle: "left",
  },
  {
    id: 17,
    name: "Canvas Studio",
    tone: "Creative",
    accent: "#10B981",
    sidebarBg: null,
    font: "Verdana, Tahoma, Geneva, sans-serif",
    columns: 1,
    headerStyle: "left",
  },
  {
    id: 18,
    name: "Summit Elite",
    tone: "Executive",
    accent: "#B45309",
    sidebarBg: "#1e150a",
    font: "Georgia, 'Times New Roman', serif",
    columns: 2,
    headerStyle: "centered",
  },
];

export const TEMPLATE_COUNT = TEMPLATES.length;

/** Returns a page slice of templates (backwards compat) */
export function getTemplatePage(page = 1, pageSize = 9) {
  const start = (Math.max(1, page) - 1) * pageSize;
  return TEMPLATES.slice(start, start + pageSize);
}

/** Returns a single template by id */
export function getTemplateById(id) {
  return TEMPLATES.find((t) => t.id === Number(id)) || TEMPLATES[0];
}

/**
 * Returns inline HTML for a real mini-resume preview card.
 * Uses real candidate info if available, or clean placeholder content.
 */
export function getPreviewHTML(template, candidateData = {}) {
  const t = template;
  const accent = t.accent;
  const isTwo = t.columns === 2;
  const isCentered = t.headerStyle === "centered";
  const sidebarBg = t.sidebarBg || "transparent";
  const isDarkSidebar = !!t.sidebarBg;
  const fontFamily = t.font;

  const name = (candidateData.name || "CANDIDATE NAME").toUpperCase();
  const title = candidateData.title || "Senior Professional";
  const location = candidateData.location || "City, Country";
  const email = candidateData.email || "candidate@email.com";
  const summary = candidateData.summary || "Results-driven professional with proven track record in optimizing key workflows, executing strategic goals, and delivering quantifiable outcomes.";
  const skills = candidateData.skills?.length ? candidateData.skills.slice(0, 5).join(" · ") : "Strategic Planning · Project Leadership<br/>Process Optimization · Core Execution";
  const company = candidateData.company || "Recent Enterprise";

  const headerSection = isCentered
    ? `<div style="text-align:center;border-bottom:2.5px solid ${accent};padding-bottom:5px;margin-bottom:7px;">
        <div style="font-size:12px;font-weight:800;color:#111;letter-spacing:0.5px;">${name}</div>
        <div style="font-size:7.5px;color:${accent};font-weight:700;margin-top:2px;">${title}</div>
        <div style="font-size:6px;color:#666;margin-top:2px;">${location} · ${email}</div>
      </div>`
    : `<div style="border-bottom:2.5px solid ${accent};padding-bottom:5px;margin-bottom:7px;">
        <div style="font-size:12px;font-weight:800;color:#111;">${name}</div>
        <div style="font-size:7.5px;color:${accent};font-weight:700;margin-top:2px;">${title}</div>
        <div style="font-size:6px;color:#666;margin-top:2px;">${location} · ${email}</div>
      </div>`;

  const summaryBlock = `
    <div style="margin-bottom:6px;">
      <div style="font-size:6px;font-weight:800;text-transform:uppercase;color:${accent};border-bottom:1px solid ${accent};padding-bottom:1px;margin-bottom:3px;letter-spacing:0.4px;">Summary</div>
      <div style="font-size:5px;color:#333;line-height:1.4;">${summary}</div>
    </div>`;

  const skillsBlock = (dark) => `
    <div style="margin-bottom:6px;">
      <div style="font-size:6px;font-weight:800;text-transform:uppercase;color:${accent};border-bottom:1px solid ${accent};padding-bottom:1px;margin-bottom:3px;">Skills</div>
      <div style="font-size:5px;color:${dark ? '#ccc' : '#333'};line-height:1.5;">${skills}</div>
    </div>`;

  const expBlock = `
    <div style="margin-bottom:6px;">
      <div style="font-size:6px;font-weight:800;text-transform:uppercase;color:${accent};border-bottom:1px solid ${accent};padding-bottom:1px;margin-bottom:3px;">Experience</div>
      <div style="margin-bottom:4px;">
        <div style="font-size:5.5px;font-weight:700;color:#111;">${title} — ${company} <span style="float:right;color:#666;font-weight:400;">2021–Now</span></div>
        <div style="font-size:4.5px;color:#444;line-height:1.4;margin-top:1px;">• Led high-priority initiatives with measurable ROI<br/>• Spearheaded workflow optimizations</div>
      </div>
      <div>
        <div style="font-size:5.5px;font-weight:700;color:#111;">Professional Lead — Career History <span style="float:right;color:#666;font-weight:400;">2018–21</span></div>
        <div style="font-size:4.5px;color:#444;line-height:1.4;margin-top:1px;">• Delivered key strategic deliverables on schedule</div>
      </div>
    </div>`;

  const eduBlock = (dark) => `
    <div>
      <div style="font-size:6px;font-weight:800;text-transform:uppercase;color:${accent};border-bottom:1px solid ${accent};padding-bottom:1px;margin-bottom:3px;">Education</div>
      <div style="font-size:5px;color:${dark ? '#ccc' : '#333'};">Bachelor's Degree — University / Higher Education</div>
    </div>`;

  if (isTwo) {
    return `<div style="font-family:${fontFamily};background:#fff;padding:8px;height:100%;box-sizing:border-box;overflow:hidden;">
      ${headerSection}
      <div style="display:flex;gap:5px;">
        <div style="width:33%;background:${sidebarBg};padding:4px;border-radius:2px;">
          ${skillsBlock(isDarkSidebar)}
          ${eduBlock(isDarkSidebar)}
        </div>
        <div style="flex:1;">
          ${summaryBlock}
          ${expBlock}
        </div>
      </div>
    </div>`;
  }

  return `<div style="font-family:${fontFamily};background:#fff;padding:8px;height:100%;box-sizing:border-box;overflow:hidden;">
    ${headerSection}
    ${summaryBlock}
    ${skillsBlock(false)}
    ${expBlock}
    ${eduBlock(false)}
  </div>`;
}
