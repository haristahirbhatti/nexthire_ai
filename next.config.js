/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // pdfjs-dist uses canvas optionally — tell webpack to ignore it on server
      config.externals = [...(config.externals || []), "canvas"];
    }
    // pdfjs-dist ships .mjs files — ensure webpack handles them
    config.resolve.extensionAlias = {
      ".js": [".js", ".mjs"],
    };
    return config;
  },
  // Allow pdfjs-dist to load properly on Vercel edge/serverless
  experimental: {
    serverComponentsExternalPackages: ["pdfjs-dist"],
  },
};

module.exports = nextConfig;
