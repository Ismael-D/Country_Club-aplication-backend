import 'dotenv/config'
import express from 'express'

import userRouter from './routes/user.route.js'
import memberRouter from './routes/member.route.js' // Agrega esta línea

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.use('/api/v1/users', userRouter)
app.use('/api/v1/members', memberRouter) // Agrega esta línea

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log('Servidor andando en ' + PORT))