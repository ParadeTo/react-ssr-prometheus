module.exports = {
  apps: [
    {
      name: 'ssr',
      script: './server/index.js',
      exec_mode: 'cluster',
      instances: 0,
    },
  ],
}
