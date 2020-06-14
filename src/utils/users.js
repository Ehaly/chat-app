const users = []

const addUser = ({ id, username, room}) => {
    //Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if (!username || !room) {
        return {
            error: 'Username and room are required'
        }
    }

    //check for exsisting user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //Validate user
    if (existingUser) {
        return {
            error: 'Username is in use'
        }
    }

    //
    const user = { id, username, room}
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => {
    const user = users.find((user) => user.id === id)

    return user
}

const getUsersInRoom = (room) => {
    const userInRoom = users.filter((user) => {
        return user.room === room
    })

    return userInRoom
}

module.exports = { addUser, removeUser, getUser, getUsersInRoom }