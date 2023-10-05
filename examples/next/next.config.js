const { withEnvy } = require('@envyjs/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {};

const envyConfig = {
  serviceName: 'next-app',
};

module.exports = withEnvy(nextConfig, envyConfig);
