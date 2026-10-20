// Builds the ATS-friendly resume PDFs into public/resume from resume-data.mjs.
// Single column, real selectable text, standard section headings, no header/footer,
// no icons or tables, links written out in full. Uses the system Edge via Playwright.
//
//   node scripts/resume/build-resume.mjs
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { resumes } from "./resume-data.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const outDir = path.join(root, "public", "resume");

const escape = (value) =>
  String(value).replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[char]);

const link = (text) => `<a href="https://${escape(text)}">${escape(text)}</a>`;

function render(data) {
  const { contact, labels } = data;
  const experience = data.experience
    .map(
      (job) => `
      <article class="job">
        <h3 class="job__head">${escape(job.role)} - ${escape(job.company)} <span class="job__period">| ${escape(job.period)}</span></h3>
        <p class="job__context">${escape(job.context)}</p>
        <ul>${job.bullets.map((bullet) => `<li>${escape(bullet)}</li>`).join("")}</ul>
        <p class="job__tech"><strong>${escape(labels.tech)}:</strong> ${escape(job.tech)}</p>
      </article>`,
    )
    .join("");

  return `<!doctype html>
<html lang="${data.lang}">
<head>
<meta charset="utf-8">
<title>${escape(data.title)}</title>
<meta name="author" content="${escape(contact.name)}">
<meta name="keywords" content="${escape(data.skills.map(([, items]) => items).join(", "))}">
<style>
  @page { size: A4; margin: 11mm 14mm 10mm; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { color: #111; font: 9pt/1.32 Arial, Helvetica, sans-serif; }
  a { color: inherit; text-decoration: none; }
  header { padding-bottom: 6pt; border-bottom: 1.4pt solid #111; }
  h1 { font-size: 19pt; letter-spacing: 0.02em; line-height: 1.1; text-transform: uppercase; }
  .headline { margin-top: 1pt; color: #8a5a00; font-size: 11pt; font-weight: 700; }
  .contact { margin-top: 2pt; color: #333; font-size: 8.5pt; }
  section { margin-top: 7pt; }
  h2 { margin-bottom: 3pt; padding-bottom: 1.5pt; border-bottom: 0.6pt solid #b9b9b9; font-size: 9.5pt; letter-spacing: 0.06em; text-transform: uppercase; }
  .job + .job { margin-top: 5pt; }
  .job__head { font-size: 9.4pt; }
  .job__period { color: #8a5a00; }
  .job__context { color: #444; font-size: 8.5pt; }
  ul { margin: 1pt 0 0 12pt; }
  li { margin-top: 0.5pt; padding-left: 1pt; }
  .job__tech { margin-top: 1pt; color: #333; font-size: 8.5pt; }
  .skills p + p { margin-top: 0.5pt; }
  .edu p + p { margin-top: 0.5pt; }
</style>
</head>
<body>
  <header>
    <h1>${escape(contact.name)}</h1>
    <p class="headline">${escape(data.headline)}</p>
    <p class="contact">${escape(contact.location)} | ${escape(contact.phone)} | <a href="mailto:${escape(contact.email)}">${escape(contact.email)}</a> | ${link(contact.website)}</p>
    <p class="contact">${link(contact.linkedin)} | ${link(contact.github)}</p>
  </header>

  <section>
    <h2>${escape(labels.summary)}</h2>
    <p>${escape(data.summary)}</p>
  </section>

  <section>
    <h2>${escape(labels.experience)}</h2>
    ${experience}
  </section>

  <section class="skills">
    <h2>${escape(labels.skills)}</h2>
    ${data.skills.map(([group, items]) => `<p><strong>${escape(group)}:</strong> ${escape(items)}</p>`).join("")}
  </section>

  <section>
    <h2>${escape(labels.publication)}</h2>
    <p><strong>${escape(data.publication.title)}:</strong> ${escape(data.publication.text)} ${link(data.publication.link)}</p>
  </section>

  <section class="edu">
    <h2>${escape(labels.education)}</h2>
    ${data.education.map(([degree, school, period]) => `<p><strong>${escape(degree)}</strong> - ${escape(school)} | ${escape(period)}</p>`).join("")}
  </section>

  <section>
    <h2>${escape(labels.languages)}</h2>
    <p>${escape(data.languages)}</p>
  </section>
</body>
</html>`;
}

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL ?? "msedge" });
for (const data of Object.values(resumes)) {
  const page = await browser.newPage();
  await page.setContent(render(data), { waitUntil: "load" });
    const file = path.join(outDir, data.file);
  await page.pdf({ path: file, format: "A4", printBackground: true, preferCSSPageSize: true, tagged: true, outline: true });
  console.log(data.file);
  await page.close();
}
await browser.close();
