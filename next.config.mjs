import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',            // plain HTML/CSS/JS in /out, deployable on Netlify with no server
  poweredByHeader: false,
  trailingSlash: false,        // /products/chew-bone-12-cm (no trailing slash) everywhere
  images: { unoptimized: true },
  webpack(config) {
    config.resolve.alias['@'] = path.join(here, 'src');
    return config;
  },
};
export default nextConfig;
