/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "website",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          region: "eu-west-2",
          // Use the local SSO profile for dev; in CI (GitHub Actions) rely on
          // the OIDC-assumed role credentials from the environment instead.
          ...(process.env.CI ? {} : { profile: "x26-main" }),
        },
      },
    };
  },
  async run() {
    new sst.aws.StaticSite("Website", {
      build: {
        command: "bun run build",
        output: "dist",
      },
      domain: {
        name: "x20six.com",
        aliases: ["www.x20six.com"],
        dns: sst.aws.dns({
          zone: "Z0228916LDCTYJ4NTCF1",
        }),
      },
    });
  },
});
