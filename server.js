import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import uploadHandler from './api/candidates/upload.js'
import listHandler from './api/candidates/list.js'
import decisionHandler from './api/candidates/decision.js'
import updateHandler from './api/candidates/update.js'
import sendHandler from './api/candidates/send.js'

const app = express()
app.use(cors())
app.use(express.json({ limit: '15mb' }))

app.all('/api/candidates/upload', uploadHandler)
app.all('/api/candidates/list', listHandler)
app.all('/api/candidates/decision', decisionHandler)
app.all('/api/candidates/update', updateHandler)
app.all('/api/candidates/send', sendHandler)

// Deliberately NOT process.env.PORT — the dev-preview harness sets PORT to
// match the Vite port in launch.json, which would collide with this server.
const port = process.env.API_PORT || 3001
app.listen(port, () => console.log(`Kargo hiring API listening on :${port}`))
