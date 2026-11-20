const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.dizozet.shop';

const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/reels-bundles', priority: '0.9', changefreq: 'daily' },
  { url: '/subscriptions', priority: '0.9', changefreq: 'daily' },
  { url: '/digital-products', priority: '0.8', changefreq: 'daily' },
  { url: '/orders', priority: '0.5', changefreq: 'weekly' }
];

const urls = [...staticPages];

// 1. Add Reels Bundles
try {
  const reelsPath = path.join(__dirname, '..', 'src', 'data', 'reelsBundles.json');
  if (fs.existsSync(reelsPath)) {
    const reels = JSON.parse(fs.readFileSync(reelsPath, 'utf8'));
    reels.forEach(bundle => {
      if (bundle && bundle.id) {
        urls.push({
          url: `/product/reels-bundle/${bundle.id}`,
          priority: '0.8',
          changefreq: 'weekly'
        });
      }
    });
  }
} catch (e) {
  console.warn('Could not read reels bundles for sitemap:', e.message);
}

// 2. Add Subscriptions
try {
  const subsPath = path.join(__dirname, '..', 'src', 'data', 'subscriptionsData.js');
  if (fs.existsSync(subsPath)) {
    const content = fs.readFileSync(subsPath, 'utf8');
    const ids = Array.from(content.matchAll(/id:\s*['"]([^'"]+)['"]/g), m => m[1]);
    const uniqueIds = Array.from(new Set(ids)).filter(id => id.startsWith('sub-'));
    uniqueIds.forEach(id => {
      urls.push({
        url: `/product/subscription/${id}`,
        priority: '0.8',
        changefreq: 'weekly'
      });
    });
  }
} catch (e) {
  console.warn('Could not read subscriptions for sitemap:', e.message);
}

// 3. Add Digital Products
try {
  const digiPath = path.join(__dirname, '..', 'src', 'data', 'digitalProductsData.js');
  if (fs.existsSync(digiPath)) {
    const content = fs.readFileSync(digiPath, 'utf8');
    const ids = Array.from(content.matchAll(/id:\s*['"]([^'"]+)['"]/g), m => m[1]);
    const uniqueIds = Array.from(new Set(ids)).filter(id => id.startsWith('digi-') || id.startsWith('prod-'));
    uniqueIds.forEach(id => {
      urls.push({
        url: `/product/digital-product/${id}`,
        priority: '0.7',
        changefreq: 'weekly'
      });
    });
  }
} catch (e) {
  console.warn('Could not read digital products for sitemap:', e.message);
}

const today = new Date().toISOString().split('T')[0];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(item => `  <url>
    <loc>${BASE_URL}${item.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

const outputPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
fs.writeFileSync(outputPath, sitemapXml, 'utf8');
console.log(`Generated sitemap.xml with ${urls.length} total URLs at ${outputPath}`);
