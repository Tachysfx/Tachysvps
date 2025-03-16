import { NextResponse } from 'next/server';
import { MarketFrontData } from '../../lib/data';

export async function GET() {
  try {
    // Fetch all algorithms
    const algorithms = await MarketFrontData();
    
    // Current date in YYYY-MM-DD format for lastmod
    const currentDate = new Date().toISOString().split('T')[0];
    
    // Start building the sitemap XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Main pages -->
  <url>
    <loc>https://tachysvps.com</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://tachysvps.com/market</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://tachysvps.com/explore</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`;
    
    // Add all algorithm pages
    algorithms.forEach(algo => {
      sitemap += `
  <url>
    <loc>https://tachysvps.com/market/${algo.id}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });
    
    // Close the sitemap
    sitemap += `
</urlset>`;
    
    // Return the sitemap XML with appropriate content type
    return new NextResponse(sitemap, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
} 