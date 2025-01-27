/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["s3.amazonaws.com"], // Allow remote images from this domain
  },
  webpack: (config) => {
    config.module.rules.push({
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/, // Add other formats as needed
        use: {
            loader: 'file-loader',
            options: {
                name: '[name].[hash].[ext]', // Customize output filename
                outputPath: 'static/videos/', // Customize output directory
            },
        },
    });
    return config;
},
};

export default nextConfig;
