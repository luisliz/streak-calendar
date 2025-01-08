const config = {
  providers: [
    {
      domain: process.env.CLERK_DOMAIN ?? "grand-jay-22.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};

module.exports = config;
