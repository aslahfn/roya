import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/**/*': ['./prisma/dev.db', './prisma/**'],
  },
  serverExternalPackages: ['@prisma/client'],
};

export default nextConfig;
