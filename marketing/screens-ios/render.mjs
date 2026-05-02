// Render six App Store screenshots from template.html + the source iPhone shots.
// Output: marketing/screens-ios/01.png … 06.png at 1242×2688.
//
// Usage: node marketing/screens-ios/render.mjs

import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SCREENS = [
  { file: "01.png", image: "01.png", title: "Pin the feeds you care about" },
  { file: "02.png", image: "02.png", title: "See the camera behind every shot" },
  { file: "03.png", image: "03.png", title: "Group your photos into galleries" },
  { file: "04.png", image: "04.png", title: "Share moments for the day" },
  { file: "05.png", image: "05.png", title: "Find your photo people" },
  { file: "06.png", image: "06.png", title: "Keep up with the activity" },
];

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1242, height: 2688 },
  deviceScaleFactor: 1,
});
const page = await context.newPage();

const baseDir = path.resolve(__dirname);
const templateUrl = `file://${path.join(baseDir, "template.html")}`;

await page.goto(templateUrl, { waitUntil: "domcontentloaded" });

for (const s of SCREENS) {
  const sourceUrl = `file://${path.join(baseDir, "source", s.image)}`;
  console.log(`→ ${s.file}: ${s.title}`);
  await page.evaluate(
    ({ title, image }) =>
      new Promise((resolve) => {
        document.getElementById("title").textContent = title;
        const img = document.getElementById("device");
        if (img.src === image && img.complete) return resolve();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = image;
      }),
    { title: s.title, image: sourceUrl },
  );
  await page.waitForTimeout(200);
  await page.screenshot({
    path: path.join(baseDir, s.file),
    fullPage: false,
  });
}

await browser.close();
console.log(`Done — ${SCREENS.length} screens rendered to ${baseDir}`);
