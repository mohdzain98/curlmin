const { SitemapStream, streamToPromise } = require("sitemap");
const fs = require("fs");
const path = require("path");

// Define all routes manually
const routes = [
  { url: "/", changefreq: "daily", priority: 1.0 },
  { url: "/login", changefreq: "monthly", priority: 0.8 },
  { url: "/signup", changefreq: "monthly", priority: 0.8 },
  { url: "/qrcode", changefreq: "monthly", priority: 0.8 },
  { url: "/barcode", changefreq: "monthly", priority: 0.8 },
  { url: "/curltag", changefreq: "monthly", priority: 0.8 },
  { url: "/image", changefreq: "monthly", priority: 0.8 },
  { url: "/barcode-scanner", changefreq: "monthly", priority: 0.8 },
  { url: "/contactus", changefreq: "monthly", priority: 0.8 },
  { url: "/forgot-password", changefreq: "monthly", priority: 0.8 },
  { url: "/urls?dashboard", changefreq: "monthly", priority: 0.8 },
  { url: "/accounts?details", changefreq: "monthly", priority: 0.8 },
  { url: "/terms", changefreq: "monthly", priority: 0.8 },
  { url: "/help-center", changefreq: "monthly", priority: 0.8 },
  { url: "/privacy-policy", changefreq: "monthly", priority: 0.8 },
  { url: "/faq", changefreq: "monthly", priority: 0.8 },
];

// Generate the sitemap
const sitemap = new SitemapStream({ hostname: "https://curlmin.com" });

routes.forEach((route) => {
  sitemap.write(route);
});

sitemap.end();

streamToPromise(sitemap)
  .then((data) => {
    fs.writeFileSync(path.join(__dirname, "public", "sitemap.xml"), data);
    console.log("✅ Sitemap generated successfully!");
  })
  .catch((err) => console.error("Error generating sitemap:", err));
