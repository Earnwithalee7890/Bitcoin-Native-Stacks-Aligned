import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  transpilePackages: ["@reown/appkit", "@walletconnect/universal-provider"],
};

export default nextConfig;
