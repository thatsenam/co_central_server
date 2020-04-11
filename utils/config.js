const express = require("express");
const socket = require('../socket')
const AppEvent = require('./event')
const http = require("http")
const repository = require('./repository')
const PORT = process.env.PORT || 3000

/* Configure */
const app = express()
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); 
app.set('json spaces', 2)

const socket_io = require("socket.io")(http);

app.get("/", (req, res) => res.sendFile(__dirname + '/index.html'));
app.get("/get_single_patient", repository.getSinglePatient);
app.post("/data_pipe", (req, res) => {
    console.log(req.body)
    return res.send('ok')
});

const server = http.createServer(app);
server.listen(3000, () => console.log(`Server is working at http://localhost:${PORT}`))

module.exports = { server, socket_io }