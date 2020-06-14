const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const { generateMessage, generateLocation} = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')

//set up static directory to serve
app.use(express.static(publicDirectoryPath))




io.on('connection', (socket) => {
    console.log('New web socket connection')



    socket.on('join', (options, callback) => {
        const {error, user} = addUser({
            id:socket.id,
            ...options
        })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('message', generateMessage('Admin','Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined`))
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
        
        //socket.emit, io.emit, socket.broadcast.emit
        //with room: io.to.emit, socket.broadcast.to.emit

        callback()
    })
    
    socket.on('SendMessage', (message, callback) => {
        const user = getUser(socket.id)

        
        io.to(user.room).emit('message', generateMessage(user.username, message))

        callback()
    })

    socket.on('sendLocation', ({latitude, longitude}, callback) => {
        const user = getUser(socket.id)

        io.to(user.room).emit('locationMessage', generateLocation(user.username, `https://google.com/maps?q=${longitude},${latitude}`))
        
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin',`${user.username} has left`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        } 
    })
})




server.listen(port, ()=>{
    console.log(`Server is up on port ${port}`)
})