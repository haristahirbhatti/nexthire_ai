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
 * Perfectly fills 100% width and 100% height of the card box edge-to-edge with no dead margins.
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
      <div style="font-family:${fontFamily};background:#ffffff;display:flex;width:100%;height:100%;box-sizing:border-box;color:#1e293b;overflow:hidden;">
        <!-- Left Sidebar (Full Height) -->
        <div style="width:36%;background:${sidebarBg};color:#ffffff;padding:12px 10px;display:flex;flex-direction:column;justify-content:space-between;box-sizing:border-box;">
          <div>
            <div style="width:28px;height:28px;background:#ffffff;color:${accent};font-weight:900;font-size:11px;display:flex;align-items:center;justify-content:center;border-radius:3px;margin-bottom:8px;box-shadow:0 1px 3px rgba(0,0,0,0.2);">${initials}</div>
            <div style="font-size:10px;font-weight:800;letter-spacing:0.3px;line-height:1.2;color:#ffffff;">${name}</div>
            <div style="font-size:7.5px;opacity:0.9;margin-top:2px;margin-bottom:10px;color:#f8fafc;">${title}</div>
            
            <div style="font-size:7px;font-weight:700;text-transform:uppercase;border-bottom:1px solid rgba(255,255,255,0.35);padding-bottom:2px;margin-bottom:4px;letter-spacing:0.5px;">Contact</div>
            <div style="font-size:6.5px;opacity:0.95;line-height:1.45;margin-bottom:10px;">${location}<br/>${email}</div>

            <div style="font-size:7px;font-weight:700;text-transform:uppercase;border-bottom:1px solid rgba(255,255,255,0.35);padding-bottom:2px;margin-bottom:4px;letter-spacing:0.5px;">Skills</div>
            <div style="font-size:6.5px;opacity:0.95;line-height:1.45;">• Strategic Leadership<br/>• Project Operations<br/>• Process Optimization</div>
          </div>
          <div>
            <div style="font-size:7px;font-weight:700;text-transform:uppercase;border-bottom:1px solid rgba(255,255,255,0.35);padding-bottom:2px;margin-bottom:3px;letter-spacing:0.5px;">Education</div>
            <div style="font-size:6.5px;font-weight:600;">Bachelor's Degree</div>
            <div style="font-size:6px;opacity:0.8;">University &bull; Honors</div>
          </div>
        </div>

        <!-- Right Main Column -->
        <div style="flex:1;padding:12px 12px;display:flex;flex-direction:column;justify-content:space-between;box-sizing:border-box;">
          <div>
            <div style="font-size:8px;font-weight:800;color:${accent};border-bottom:1.5px solid ${accent};padding-bottom:2px;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px;">Executive Summary</div>
            <div style="font-size:6.5px;color:#475569;line-height:1.4;margin-bottom:10px;">Results-driven professional with proven expertise in orchestrating cross-functional initiatives, scaling business processes, and delivering measurable impact.</div>

            <div style="font-size:8px;font-weight:800;color:${accent};border-bottom:1.5px solid ${accent};padding-bottom:2px;margin-bottom:6px;text-transform:uppercase;letter-spacing:0.5px;">Work Experience</div>
            <div style="margin-bottom:6px;">
              <div style="font-size:7.5px;font-weight:700;color:#0f172a;">${title} <span style="float:right;color:#64748b;font-weight:500;font-size:6.5px;">2021–Present</span></div>
              <div style="font-size:7px;color:${accent};font-weight:600;">Enterprise Solutions Corp</div>
              <div style="font-size:6.5px;color:#334155;line-height:1.35;margin-top:2px;">• Directed high-priority strategic initiatives and operational roadmaps<br/>• Improved workflow turnaround and team efficiency by 32%</div>
            </div>
            <div style="margin-bottom:6px;">
              <div style="font-size:7.5px;font-weight:700;color:#0f172a;">Senior Associate <span style="float:right;color:#64748b;font-weight:500;font-size:6.5px;">2018–2021</span></div>
              <div style="font-size:7px;color:${accent};font-weight:600;">Global Systems Inc</div>
              <div style="font-size:6.5px;color:#334155;line-height:1.35;margin-top:2px;">• Managed end-to-end deliverables with 100% client satisfaction</div>
            </div>
          </div>
          <div style="border-top:1px solid #e2e8f0;padding-top:4px;">
            <div style="font-size:6.5px;color:#64748b;font-weight:600;">🏆 Certified Specialist &bull; Continuous Improvement Award</div>
          </div>
        </div>
      </div>
    `;
  }

  // ── Layout 2: Dark Header Split (Kai Carter Dark style) ────────────
  if (t.layoutFamily === "dark-header-split") {
    return `
      <div style="font-family:${fontFamily};background:#ffffff;display:flex;flex-direction:column;width:100%;height:100%;box-sizing:border-box;overflow:hidden;">
        <!-- Top Dark Banner -->
        <div style="background:#18181b;color:#ffffff;padding:12px 14px;display:flex;justify-content:space-between;align-items:center;box-sizing:border-box;">
          <div>
            <div style="font-size:12px;font-weight:900;letter-spacing:0.5px;color:#ffffff;">${name}</div>
            <div style="font-size:8px;color:#a1a1aa;text-transform:uppercase;font-weight:600;margin-top:1px;">${title}</div>
            <div style="font-size:6.5px;color:#71717a;margin-top:3px;">${location} &bull; ${email}</div>
          </div>
          <div style="font-size:22px;opacity:0.25;font-weight:900;line-height:1;letter-spacing:-2px;">✕✕</div>
        </div>

        <!-- Split Body -->
        <div style="display:flex;flex:1;padding:12px 14px;gap:12px;box-sizing:border-box;">
          <div style="flex:1;display:flex;flex-direction:column;justify-content:space-between;">
            <div>
              <div style="font-size:7.5px;font-weight:800;text-transform:uppercase;color:#18181b;border-bottom:1.5px solid #18181b;padding-bottom:2px;margin-bottom:4px;letter-spacing:0.5px;">Executive Profile</div>
              <div style="font-size:6.5px;color:#334155;line-height:1.4;margin-bottom:8px;">Accomplished leader recognized for driving operational excellence and high-yield strategic initiatives across diverse business functions.</div>

              <div style="font-size:7.5px;font-weight:800;text-transform:uppercase;color:#18181b;border-bottom:1.5px solid #18181b;padding-bottom:2px;margin-bottom:4px;letter-spacing:0.5px;">Experience</div>
              <div style="font-size:7.5px;font-weight:700;color:#0f172a;">${title} &mdash; Prime Corp</div>
              <div style="font-size:6.5px;color:#475569;line-height:1.35;margin-top:2px;">• Spearheaded core operational transformation programs<br/>• Boosted workflow efficiency and ROI by 28%</div>
            </div>
            <div style="font-size:6.5px;color:#64748b;font-weight:600;">Key Strengths: Scalability &bull; Strategic Vision</div>
          </div>

          <div style="width:36%;border-left:1px solid #e4e4e7;padding-left:10px;display:flex;flex-direction:column;justify-content:space-between;">
            <div>
              <div style="font-size:7.5px;font-weight:800;text-transform:uppercase;color:#18181b;border-bottom:1.5px solid #18181b;padding-bottom:2px;margin-bottom:4px;letter-spacing:0.5px;">Skills</div>
              <div style="font-size:6.5px;color:#334155;line-height:1.45;margin-bottom:8px;">• Strategy Roadmap<br/>• Workflow Tuning<br/>• Team Mentorship<br/>• Data Analysis</div>

              <div style="font-size:7.5px;font-weight:800;text-transform:uppercase;color:#18181b;border-bottom:1.5px solid #18181b;padding-bottom:2px;margin-bottom:4px;letter-spacing:0.5px;">Education</div>
              <div style="font-size:6.5px;color:#0f172a;font-weight:700;">Bachelor of Science</div>
              <div style="font-size:6px;color:#71717a;">State University &bull; Honors</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ── Layout 4: Soft Blue Right Sidebar (Morgan Connors style) ───────
  if (t.layoutFamily === "right-sidebar") {
    return `
      <div style="font-family:${fontFamily};background:#ffffff;display:flex;width:100%;height:100%;box-sizing:border-box;color:#0f172a;overflow:hidden;">
        <!-- Left Main Content (Wide) -->
        <div style="flex:1;padding:12px 14px;display:flex;flex-direction:column;justify-content:space-between;box-sizing:border-box;">
          <div>
            <div style="font-size:12px;font-weight:900;color:#0f172a;letter-spacing:0.3px;">${name}</div>
            <div style="font-size:8px;color:${accent};font-weight:700;margin-top:1px;margin-bottom:8px;">${title}</div>

            <div style="font-size:7.5px;font-weight:800;text-transform:uppercase;color:${accent};border-bottom:1.5px solid #cbd5e1;padding-bottom:2px;margin-bottom:4px;letter-spacing:0.5px;">Professional Summary</div>
            <div style="font-size:6.5px;color:#334155;line-height:1.4;margin-bottom:8px;">Proven track record in optimizing enterprise workflows, driving cross-functional projects, and aligning technical milestones with core business strategy.</div>

            <div style="font-size:7.5px;font-weight:800;text-transform:uppercase;color:${accent};border-bottom:1.5px solid #cbd5e1;padding-bottom:2px;margin-bottom:4px;letter-spacing:0.5px;">Work Experience</div>
            <div style="margin-bottom:6px;">
              <div style="font-size:7.5px;font-weight:700;color:#0f172a;">${title} &mdash; Global Co <span style="float:right;color:#64748b;font-size:6.5px;">2021–Now</span></div>
              <div style="font-size:6.5px;color:#475569;line-height:1.35;margin-top:2px;">• Led strategic operational improvements delivering quantifiable impact<br/>• Streamlined team throughput and reduced turnaround time by 30%</div>
            </div>
          </div>
          <div style="border-top:1px solid #e2e8f0;padding-top:4px;">
            <div style="font-size:6.5px;color:#64748b;font-weight:600;">Core Domain: Enterprise Agility &bull; Product Execution</div>
          </div>
        </div>

        <!-- Right Tinted Sidebar -->
        <div style="width:36%;background:${sidebarBg};padding:12px 10px;border-left:1.5px solid #dbeafe;display:flex;flex-direction:column;justify-content:space-between;box-sizing:border-box;">
          <div>
            <div style="font-size:7.5px;font-weight:800;text-transform:uppercase;color:${accent};margin-bottom:3px;letter-spacing:0.5px;">Contact</div>
            <div style="font-size:6.5px;color:#334155;line-height:1.45;margin-bottom:10px;">${location}<br/>${email}</div>

            <div style="font-size:7.5px;font-weight:800;text-transform:uppercase;color:${accent};margin-bottom:3px;letter-spacing:0.5px;">Core Skills</div>
            <div style="font-size:6.5px;color:#334155;line-height:1.45;margin-bottom:10px;">• Strategic Ops<br/>• Technical Mgmt<br/>• Data Analytics<br/>• Cross-Team Lead</div>

            <div style="font-size:7.5px;font-weight:800;text-transform:uppercase;color:${accent};margin-bottom:3px;letter-spacing:0.5px;">Education</div>
            <div style="font-size:6.5px;color:#0f172a;font-weight:700;">Bachelor's Degree</div>
            <div style="font-size:6px;color:#64748b;">University Graduate</div>
          </div>
        </div>
      </div>
    `;
  }

  // ── Layout 5: Jacob Red Circle Badge ──────────────────────────────
  if (t.layoutFamily === "badge-executive") {
    return `
      <div style="font-family:${fontFamily};background:#ffffff;padding:12px 14px;width:100%;height:100%;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden;">
        <div>
          <!-- Header with Red Circle Badge -->
          <div style="display:flex;align-items:center;gap:8px;border-bottom:2px solid ${accent};padding-bottom:8px;margin-bottom:8px;">
            <div style="width:18px;height:18px;border-radius:50%;background:${accent};flex-shrink:0;"></div>
            <div>
              <div style="font-size:12px;font-weight:800;color:#0f172a;letter-spacing:0.5px;text-transform:uppercase;">${name}</div>
              <div style="font-size:7.5px;color:${accent};font-weight:600;">${title} &bull; ${location} &bull; ${email}</div>
            </div>
          </div>

          <div style="font-size:7.5px;font-weight:800;color:${accent};text-transform:uppercase;margin-bottom:3px;letter-spacing:0.5px;">Objective &amp; Executive Summary</div>
          <div style="font-size:6.5px;color:#334155;line-height:1.4;margin-bottom:8px;">Dedicated executive specialist focused on driving scalable enterprise solutions, building high-performing teams, and optimizing operational productivity.</div>

          <div style="font-size:7.5px;font-weight:800;color:${accent};text-transform:uppercase;margin-bottom:3px;letter-spacing:0.5px;">Professional Experience</div>
          <div style="margin-bottom:6px;">
            <div style="font-size:7.5px;font-weight:700;color:#0f172a;">${title} — Industry Lead <span style="float:right;color:#64748b;font-size:6.5px;">2020–Present</span></div>
            <div style="font-size:6.5px;color:#475569;line-height:1.35;margin-top:2px;">• Managed mission-critical roadmaps with 99.8% on-time milestone delivery<br/>• Coordinated cross-functional departments to maximize organizational output</div>
          </div>
        </div>

        <div style="border-top:1px solid #e2e8f0;padding-top:6px;display:flex;justify-content:space-between;">
          <div style="font-size:6.5px;color:#0f172a;font-weight:700;">Education: Bachelor of Science Degree</div>
          <div style="font-size:6.5px;color:${accent};font-weight:700;">Skills: Strategy &bull; Leadership &bull; Execution</div>
        </div>
      </div>
    `;
  }

  // ── Layout 6: Warm Sand Editorial (Kai Carter Beige) ───────────────
  if (t.layoutFamily === "warm-sand-split") {
    return `
      <div style="font-family:${fontFamily};background:#f8f3ed;padding:12px 14px;width:100%;height:100%;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;color:#292524;overflow:hidden;">
        <div>
          <div style="text-align:center;border-bottom:1.5px solid #d7c9b8;padding-bottom:8px;margin-bottom:8px;">
            <div style="font-size:12px;font-weight:900;letter-spacing:0.5px;color:#292524;">${name}</div>
            <div style="font-size:7.5px;color:${accent};text-transform:uppercase;letter-spacing:0.5px;font-weight:700;margin-top:1px;">${title}</div>
            <div style="font-size:6.5px;color:#78716c;margin-top:2px;">${location} &bull; ${email}</div>
          </div>

          <div style="display:flex;gap:12px;">
            <div style="width:38%;">
              <div style="font-size:7.5px;font-weight:700;color:#292524;text-transform:uppercase;border-bottom:1px solid #d7c9b8;padding-bottom:1px;margin-bottom:4px;">Skills</div>
              <div style="font-size:6.5px;color:#57534e;line-height:1.45;margin-bottom:8px;">• Strategic Roadmap<br/>• Risk Optimization<br/>• Stakeholder Relations<br/>• Team Performance</div>

              <div style="font-size:7.5px;font-weight:700;color:#292524;text-transform:uppercase;border-bottom:1px solid #d7c9b8;padding-bottom:1px;margin-bottom:4px;">Education</div>
              <div style="font-size:6.5px;color:#292524;font-weight:700;">University College</div>
              <div style="font-size:6px;color:#78716c;">Bachelor's Degree</div>
            </div>

            <div style="flex:1;">
              <div style="font-size:7.5px;font-weight:700;color:#292524;text-transform:uppercase;border-bottom:1px solid #d7c9b8;padding-bottom:1px;margin-bottom:4px;">Work Experience</div>
              <div style="font-size:7.5px;font-weight:700;color:#292524;">${title} &mdash; Global Solutions</div>
              <div style="font-size:6.5px;color:#57534e;line-height:1.35;margin-top:2px;">• Led core strategic roadmap and improved departmental workflow throughput by 24%<br/>• Managed client engagements and delivered superior satisfaction</div>
            </div>
          </div>
        </div>

        <div style="border-top:1px solid #d7c9b8;padding-top:4px;font-size:6px;color:#78716c;text-align:center;">
          Editorial Format &bull; Executive Presentation &bull; ATS Ready
        </div>
      </div>
    `;
  }

  // ── Layout 7: Teal Card Header (Taylor Phillips style) ────────────
  if (t.layoutFamily === "header-card-split") {
    return `
      <div style="font-family:${fontFamily};background:#ffffff;display:flex;flex-direction:column;width:100%;height:100%;box-sizing:border-box;overflow:hidden;">
        <!-- Top Teal Card -->
        <div style="background:#0d9488;color:#ffffff;padding:12px 14px;box-sizing:border-box;">
          <div style="font-size:12px;font-weight:900;letter-spacing:0.5px;">${name}</div>
          <div style="font-size:7.5px;opacity:0.95;margin-top:2px;">${title} &bull; ${location} &bull; ${email}</div>
        </div>

        <!-- Body -->
        <div style="padding:12px 14px;flex:1;display:flex;flex-direction:column;justify-content:space-between;box-sizing:border-box;">
          <div>
            <div style="font-size:7.5px;font-weight:800;color:#0d9488;text-transform:uppercase;border-bottom:1.5px solid #0d9488;padding-bottom:2px;margin-bottom:4px;letter-spacing:0.5px;">Experience</div>
            <div style="margin-bottom:6px;">
              <div style="font-size:7.5px;font-weight:700;color:#0f172a;">${title} &mdash; Lead Org <span style="float:right;color:#64748b;font-size:6.5px;">2021–Now</span></div>
              <div style="font-size:6.5px;color:#334155;line-height:1.35;margin-top:2px;">• Managed end-to-end deliverables and engineered automated workflows<br/>• Reduced processing bottlenecks and improved turnaround by 25%</div>
            </div>

            <div style="font-size:7.5px;font-weight:800;color:#0d9488;text-transform:uppercase;border-bottom:1.5px solid #0d9488;padding-bottom:2px;margin-bottom:5px;letter-spacing:0.5px;">Core Competencies</div>
            <div style="display:flex;gap:4px;flex-wrap:wrap;">
              <span style="background:#ccfbf1;color:#0f766e;font-size:6.5px;font-weight:600;padding:2px 6px;border-radius:3px;">Strategy</span>
              <span style="background:#ccfbf1;color:#0f766e;font-size:6.5px;font-weight:600;padding:2px 6px;border-radius:3px;">Operations</span>
              <span style="background:#ccfbf1;color:#0f766e;font-size:6.5px;font-weight:600;padding:2px 6px;border-radius:3px;">Leadership</span>
              <span style="background:#ccfbf1;color:#0f766e;font-size:6.5px;font-weight:600;padding:2px 6px;border-radius:3px;">Analytics</span>
            </div>
          </div>

          <div style="border-top:1px solid #ccfbf1;padding-top:4px;font-size:6.5px;color:#0f766e;font-weight:600;">
            Education: Bachelor's Degree &bull; Certified Professional
          </div>
        </div>
      </div>
    `;
  }

  // ── Layout 8: Tonnie Purple Boxed ─────────────────────────────────
  if (t.layoutFamily === "boxed-sidebar") {
    return `
      <div style="font-family:${fontFamily};background:#ffffff;padding:12px 14px;width:100%;height:100%;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden;">
        <div>
          <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid ${accent};padding-bottom:6px;margin-bottom:8px;">
            <div>
              <div style="font-size:12px;font-weight:900;color:${accent};">${name}</div>
              <div style="font-size:7.5px;color:#64748b;font-weight:600;">${title}</div>
            </div>
            <div style="font-size:12px;color:${accent};">★★</div>
          </div>

          <div style="display:flex;gap:10px;">
            <div style="width:38%;border:1px solid #e9d5ff;background:#faf5ff;padding:8px;border-radius:5px;">
              <div style="font-size:7px;font-weight:800;color:${accent};text-transform:uppercase;margin-bottom:3px;">Contact</div>
              <div style="font-size:6.5px;color:#581c87;line-height:1.4;margin-bottom:6px;">${location}<br/>${email}</div>
              <div style="font-size:7px;font-weight:800;color:${accent};text-transform:uppercase;margin-bottom:3px;">Key Skills</div>
              <div style="font-size:6.5px;color:#581c87;line-height:1.4;">• Ops &amp; Scale<br/>• Quality Mgmt<br/>• Project Lead</div>
            </div>

            <div style="flex:1;">
              <div style="font-size:7.5px;font-weight:800;color:${accent};text-transform:uppercase;margin-bottom:3px;">Experience</div>
              <div style="font-size:7.5px;font-weight:700;color:#0f172a;">${title} — Prime Corp</div>
              <div style="font-size:6.5px;color:#475569;line-height:1.35;margin-top:2px;">• Scaled operations by 35% while maintaining compliance standards<br/>• Championed efficiency across multiple teams</div>
            </div>
          </div>
        </div>

        <div style="border-top:1px solid #f3e8ff;padding-top:4px;font-size:6.5px;color:#7c3aed;font-weight:600;">
          Education: Degree in Discipline &bull; Academic Honors
        </div>
      </div>
    `;
  }

  // ── Layout 9: Timeline Rail (Liidia Peetre) ───────────────────────
  if (t.layoutFamily === "timeline-rail") {
    return `
      <div style="font-family:${fontFamily};background:#ffffff;padding:12px 14px;width:100%;height:100%;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;color:#0f172a;overflow:hidden;">
        <div>
          <div style="display:flex;justify-content:space-between;align-items:baseline;border-bottom:2px solid #0f172a;padding-bottom:6px;margin-bottom:8px;">
            <div style="font-size:12px;font-weight:900;color:#0f172a;">${name}</div>
            <div style="font-size:7.5px;color:#64748b;font-weight:600;">${title}</div>
          </div>

          <div style="font-size:7.5px;font-weight:800;text-transform:uppercase;color:#0f172a;margin-bottom:6px;letter-spacing:0.5px;">Experience Timeline</div>
          
          <div style="display:flex;gap:8px;margin-bottom:8px;">
            <div style="font-size:6.5px;color:#64748b;font-weight:700;width:30%;">2021 &mdash; PRESENT</div>
            <div style="flex:1;border-left:2px solid #cbd5e1;padding-left:8px;">
              <div style="font-size:7.5px;font-weight:700;color:#0f172a;">${title} &bull; Enterprise</div>
              <div style="font-size:6.5px;color:#334155;line-height:1.35;margin-top:1px;">• Orchestrated key technical implementations with high system reliability</div>
            </div>
          </div>

          <div style="display:flex;gap:8px;">
            <div style="font-size:6.5px;color:#64748b;font-weight:700;width:30%;">2018 &mdash; 2021</div>
            <div style="flex:1;border-left:2px solid #cbd5e1;padding-left:8px;">
              <div style="font-size:7.5px;font-weight:700;color:#0f172a;">Associate Lead &bull; Technology Inc</div>
              <div style="font-size:6.5px;color:#334155;line-height:1.35;margin-top:1px;">• Built core systems &amp; streamlined operational automation</div>
            </div>
          </div>
        </div>

        <div style="border-top:1px solid #e2e8f0;padding-top:4px;display:flex;justify-content:space-between;font-size:6.5px;color:#64748b;font-weight:600;">
          <span>BSc Engineering Degree</span>
          <span>Core: Systems &bull; Architecture</span>
        </div>
      </div>
    `;
  }

  // ── Layout 10: Soft Lilac Banner (Janna Gardner) ───────────────────
  if (t.layoutFamily === "soft-banner") {
    return `
      <div style="font-family:${fontFamily};background:#ffffff;display:flex;flex-direction:column;width:100%;height:100%;box-sizing:border-box;overflow:hidden;">
        <!-- Soft Lilac Top Banner -->
        <div style="background:#ede9fe;text-align:center;padding:10px 14px;border-bottom:1.5px solid #ddd6fe;">
          <div style="font-size:12px;font-weight:800;color:#5b21b6;letter-spacing:0.3px;">${name}</div>
          <div style="font-size:7px;color:#6b21a8;margin-top:2px;">${title} &bull; ${location} &bull; ${email}</div>
        </div>

        <div style="padding:12px 14px;flex:1;display:flex;flex-direction:column;justify-content:space-between;box-sizing:border-box;">
          <div>
            <div style="font-size:7.5px;font-weight:700;text-transform:uppercase;color:#5b21b6;border-bottom:1px solid #ddd6fe;padding-bottom:2px;margin-bottom:4px;">Executive Summary</div>
            <div style="font-size:6.5px;color:#475569;line-height:1.4;margin-bottom:8px;">Accomplished professional with exceptional track record in driving measurable business outcomes and cultivating strategic partnerships.</div>

            <div style="font-size:7.5px;font-weight:700;text-transform:uppercase;color:#5b21b6;border-bottom:1px solid #ddd6fe;padding-bottom:2px;margin-bottom:4px;">Experience</div>
            <div style="font-size:7.5px;font-weight:700;color:#0f172a;">${title} — Senior Associate <span style="float:right;color:#64748b;font-size:6.5px;">2021–Now</span></div>
            <div style="font-size:6.5px;color:#334155;line-height:1.35;margin-top:2px;">• Spearheaded key deliverables with quantifiable metrics and operational excellence</div>
          </div>

          <div style="border-top:1px solid #ede9fe;padding-top:4px;font-size:6.5px;color:#5b21b6;font-weight:600;">
            Education: Degree in Field &bull; Continuous Leadership Certifications
          </div>
        </div>
      </div>
    `;
  }

  // ── Layout 11 / 12: Editorial Minimal Serif / Clean Minimal ATS ────
  return `
    <div style="font-family:${fontFamily};background:#ffffff;padding:12px 14px;width:100%;height:100%;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;color:#0f172a;overflow:hidden;">
      <div>
        <div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2px solid #0f172a;padding-bottom:6px;margin-bottom:8px;">
          <div>
            <div style="font-size:13px;font-weight:900;color:#0f172a;letter-spacing:0.3px;">${name}</div>
            <div style="font-size:7.5px;color:#475569;text-transform:uppercase;font-weight:600;margin-top:1px;">${title}</div>
          </div>
          <div style="text-align:right;font-size:6.5px;color:#64748b;line-height:1.3;">
            ${location}<br/>${email}
          </div>
        </div>

        <div style="font-size:7.5px;font-weight:800;text-transform:uppercase;color:#0f172a;margin-bottom:3px;letter-spacing:0.5px;">Executive Summary</div>
        <div style="font-size:6.5px;color:#334155;line-height:1.4;margin-bottom:8px;">Results-oriented professional with proven expertise in executing strategic initiatives, managing key stakeholders, and optimizing organizational performance.</div>

        <div style="font-size:7.5px;font-weight:800;text-transform:uppercase;color:#0f172a;margin-bottom:3px;letter-spacing:0.5px;">Professional Experience</div>
        <div style="margin-bottom:6px;">
          <div style="font-size:7.5px;font-weight:700;color:#0f172a;">${title} &mdash; Global Solutions <span style="float:right;color:#64748b;font-size:6.5px;">2020–Present</span></div>
          <div style="font-size:6.5px;color:#334155;line-height:1.35;margin-top:2px;">• Delivered measurable operational enhancements and team success<br/>• Streamlined cross-functional workflows and reduced deliverable cycle time</div>
        </div>
      </div>

      <div style="border-top:1px solid #e2e8f0;padding-top:4px;display:flex;justify-content:space-between;font-size:6.5px;color:#64748b;font-weight:600;">
        <span>Education: Bachelor's Degree</span>
        <span>Key Skills: Strategy &bull; Leadership &bull; Operations</span>
      </div>
    </div>
  `;
}
