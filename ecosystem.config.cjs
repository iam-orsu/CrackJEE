const os = require('os');
const isProctorview = os.hostname() === 'proctorview';

const backendPort = process.env.PORT ? Number(process.env.PORT) : (isProctorview ? 7001 : 3001);
const frontendPort = process.env.FRONTEND_PORT ? Number(process.env.FRONTEND_PORT) : (isProctorview ? 7000 : 3000);
const backendUrl = process.env.BACKEND_URL || `http://127.0.0.1:${backendPort}`;

module.exports = {
  apps: [
    {
      name: 'jeeneet-backend',
      cwd: './backend',
      script: 'dist/server.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 2000,
      max_memory_restart: '1G',
      kill_timeout: 30000,
      wait_ready: false,
      env: {
        NODE_ENV: 'production',
        PORT: backendPort,
        UV_THREADPOOL_SIZE: '16',
      },
    },
    {
      name: 'jeeneet-frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'run start',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 2000,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: frontendPort,
        BACKEND_URL: backendUrl,
      },
    },
  ],
};
