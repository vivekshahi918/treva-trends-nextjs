// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     images:{
//         domains:['localhost', 'firebasestorage.googleapis.com'],
//     },
// };

// export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/v0/b/**',
      },
    ],
  },
};

module.exports = nextConfig;
