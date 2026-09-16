module.exports = {
  apps: [
    {
      name: "flexx",
      cwd: __dirname,
      script: ".next/standalone/server.js",
      exec_mode: "fork",
      instances: 1,
      autorestart: true,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
        HOSTNAME: "0.0.0.0",
      },
    },
  ],
};
