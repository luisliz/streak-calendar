const config = {
  providers: [
    {
      domain: process.env.NODE_ENV === "production" ? "clerk.streakcalendar.com" : "grand-jay-22.clerk.accounts.dev",
      applicationID: "convex",
    },
  ],
};

export default config;
