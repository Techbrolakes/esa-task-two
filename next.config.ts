/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "be2-documents-staging.s3.amazonaws.com",
      },
    ],
  },
};

module.exports = nextConfig;
