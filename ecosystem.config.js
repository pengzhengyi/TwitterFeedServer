module.exports = {
  apps : [{
    name: 'TwitterFeedServer',
    script: 'server.js',

    // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
    instances: 0, // launch the maximum processes possible according to the numbers of CPUs (cluster mode)
    autorestart: true,
    max_memory_restart: '1G',

    watch: false,
    ignore_watch : ["node_modules", "[\/\\]\./", "example_responses", "logs", "README", "package.json", "package-lock.json", "vim-markdown-preview.html", "*config*"],

    error_file: '.logs/error.log',
    out_file: '.logs/out.log',
    pid_file: '.pid/app-pm_id.pid',

    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }],
};
