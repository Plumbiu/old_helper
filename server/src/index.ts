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
const topic = ['GPS']
const prisma = new PrismaClient()

/** 
 * mqtt 模块：
 * mqtt 数据格式： { "pos": 120.333,30.333, "DieDao": true }
 */
aedes.on('publish', async (packet: any) => {
  const topic = packet.topic
  if (topic === 'GPS') {
    try {
      const payload = JSON.parse(packet.payload.toString())
      // 如果未跌倒
      if (!payload.DieDao) {
        // 获取所有数据
        const records = await prisma.record.findMany()
        // 获取未跌倒数据
        const fallRecord = records.find(item => !item.fall)
        // 可能没有未跌倒的数据，这时要创建一个
        if(!fallRecord?.id) {
          await prisma.record.create({
            data: { pos: payload.pos, fall: false }
          })
          return
        }
        // 更新未跌倒的数据
        await prisma.record.update({
          where: { id: fallRecord.id },
          data: { pos: payload.pos, createdAt: new Date(Date.now()) }
        })
      } else {
        // 创建跌倒的数据
        await prisma.record.create({
          data: {
            pos: payload.pos,
            fall: payload.DieDao,
          },
        })
      }
    } catch (error) {}
  }
})
// API 模块
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
// 测试阶段使用，用于清空数据
app.delete('/', async (req, res) => {
  try {
    const data = await prisma.record.deleteMany()
    res.send({
      msg: 'success',
      data,
    })
  } catch (err) {
    res.send({
      msg: 'error',
    })
  }
})
// 启动 mqtt 服务
mqttServer.listen(port)
// 启动 websocket 服务
ws.createServer(
  {
    server: httpServer,
  },
  aedes.handle
)
// 启动 http 服务
httpServer.listen(wsPort)

app.listen(3000, () =>
  console.log(`Server ready at: http://localhost:3000`)
)
