/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['lh3.googleusercontent.com', 'firebasestorage.googleapis.com']
  }
};

const withPWA = require('next-pwa')({
  dest: 'public',
  sw: 'firebase-messaging-sw.js'
});

module.exports = withPWA(nextConfig);
