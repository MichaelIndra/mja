module.exports = {
  apps: [{
    name: "app",
    script: "./dist/main.js",
    instances : 1,
    // instances : "max",
    exec_mode : "cluster",
    exp_backoff_restart_delay: 10,
    // max_memory_restart: '100M',
    watch: ["dist"],
    // Delay between restart
    // watch_delay: 1000,
    ignore_watch : ["node_modules"],
    watch_options: {
      "followSymlinks": false
    },
    env: {
      NODE_ENV: "development"
    },
    env_development: {
      NODE_ENV: "development"
    },
    env_test: {
      NODE_ENV: "test",
    },
    env_staging: {
      NODE_ENV: "staging",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}
