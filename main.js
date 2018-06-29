const Koa = require('koa')
const router = require('koa-router')()
const redis = require('redis')
const koaBody = require('koa-body')
const fs = require('fs.promised')
const path = require('path')
const serve = require('koa-static')
const XLSX = require('xlsx')
const iconv = require('iconv-lite')
iconv.skipDecodeWarning = true

const app = new Koa()

const static = serve(path.join(__dirname))
app.use(static)

const client = redis.createClient(6379, '127.0.0.1')

client.on('error', (err) => {
  console.log(err)
})

client.on('connect', () => {
  console.log('redis connected')
})

const about = ctx => {
  ctx.response.type = 'html'
  ctx.response.body = '<a href="/">Index Page</a>'
}

const main = ctx => {
  ctx.response.body = 'Hello World'
}

const storeData = ctx => {
  const body = ctx.request.body

  if (!body.data) ctx.throw(400, '.data required')

  client.set('data', body.data, (err, reply) => {
    console.log(reply)
  })

  client.get('data', (err, reply) => {
    console.log(reply)
  })

  ctx.response.status = 200
  ctx.response.message = 'OK'
}

const getData = async (ctx) => {
  let data = {}
  await client.get('data', (err, reply) => {
    data = JSON.parse(reply)
  })

  ctx.response.body = { data }
}

const getView = async (ctx, next) => {
  ctx.response.type = 'html'
  let html = await fs.readFile('./src/template.html', 'utf8')
  html = html.replace(/window.__INIT_DATA__/, `window.__INIT_DATA__ = ${ctx.jsonData}`)
  ctx.response.body = html
}

const getJson = async (ctx, next) => {
  ctx.jsonData = await fs.readFile('./data/data.json', 'utf-8')

  await next()
}

const getSheet = async (ctx, next) => {
  const workbook = await XLSX.readFile('上海多目标联动经营仿真预测模型-0627(加经济活动分析）.xlsm')

  // console.log(workbook.Sheets['动态展示'])

  ctx.response.type = 'html'
  ctx.response.body = XLSX.utils.sheet_to_html(workbook.Sheets['动态展示'])
}

const getCellData = (ctx, next) => {
  const cell = ctx.request.querystring
  const c = iconv.decode(cell, 'utf-8')
  console.log(c)

  ctx.response.status = 200
  ctx.response.message = 'OK'
}

app.use(koaBody())

router.post('/api/table', storeData)
router.get('/api/table', getData)
router.get('/view', getJson, getView)
router.get('/sheet', getSheet)

router.get('/api/cell', getCellData)

app.use(router.routes())

app.listen(8089) 