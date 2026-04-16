/** Allow next/image for uploaded files when API host differs from the site (build-time). */
function apiUploadRemotePatterns() {
  const raw = (process.env.NEXT_PUBLIC_API_URL || "").trim().replace(/\/$/, "");
  if (!raw) return [];
  try {
    const u = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    const pat = {
      protocol: (u.protocol.replace(":", "") || "https") === "http" ? "http" : "https",
      hostname: u.hostname,
      pathname: "/uploads/**",
    };
    if (u.port) pat.port = u.port;
    return [pat];
  } catch {
    return [];
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      /** Dev API default (resolveMediaUrl). */
      { protocol: "http", hostname: "localhost", port: "4000", pathname: "/uploads/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "4000", pathname: "/uploads/**" },
      { protocol: "https", hostname: "localhost", port: "4000", pathname: "/uploads/**" },
      { protocol: "https", hostname: "127.0.0.1", port: "4000", pathname: "/uploads/**" },
      ...apiUploadRemotePatterns(),
    ],
  },
};

module.exports = nextConfig;
