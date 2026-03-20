import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const appDir = join(__dirname, '..', 'app');
const svgBuffer = readFileSync(join(publicDir, 'logo.svg'));

async function generate() {
  // public/ PNG 사이즈들
  const sizes = [
    { name: 'logo-512.png', size: 512 },
    { name: 'logo-192.png', size: 192 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'logo-96.png', size: 96 },
    { name: 'logo-32.png', size: 32 },
    { name: 'logo-16.png', size: 16 },
  ];

  for (const { name, size } of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(join(publicDir, name));
    console.log(`✓ ${name} (${size}x${size})`);
  }

  // app/favicon.ico (32x32 PNG를 favicon.ico로)
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(join(appDir, 'favicon.ico'));
  console.log('✓ app/favicon.ico (32x32)');
}

generate().catch(console.error);
