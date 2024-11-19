/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true, // Enable strict mode
    swcMinify: true, // Enable SWC compiler minification for better performance
  
    // Custom headers for handling cookies in API responses
    async headers() {
      return [
        {
          source: "/api/:path*", // Match all API routes
          headers: [
            {
              key: "Access-Control-Allow-Origin",
              value: process.env.NODE_ENV === "production" ? "https://localhost:3000" : "*",
            },
            {
              key: "Access-Control-Allow-Credentials",
              value: "true",
            },
          ],
        },
      ];
    },
  };
  
  export default nextConfig;
  