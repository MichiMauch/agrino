import 'dotenv/config';

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MANDRILL_API_KEY: process.env.MANDRILL_API_KEY,
    EMAIL_RECIPIENT: process.env.EMAIL_RECIPIENT,
    EMAIL_SENDER: process.env.EMAIL_SENDER,
  },
};

export default nextConfig;
