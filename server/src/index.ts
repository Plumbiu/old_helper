import { Prisma, PrismaClient } from '@prisma/client'
import express from 'express'
import { createServer } from 'net'
import { createServer as httpCreateServer } from 'http'
import ws from 'websocket-stream'
import bodyParser from 'body-parser'
import cors from 'cors'

const aedes = require('aedes')()
const mqttServer = createServer(aedes.handle)
const httpServer = httpCreateServer()
const port = 1333
const wsPort = 8050
const topic = ['GPS_Status', 'DieDao', 'GPS_Position']
let flag = false
aedes.on('publish', async (packet: any, client: any) => {
  const topic = packet.topic
  const payload = packet.payload.toString()
  if (topic === 'GPS_Position') {
    await prisma.record.create({
      data: {
        pos: payload,
        fall: flag,
      },
    })
    if (flag === true) {
      flag = false
    }
  }
  if (topic === 'DieDao') {
    if (payload === '1') {
      flag = true
    } else {
      flag = false
    }
  }
})
const prisma = new PrismaClient()
const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())

app.get('/', async (req, res) => {
  try {
    const records = await prisma.record.findMany()
    res.send({
      code: 1,
      message: 'success',
      data: records,
    })
  } catch (error) {
    res.send({
      code: 0,
      message: 'error',
      data: null,
    })
  }
})
app.post('/', async (req, res) => {
  try {
    const { pos } = req.body
    const records = await prisma.record.create({
      data: {
        pos,
        fall: true,
      },
    })
    res.send({
      code: 1,
      message: 'success',
      data: records,
    })
  } catch(err) {
    res.send({
      code: 0,
      message: 'error',
      data: null,
    })
  }
})
mqttServer.listen(port)

ws.createServer(
  {
    server: httpServer,
  },
  aedes.handle
)

httpServer.listen(wsPort)

const apiServer = app.listen(3000, () =>
  console.log(`
🚀 Server ready at: http://localhost:3000
⭐️ See sample requests: http://pris.ly/e/ts/rest-express#3-using-the-rest-api`)
)
