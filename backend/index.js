require('dotenv').config()


const http = require('http')
const express = require('express')
const { MongoClient, ObjectId } = require('mongodb')
const { Server } = require('socket.io')
const xlsx = require('xlsx')
const { v4 } = require('uuid')

const app = express()
const server = http.createServer(app)
const mongoClient = new MongoClient(process.env.MONGO_CONN_STRING)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  }
})

const excelFile = xlsx.readFile(process.env.CLUES_LIST_PATH).Sheets.Sheet1

const stateClues = []

const numArray = [];

for(let i = 0; i < 474; i++) {
  numArray[i] = i
}

for(let i = 0; i < 474; i++) {
  const a = excelFile[`A${i+1}`]
  const b = excelFile[`B${i+1}`]
  stateClues.push({clue: a.v, state: b.v})
}

function shuffleNum() {
  const array = numArray;
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// console.log(shuffleNum())

// console.log(shuffleArray(stateClues))


const clients = new Map();

io.on('connection', (socket) => {
  socket.on('identify', async(uuid) => {
    const db = mongoClient.db('state_survey')
    const users = db.collection('users')
    const clues = db.collection('clues')
    const responses = db.collection('responses')
    let clue = shuffleNum()
    let user
    console.log(typeof uuid)
    if(uuid == "null" || (uuid?.length > 255) || (typeof(uuid) != 'string')) uuid = null
    if(uuid) {
      user = await users.findOne({ _id: new ObjectId(uuid) })
      clue = user.clue
    }
    if(!user) {
      user = await users.insertOne({
        clue
      })
    }
    const response = await responses.findOne({ user_id: uuid, sort: { _id: -1 }})
    clue = socket.clue = await clues.findOne({ _id: clue[0] })
    console.log(socket.clue)
    socket.emit('id', user.insertedId?.toString() ?? user._id)
    socket.emit('clue', clue.clue)
  })
})

server.listen(3000, '127.0.0.1')