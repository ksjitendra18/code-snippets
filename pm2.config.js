module.exports = {
  apps: [
    {
      name: "snippets",
      script: "npm",
      args: "start",
      autorestart: true,
      env: {
        NODE_ENV: "production",
        PORT: process.env.NEXT_PORT || 7000,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      },
    },
    {
      name: "snippets-worker",
      script: "./scripts/worker.ts",
      interpreter: "bun",
    },
  ],
};
