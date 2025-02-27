/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,

  images: {
    unoptimized: true,
  },

  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */

  // Add experimental features to support top-level await
  transpilePackages: [
    "@nivo/pie",
    "d3-scale",
    "d3-scale-chromatic",
    "d3-color",
    "d3-interpolate",
    "d3-format",
    "d3-time",
    "d3-time-format",
  ],
  experimental: {
    esmExternals: "loose",
  },
};

export default nextConfig;
