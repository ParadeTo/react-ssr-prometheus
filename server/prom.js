const PromClient = require('prom-client')
const service = 'ssr'
const registry = new PromClient.Registry()
const gateway = new PromClient.Pushgateway(
  'http://localhost:9091',
  {},
  registry
)

function initMonit() {
  setInterval(async () => {
    try {
      await gateway.pushAdd({
        jobName: service,
      })
    } catch (error) {
      console.error('pushgateway error', error)
    }
  }, 5000)
}

export const counter = new PromClient.Counter({
  registers: [registry],
  name: 'ssr_counter',
  help: 'ssr counter',
  labelNames: ['url'],
})

initMonit()
