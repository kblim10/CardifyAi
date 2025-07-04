module.exports = {
  apps: [{
    name: "cardifyai-backend",
    script: "server.js",
    instances: 1,
    exec_mode: "cluster",
    env: {
      NODE_ENV: "production",
      PORT: "8080"
    }
  }]
};
