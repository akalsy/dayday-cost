module.exports = {
    apps: [
      {
        name: 'dayday-cost',
        script: 'ddcost-vite-server.js'
      },
    ],
    deploy: {
      production: {
        user: 'root',
        host: '1.116.118.236',
        ref: 'origin/master',
        repo: 'https://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@github.com/akalsy/dayday-cost.git',
        path: '/workspace/dayday-cost',
        'post-deploy': 'git reset --hard && git checkout master && git pull && npm i --production=false && npm run build:release && pm2 startOrReload ecosystem.config.js', // -production=false 下载全量包
        env: {
          NODE_ENV: 'production'
        }
      }
    }
  }