require('@babel/register')({
  presets: [
    '@babel/preset-env',
    ['@babel/preset-react', {runtime: 'automatic'}],
  ],
  plugins: [
    [
      'transform-assets',
      {
        extensions: ['css', 'svg'],
        name: 'static/media/[name].6ce24c58023cc2f8fd88fe9d219db6c6.[ext]',
      },
    ],
  ],
})
const React = require('react')
const ReactDOMServer = require('react-dom/server')
const App = require('../src/App').default
const express = require('express')
const path = require('path')
const fs = require('fs')
const {initMonit, counter, histogram} = require('./prom')
const app = express()
initMonit()

app.use((req, res, next) => {
  if (req.url.indexOf('static') === -1) counter.labels({url: req.url}).inc()
  next()
})

app.use((req, res, next) => {
  const startTime = Date.now()
  next()
  if (req.url.indexOf('static') === -1) {
    histogram.labels({url: req.url}).observe(Date.now() - startTime)
  }
})

app.get('/api', (req, res, next) => {
  res.end('hello')
})

app.get('/', async (req, res, next) => {
  const reactApp = ReactDOMServer.renderToString(React.createElement(App))
  const start = Date.now()
  while (Date.now() - start < 10 * Math.random()) {}
  const indexFile = path.resolve('build/index.html')
  fs.readFile(indexFile, 'utf8', (_, data) => {
    res.send(
      data.replace('<div id="root"></div>', `<div id="root">${reactApp}</div>`)
    )
  })
})

app.use(express.static(path.resolve(__dirname, '../build')))

app.listen(8080, () =>
  console.log('Express server is running on localhost:8080')
)
