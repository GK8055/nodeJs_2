const express = require('express')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')

const dbpath = path.join(__dirname, 'todoApplication.db')
const app = express()
app.use(express.json())
let db = null
//intializationDbAndServer
const intializationDbAndServer = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Starts @ 3000')
    })
  } catch (ex) {
    conaole.log(ex.message)
    process.exit(1)
  }
}
intializationDbAndServer()

//API -1 (GET_all_todos):
// const todoDataResult = each => {
//   return {
//     id: each.id,
//     todo: each.todo,
//     priority: each.priority,
//     status: each.status,
//   }
// }
const hasPriorityAndStatusProperties = requestQuery => {
  return (
    requestQuery.status !== undefined && requestQuery.priority !== undefined
  )
}
const hasPriorityProperties = requestQuery => {
  return requestQuery.priority !== undefined
}
const hasStatusProperties = requestQuery => {
  return requestQuery.status !== undefined
}
app.get('/todos/', async (request, response) => {
  try {
    let data = null
    let getTodoQuery = ''
    const {search_q = '', priority, status} = request.Query
    switch (true) {
      case hasPriorityAndStatusProperties(request.Query):
        getTodoQuery = `SELECT * FROM todo
          where todo like '%${search_q}%'
          AND status='${status}'
          AND priority='${priority}'`
        break
      case hasPriorityProperties(request.query):
        getTodoQuery = `SELECT * FROM todo
          where todo like '%${search_q}%'
          AND priority='${priority}'`
        break
      case hasStatusProperties(request.query):
        getTodoQuery = `SELECT * FROM todo
          where todo like '%${search_q}%' AND
         status='${status}'`
        break
      default:
        getTodoQuery = `SELECT * FROM todo where
          todo like '%${search_q}%'`
        break
    }
    data = await db.all(getTodoQuery)
    console.log(data)
    response.send(data)
  } catch (ex) {
    console.log(ex.message)
    console.log(data)
  }
})
