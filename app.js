'use_strict';

const config = require('./utils/config')
const repository = require('./utils/repository')
const db = repository.db
const socket_io = config.socket_io
const server = config.server
const AppEvent = require('./utils/event')

socket_io.on(AppEvent.CONTINUOUS, function (data) {
    repository.toCache(data)
    repository.toDatabase(data)
})
/* This is sample data that coming from android table device, its not a real format */
let sample = {
    "name": "John",
    "age": 30,
    "cars": [1, 2, 6]
}

// setInterval(() => repository.toDatabase(sample), 2000)

