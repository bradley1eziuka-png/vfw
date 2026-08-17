// Usage: node screenshot.mjs <url> [label] [--width=1440] [--height=900] [--mobile]
// Saves to ./temporary screenshots/screenshot-N[-label].png (auto-incremented)
//
// Captures the page in viewport-sized segments while scrolling, then stitches
// them into one image with sharp, rather than using Puppeteer's built-in
// fullPage/tall-viewport capture. This headless Chrome build has a paint
// artifact where full-page (or resized-to-full-height) captures of tall
// pages ghost stray fragments of lower content near the top of the image;
// normal-viewport-sized captures render cleanly, so segmenting sidesteps it.
import puppeteer from "puppeteer";
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const url = args.find((a) => !a.startsWith("--")) || "http://localhost:3000";
const label = args.filter((a) => !a.startsWith("--"))[1] || "";
const mobile = args.includes("--mobile");
const widthArg = args.find((a) => a.startsWith("--width="));
const heightArg = args.find((a) => a.startsWith("--height="));

const width = widthArg ? parseInt(widthArg.split("=")[1], 10) : mobile ? 390 : 1440;
const height = heightArg ? parseInt(heightArg.split("=")[1], 10) : mobile ? 844 : 900;

const dir = path.join(process.cwd(), "temporary screenshots");
fs.mkdirSync(dir, { recursive: true });

const existing = fs.readdirSync(dir).filter((f) => /^screenshot-\d+/.test(f));
const nextNum =
  existing.reduce((max, f) => {
    const m = f.match(/^screenshot-(\d+)/);
    return m ? Math.max(max, parseInt(m[1], 10)) : max;
  }, 0) + 1;

const filename = `screenshot-${nextNum}${label ? `-${label}` : ""}.png`;
const filepath = path.join(dir, filename);

const browser = await puppeteer.launch({ headless: "new" });
try {
  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });

  // Freeze scroll-reveal animations to their settled state and unstick the
  // header so segments don't each carry a duplicate copy of it.
  await page.addStyleTag({
    content: `
      .site-header { position: static !important; }
      *, *::before, *::after { transition: none !important; animation: none !important; }
      [data-reveal] { opacity: 1 !important; transform: none !important; }
    `,
  });

  const totalHeight = Math.round(await page.evaluate(() => document.body.scrollHeight));

  const segments = [];
  let y = 0;
  while (true) {
    await page.evaluate((y) => window.scrollTo({ top: y, left: 0, behavior: "instant" }), y);
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    await new Promise((r) => setTimeout(r, 250));
    const actualY = Math.round(await page.evaluate(() => window.scrollY));
    const buffer = await page.screenshot({ encoding: "binary" });
    segments.push({ buffer, top: actualY });
    if (actualY + height >= totalHeight) break;
    y += height;
  }

  // sharp's composite() intermittently bleeds a misplaced fragment near the
  // top of the canvas when stacking several large layers on this machine's
  // libvips build (reproduced even with zero-overlap layers). Bypass
  // composite() entirely: decode each segment to raw RGB bytes and
  // concatenate the rows directly, which is unambiguous for a simple
  // non-overlapping vertical stack.
  let nextTop = 0;
  const rowChunks = [];
  for (const seg of segments) {
    const cropAmount = Math.max(0, Math.round(nextTop - seg.top));
    const keepHeight = height - cropAmount;
    const { data } = await sharp(seg.buffer)
      .extract({ left: 0, top: cropAmount, width, height: keepHeight })
      .raw()
      .toBuffer({ resolveWithObject: true });
    rowChunks.push(data);
    nextTop += keepHeight;
  }

  const raw = Buffer.concat(rowChunks);
  await sharp(raw, { raw: { width, height: nextTop, channels: 3 } })
    .png()
    .toFile(filepath);

  console.log(`Saved: ${filepath}`);
} finally {
  await browser.close();
}
