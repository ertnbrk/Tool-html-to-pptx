import puppeteer from "puppeteer";
import PptxGenJS from "pptxgenjs";
import fs from "fs";
import path from "path";

const HTML_DIR = "./html";
const TEMP_DIR = "./temp";
const OUTPUT_DIR = "./output";
const VIEWPORT_WIDTH = 1280;
const VIEWPORT_HEIGHT = 720;
const RENDER_DELAY_MS = 800;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function ensureRequiredDirs() {
  ensureDir(TEMP_DIR);
  ensureDir(OUTPUT_DIR);
}

function getSortedHtmlFiles() {
  return fs
    .readdirSync(HTML_DIR)
    .filter((file) => file.toLowerCase().endsWith(".html"))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] ?? "0", 10);
      const numB = parseInt(b.match(/\d+/)?.[0] ?? "0", 10);
      return numA - numB;
    });
}

async function generate() {
  ensureRequiredDirs();

  const files = getSortedHtmlFiles();

  if (files.length === 0) {
    throw new Error(`No HTML files found in "${HTML_DIR}"`);
  }

  console.log("📊 Slides:", files);

  const browser = await puppeteer.launch({
    headless: true,
  });

  try {
    const page = await browser.newPage();

    await page.setViewport({
      width: VIEWPORT_WIDTH,
      height: VIEWPORT_HEIGHT,
      deviceScaleFactor: 1,
    });

    const pptx = new PptxGenJS();
    pptx.layout = "LAYOUT_WIDE";

    for (let i = 0; i < files.length; i++) {
      const fileName = files[i];
      const filePath = `file://${path.resolve(HTML_DIR, fileName)}`;
      const tempImagePath = path.join(TEMP_DIR, `slide_${i + 1}.png`);

      console.log(`➡️ Rendering ${fileName}`);

      await page.goto(filePath, {
        waitUntil: "networkidle0",
      });

      await page.waitForSelector("body");
      await sleep(RENDER_DELAY_MS);

      await page.screenshot({
        path: tempImagePath,
        fullPage: false,
      });

      const slide = pptx.addSlide();
      slide.addImage({
        path: tempImagePath,
        x: 0,
        y: 0,
        w: 13.333,
        h: 7.5,
      });
    }

    const outputPath = path.join(OUTPUT_DIR, "presentation.pptx");
    await pptx.writeFile({ fileName: outputPath });

    console.log(`✅ DONE → ${outputPath}`);
  } finally {
    await browser.close();
  }
}

generate().catch((error) => {
  console.error("❌ Generation failed:");
  console.error(error);
  process.exit(1);
});