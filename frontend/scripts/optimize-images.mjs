import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const publicDirectory = path.resolve("public");
const deleteOriginals = process.argv.includes("--delete-originals");
const logoSourceFlag = process.argv.indexOf("--logo-source");
const logoSource = logoSourceFlag >= 0 ? process.argv[logoSourceFlag + 1] : null;

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const target = path.join(directory, entry.name);
      return entry.isDirectory() ? walk(target) : target;
    }),
  );

  return files.flat();
}

async function convertRaster(file) {
  const extension = path.extname(file).toLowerCase();
  if (![".png", ".jpg", ".jpeg"].includes(extension)) return null;
  if (file.endsWith("apple-touch-icon.png")) return null;

  const output = file.slice(0, -extension.length) + ".webp";
  const before = (await readFile(file)).byteLength;
  const isCarousel = file.includes(`${path.sep}posts${path.sep}`);

  await sharp(file)
    .rotate()
    .webp({
      quality: isCarousel ? 88 : 84,
      alphaQuality: 100,
      effort: 6,
      smartSubsample: true,
    })
    .toFile(output);

  const after = (await readFile(output)).byteLength;
  if (deleteOriginals) await rm(file);

  return { file, output, before, after };
}

async function createBrandAssets(source) {
  const { data, info } = await sharp(source)
    .rotate()
    .removeAlpha()
    .grayscale()
    .extractChannel(0)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const rgba = Buffer.alloc(info.width * info.height * 4);

  for (let index = 0; index < data.length; index += 1) {
    const alpha = Math.max(0, Math.min(255, Math.round((240 - data[index]) * 8.5)));
    const outputIndex = index * 4;
    rgba[outputIndex] = 0;
    rgba[outputIndex + 1] = 0;
    rgba[outputIndex + 2] = 0;
    rgba[outputIndex + 3] = alpha;
  }

  const mark = await sharp(rgba, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 4 })
    .resize({ width: 512, withoutEnlargement: true })
    .png()
    .toBuffer();

  const brandDirectory = path.join(publicDirectory, "brand");
  await mkdir(brandDirectory, { recursive: true });
  await sharp(mark).webp({ lossless: true, effort: 6 }).toFile(path.join(brandDirectory, "monogram.webp"));

  const resizedMark = await sharp(mark).resize({ width: 400 }).png().toBuffer();
  const resizedMetadata = await sharp(resizedMark).metadata();
  const verticalSpace = 400 - (resizedMetadata.height ?? 400);
  const favicon = await sharp(resizedMark)
    .extend({
      top: Math.floor(verticalSpace / 2),
      bottom: Math.ceil(verticalSpace / 2),
      left: 0,
      right: 0,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .extend({
      top: 56,
      right: 56,
      bottom: 56,
      left: 56,
      background: "#ffffff",
    })
    .flatten({ background: "#ffffff" })
    .webp({ lossless: true, effort: 6 })
    .toBuffer();
  await writeFile(path.join(publicDirectory, "favicon.webp"), favicon);

  await sharp(favicon)
    .resize(180, 180)
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(path.join(publicDirectory, "apple-touch-icon.png"));

  const encodedFavicon = favicon.toString("base64");
  await writeFile(
    path.join(publicDirectory, "favicon.svg"),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><image width="512" height="512" href="data:image/webp;base64,${encodedFavicon}"/></svg>\n`,
  );
}

const files = await walk(publicDirectory);
const converted = (await Promise.all(files.map(convertRaster))).filter(Boolean);

if (logoSource) await createBrandAssets(path.resolve(logoSource));

const totals = converted.reduce(
  (result, image) => ({ before: result.before + image.before, after: result.after + image.after }),
  { before: 0, after: 0 },
);
const savedPercent = totals.before === 0 ? 0 : Math.round((1 - totals.after / totals.before) * 100);

console.log(
  `Converted ${converted.length} images: ${(totals.before / 1024 / 1024).toFixed(2)} MiB -> ${(totals.after / 1024 / 1024).toFixed(2)} MiB (${savedPercent}% smaller).`,
);
