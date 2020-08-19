const express = require('express')
const morgan = require('morgan')
const app = express()

morgan.token('body', (req, res) => {
    if (req.method == 'POST') {
        return JSON.stringify(req.body)
    } else {
        return null
    }
})

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-532523",
        id: 4
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-63289443",
        id: 4
    },
    {
        name: "hh",
        number: "ll",
        id:5
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p>
    ${new Date()}`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)
    if (person) {
        persons = persons.filter(p => p.id !== id)
        res.status(203).end()
    } else {
        res.status(404).end()
    }
})

app.post('/api/persons', (req, res) => {
    const body = req.body 
    if (!body.name || !body.number) {
        res.status(400).json({
            error: "name or number is empty"
        })
        return
    }
    const exist = persons.find(p=>p.name === body.name)
    if (exist) {
        res.status(400).json({
            error: "name must be unique"
        })
        return
    }

    const person = {
        name: body.name,
        number: body.number,
        id: Math.round(Math.random() * 1000000)
    }
    persons = persons.concat(person)
    res.json(person)

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`server start at port ${PORT}`)
})