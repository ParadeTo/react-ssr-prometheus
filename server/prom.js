const PromClient = require('prom-client')
const service = 'ssr'
const registry = new PromClient.Registry()
const gateway = new PromClient.Pushgateway(
  'http://localhost:9091',
  {},
  registry
)

export function initMonit() {
  setInterval(async () => {
    try {
      await gateway.pushAdd({
        jobName: service,
        groupings: {process: String(process.pid)},
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

export const histogram = new PromClient.Histogram({
  registers: [registry],
  name: 'ssr_histogram_3',
  help: 'ssr histogram',
  labelNames: ['url'],
})
