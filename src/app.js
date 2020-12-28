const express = require('express')
const path = require('path')
const hbs = require('hbs')

const app = express()
const publicDirectoryPath = path.join(__dirname, '../')
const viewsPath = path.join(__dirname, '../public/views')

app.set('view engine', 'hbs')
app.set('views', viewsPath)

app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index')
})

app.get('/login', (req, res) => {
    res.render('login')
})