import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const config = {
  typescript: {
    // TODO: 2025-01-12 - is that a good idea? calendar-details.tsx is not typed or something
    ignoreBuildErrors: true,
  },
};

export default withNextIntl(config);
