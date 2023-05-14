require('dotenv').config()
const xlsx = require('xlsx')
const { MongoClient } = require('mongodb')

const mongoClient = new MongoClient(process.env.MONGO_CONN_STRING)
const excelFile = xlsx.readFile(process.env.CLUES_LIST_PATH).Sheets.Sheet1

const stateClues = []

for(let i = 0; i < 474; i++) {
  const a = excelFile[`A${i+1}`]
  const b = excelFile[`B${i+1}`]
  stateClues.push({_id: i, clue: a.v, state: b.v})
}

const db = mongoClient.db('state_survey')
const clues = db.collection('clues')
clues.deleteMany().then(async() => {
  clues.insertMany(stateClues)
  return
})

process.exit()