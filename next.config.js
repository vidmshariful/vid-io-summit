/** @type {import('next').NextConfig} */
const nextConfig = {
  // The deck is a self-contained static site under public/deck/.
  // Send the root URL straight to it.
  async redirects() {
    return [{ source: "/", destination: "/deck/index.html", permanent: false }];
  },
};

module.exports = nextConfig;
