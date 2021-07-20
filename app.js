const http = require('http');
const express = require('express');
const db = require('./db');
const { CONNREFUSED } = require('dns');

const hostName = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000
let id = 9;



const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

const server = http.createServer(app);

app.use(express.static('./public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.render('home', {
        // title: 'Apple CEO',
        // year: 'Year'
    })
})

app.get('/new', (req, res) => {
    res.render('new', {
        title: 'New CEO Page'
    })
})

app.post('./new', (req, res) => {
    const newCeo = {
        id: id++,
        slug: req.body.ceo_name.toLowerCase().split(' ').join('_'),
        name: req.body.ceo_name,
        year: req.body.ceo_year,
    }
    db.push(newCeo)
    console.log('New CEO Received', newCeo)
    res.redirect('./ceos')
})

app.get('/ceos', (req, res) => {
    res.render('ceo-list', {
        title: 'Apple list of CEOs',
        ceos: db
    })
});

app.get('/ceos/:slug', (req, res) => {
    const ceo = db.find(ceo => ceo.slug === req.params.slug)
    res.render('ceo-detail', {
        title: ceo.name,
        ceo: ceo
    })
});



server.listen(port, hostName, () => {
    console.log(`Server running at http://${hostName}:${port}/`)
})