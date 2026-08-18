const express = require('express');
const app = express();
const fs = require('fs/promises');
const path = require('path');
const {randomUUID} = require("crypto")
const port = 5000
const filePath = path.resolve('user.json')

async function getUsers() {
    const data = await fs.readFile(filePath, 'utf8')
    return JSON.parse(data)
}

async function saveUsers(users) {
    return await fs.writeFile(filePath, JSON.stringify(users, null, 2))
}

app.use(express.json())

// 1) add new user
app.post('/user', async (req, res) => {
    const {name, age, email} = req.body
    if (!name || !email) {
        return res.status(400).json({message: `Please enter a valid email`})
    }
    const users = await getUsers(req, res)
    const emailExists = users.find((user) => user.email === email)
    if (emailExists) {
        return res.status(409).json({message: "Email already exists"})
    }

    const newUser = {id: randomUUID(), name, age, email}
    users.push(newUser)
    await saveUsers(users)
    return res.json({message: 'user add successfully'})
})

// 2)patch
app.patch('/user/:id', async (req, res) => {
    const {id} = req.params
    const {name, age, email} = req.body
    const users = await getUsers()
    const user = users.find((user) => user.id == id)
    if (!user) {
        return res.status(404).json({message: 'user not found'})
    }
    if (name) user.name = name
    if (age) user.age = age
    if (email) user.email = email
    await saveUsers(users)
    return res.status(200).json({message: 'user updated successfully', user})
})

// 3) delete user by id
app.delete('/user/:id', async (req, res) => {
    const {id} = req.params
    const users = await getUsers()
    const userIndex = users.find((user) => user.id === id)
    if (userIndex === -1) {
        return res.status(404).send('user id not found')
    }
    users.splice(userIndex, 1);
    await saveUsers(users)
    return res.status(200).json({message: 'user deleted successfully'})
})

// 4) get user by name (as a query parameter)

app.get('/user/getByName', async (req, res) => {
    const {name} = req.query
    const users = await getUsers()
    const filteredUsers = users.filter((user) => user.name === name)
    if (!filteredUsers.length) {
        return res.status(404).send('user not found')
    }
    return res.status(200).json({filteredUsers})
})


// 5) get all users
app.get('/user', async (req, res) => {
    try {
        const users = await getUsers()
        return res.json({users})
    } catch (err) {
        return res.status(404).json({message: 'no such file', err})
    }
})


// 6) get user by filters users by min age

app.get('/user/filter', async (req, res) => {
    const { age } = req.query
    const users = await getUsers()
    const filteredUsersByAge = users.filter((user) => user.age >= age)
    if (!filteredUsersByAge.length) {
        return res.status(404).send('user not found')
    }
    return res.json({filteredUsersByAge})
})


// 7) get users by id
app.get('/user/:id', async (req, res) => {
    const {id} = req.params
    const users = await getUsers()
    const user = users.find((user) => user.id === id)
    if (!user) {
        return res.status(404).send('user not found')
    }
    return res.status(200).json({user})
})


app.use("{/*dummy}", (req, res) => {
    return res.status(404).send('invalid routing')
})

app.listen(port, () => {
    console.log(
        "This server is running at port", port)
})