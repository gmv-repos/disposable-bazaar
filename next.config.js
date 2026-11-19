/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,

  transpilePackages: [
    "@react-google-maps/api",
    "@react-oauth/google",
    "aos",
    "axios",
    "dompurify",
    "framer-motion",
    "html-react-parser",
    "html2canvas",
    "isomorphic-dompurify",
    "js-confetti",
    "leaflet",
    "react-icons",
    "react-leaflet",
    "react-toastify",
    "swiper",
    "uuid",
    "lucide-react",
  ],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dbapi.xstoreo.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ecommerce-inventory.thegallerygen.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "static.vecteezy.com",
        pathname: "/**",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    formats: ["image/webp"],
    minimumCacheTTL: 3600,
  },

  async headers() {
    const isProd = process.env.NODE_ENV === "production";
    return [
      // Only in production: dev chunk filenames don't change when code changes,
      // so an "immutable" header makes the browser keep running stale JS.
      ...(isProd
        ? [
            {
              source: "/_next/static/(.*)",
              headers: [
                {
                  key: "Cache-Control",
                  value: "public, max-age=31536000, immutable",
                },
              ],
            },
          ]
        : []),
      // No Cache-Control override for /_next/image: Next sets it itself
      // (minimumCacheTTL above), and a forced header also cached failed
      // 504 image responses in the browser for a day.
      {
        source: "/(.*)",
        headers: [{ key: "X-Robots-Tag", value: "all" }],
      },
    ];
  },

  compress: true,

  compiler: {
    removeConsole: false,
  },
};

module.exports = nextConfig;
