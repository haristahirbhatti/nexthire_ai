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
 * Uses dummy "John Doe" content so the card looks like an actual CV.
 */
export function getPreviewHTML(template) {
  const t = template;
  const accent = t.accent;
  const isTwo = t.columns === 2;
  const isCentered = t.headerStyle === "centered";
  const sidebarBg = t.sidebarBg || "transparent";
  const isDarkSidebar = !!t.sidebarBg;
  const fontFamily = t.font;

  const headerSection = isCentered
    ? `<div style="text-align:center;border-bottom:2.5px solid ${accent};padding-bottom:5px;margin-bottom:7px;">
        <div style="font-size:12px;font-weight:800;color:#111;letter-spacing:0.5px;">JOHN DOE</div>
        <div style="font-size:7.5px;color:${accent};font-weight:700;margin-top:2px;">Senior Financial Analyst</div>
        <div style="font-size:6px;color:#666;margin-top:2px;">Dubai, UAE · john@email.com · +971 50 123 4567</div>
      </div>`
    : `<div style="border-bottom:2.5px solid ${accent};padding-bottom:5px;margin-bottom:7px;">
        <div style="font-size:12px;font-weight:800;color:#111;">JOHN DOE</div>
        <div style="font-size:7.5px;color:${accent};font-weight:700;margin-top:2px;">Senior Financial Analyst</div>
        <div style="font-size:6px;color:#666;margin-top:2px;">Dubai, UAE · john@email.com</div>
      </div>`;

  const summaryBlock = `
    <div style="margin-bottom:6px;">
      <div style="font-size:6px;font-weight:800;text-transform:uppercase;color:${accent};border-bottom:1px solid ${accent};padding-bottom:1px;margin-bottom:3px;letter-spacing:0.4px;">Summary</div>
      <div style="font-size:5px;color:#333;line-height:1.4;">Results-driven analyst with 8+ yrs optimizing P&L across MENA. Led $50M planning cycles with 18% variance reduction.</div>
    </div>`;

  const skillsBlock = (dark) => `
    <div style="margin-bottom:6px;">
      <div style="font-size:6px;font-weight:800;text-transform:uppercase;color:${accent};border-bottom:1px solid ${accent};padding-bottom:1px;margin-bottom:3px;">Skills</div>
      <div style="font-size:5px;color:${dark ? '#ccc' : '#333'};line-height:1.5;">Financial Modeling · SAP ERP<br/>Power BI · Risk Analysis · Excel</div>
    </div>`;

  const expBlock = `
    <div style="margin-bottom:6px;">
      <div style="font-size:6px;font-weight:800;text-transform:uppercase;color:${accent};border-bottom:1px solid ${accent};padding-bottom:1px;margin-bottom:3px;">Experience</div>
      <div style="margin-bottom:4px;">
        <div style="font-size:5.5px;font-weight:700;color:#111;">Sr. Analyst — Emirates NBD <span style="float:right;color:#666;font-weight:400;">2020–Now</span></div>
        <div style="font-size:4.5px;color:#444;line-height:1.4;margin-top:1px;">• Led $50M budget cycle, cut variance 18%<br/>• Built C-suite Power BI dashboards</div>
      </div>
      <div>
        <div style="font-size:5.5px;font-weight:700;color:#111;">Analyst — Abu Dhabi Finance <span style="float:right;color:#666;font-weight:400;">2017–20</span></div>
        <div style="font-size:4.5px;color:#444;line-height:1.4;margin-top:1px;">• Managed AED 200M portfolio, +12% YoY</div>
      </div>
    </div>`;

  const eduBlock = (dark) => `
    <div>
      <div style="font-size:6px;font-weight:800;text-transform:uppercase;color:${accent};border-bottom:1px solid ${accent};padding-bottom:1px;margin-bottom:3px;">Education</div>
      <div style="font-size:5px;color:${dark ? '#ccc' : '#333'};">BSc Finance — Univ. of Dubai (2017)</div>
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
