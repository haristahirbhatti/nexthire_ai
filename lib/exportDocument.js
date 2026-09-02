/**
 * NextHire.ai Document Exporter
 * Generates Microsoft Word (.doc/.docx) and PDF (.pdf) documents natively in browser
 */

export function downloadWordDocument(pkg) {
  const name = pkg?.personalInfo?.fullName || "Candidate";
  const title = pkg?.personalInfo?.targetTitle || "Professional";
  const email = pkg?.personalInfo?.email || "";
  const phone = pkg?.personalInfo?.phone || "";
  const location = pkg?.personalInfo?.location || "";
  const summary = pkg?.summary || "";
  const skills = pkg?.skills || [];
  const experience = pkg?.experience || [];
  const education = pkg?.education || [];
  const coverLetter = pkg?.coverLetter || {};

  const htmlContent = `
    <html xmlns:o='urn:schemas-microsoft-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${name} - ATS Resume</title>
      <style>
        body { font-family: 'Calibri', 'Arial', sans-serif; font-size: 11pt; line-height: 1.45; color: #111111; margin: 1in; }
        h1 { font-size: 22pt; margin-bottom: 2pt; color: #111111; font-weight: bold; text-transform: uppercase; }
        .subtitle { font-size: 12pt; color: #B8922A; font-weight: bold; margin-bottom: 6pt; }
        .contact { font-size: 10pt; color: #555555; margin-bottom: 16pt; border-bottom: 1.5pt solid #333333; padding-bottom: 6pt; }
        h2 { font-size: 12pt; text-transform: uppercase; border-bottom: 1pt solid #cccccc; padding-bottom: 2pt; margin-top: 14pt; margin-bottom: 6pt; color: #222222; font-weight: bold; }
        p { margin: 0 0 6pt 0; }
        ul { margin: 4pt 0 10pt 18pt; padding: 0; }
        li { margin-bottom: 4pt; }
        .job-title { font-weight: bold; font-size: 11pt; color: #111111; }
        .company { font-style: italic; color: #444444; }
        .period { float: right; font-weight: bold; color: #555555; }
        .skills-list { font-weight: bold; color: #222222; }
        .page-break { page-break-before: always; margin-top: 30pt; }
      </style>
    </head>
    <body>
      <h1>${name}</h1>
      <div class="subtitle">${title}</div>
      <div class="contact">${location} | ${phone} | ${email}</div>

      <h2>Professional Summary</h2>
      <p>${summary}</p>

      <h2>Core Competencies & Skills</h2>
      <p class="skills-list">${skills.join(" • ")}</p>

      <h2>Work Experience</h2>
      ${experience.map(exp => `
        <p><span class="job-title">${exp.role}</span> — <span class="company">${exp.company}</span> <span class="period">${exp.period}</span></p>
        <ul>
          ${(exp.highlights || []).map(h => `<li>${h}</li>`).join("")}
        </ul>
      `).join("")}

      <h2>Education</h2>
      ${education.map(edu => `
        <p><strong>${edu.degree}</strong> — ${edu.institution} (${edu.year})</p>
      `).join("")}

      ${coverLetter.body ? `
        <div class="page-break"></div>
        <h1>Cover Letter</h1>
        <div class="contact">${name} | ${email}</div>
        <p style="margin-top:20pt;"><strong>${coverLetter.greeting || "Dear Hiring Manager,"}</strong></p>
        <p style="white-space: pre-line; line-height: 1.6;">${coverLetter.body}</p>
        <p style="margin-top:20pt;">${coverLetter.signOff || "Sincerely,\n" + name}</p>
      ` : ""}
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff' + htmlContent], {
    type: 'application/msword'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name.replace(/\s+/g, '_')}_ATS_Resume.doc`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadPDFDocument(pkg) {
  const name = pkg?.personalInfo?.fullName || "Candidate";
  const title = pkg?.personalInfo?.targetTitle || "Professional";
  const email = pkg?.personalInfo?.email || "";
  const phone = pkg?.personalInfo?.phone || "";
  const location = pkg?.personalInfo?.location || "";
  const summary = pkg?.summary || "";
  const skills = pkg?.skills || [];
  const experience = pkg?.experience || [];
  const education = pkg?.education || [];
  const coverLetter = pkg?.coverLetter || {};

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${name} - ATS Resume</title>
      <style>
        @page { size: A4; margin: 15mm; }
        body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 10pt; line-height: 1.45; color: #111; margin: 0; padding: 20px; }
        h1 { font-size: 20pt; margin: 0 0 4px 0; color: #111; font-weight: 700; text-transform: uppercase; }
        .subtitle { font-size: 11pt; color: #B8922A; font-weight: 600; margin-bottom: 6px; }
        .contact { font-size: 9.5pt; color: #555; margin-bottom: 14px; border-bottom: 2px solid #111; padding-bottom: 6px; }
        h2 { font-size: 11pt; text-transform: uppercase; border-bottom: 1px solid #ddd; padding-bottom: 3px; margin-top: 14px; margin-bottom: 6px; color: #111; font-weight: 700; }
        p { margin: 0 0 6px 0; }
        ul { margin: 4px 0 10px 18px; padding: 0; }
        li { margin-bottom: 3px; }
        .job-hdr { font-weight: 700; font-size: 10.5pt; color: #111; }
        .company { font-style: italic; color: #444; }
        .period { float: right; font-weight: 600; color: #555; }
        .skills-grid { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 10px; }
        .skill-tag { background: #f0f0f0; border: 1px solid #ddd; border-radius: 3px; padding: 2px 7px; font-size: 8.5pt; font-weight: 600; color: #333; }
        @media print {
          body { padding: 0; }
        }
      </style>
    </head>
    <body>
      <h1>${name}</h1>
      <div class="subtitle">${title}</div>
      <div class="contact">${location} &bull; ${phone} &bull; ${email}</div>

      <h2>Professional Summary</h2>
      <p>${summary}</p>

      <h2>Core Competencies & Skills</h2>
      <div class="skills-grid">
        ${skills.map(s => `<span class="skill-tag">${s}</span>`).join("")}
      </div>

      <h2>Professional Experience</h2>
      ${experience.map(exp => `
        <div style="margin-bottom: 10px;">
          <div class="job-hdr">
            <span>${exp.role} &mdash; <span class="company">${exp.company}</span></span>
            <span class="period">${exp.period}</span>
          </div>
          <ul>
            ${(exp.highlights || []).map(h => `<li>${h}</li>`).join("")}
          </ul>
        </div>
      `).join("")}

      <h2>Education</h2>
      ${education.map(edu => `
        <p><strong>${edu.degree}</strong> &mdash; ${edu.institution} (${edu.year})</p>
      `).join("")}

      ${coverLetter.body ? `
        <div style="page-break-before: always; padding-top: 20px;">
          <h2>Cover Letter</h2>
          <p><strong>${coverLetter.greeting || "Dear Hiring Manager,"}</strong></p>
          <p style="white-space: pre-line; line-height: 1.6;">${coverLetter.body}</p>
          <p style="margin-top: 24px;">${coverLetter.signOff || "Sincerely,\n" + name}</p>
        </div>
      ` : ""}
    </body>
    </html>
  `;

  // Create hidden iframe for direct print/PDF save without popup blockers
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(htmlContent);
  doc.close();

  iframe.contentWindow.focus();
  setTimeout(() => {
    iframe.contentWindow.print();
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 1500);
  }, 300);
}
