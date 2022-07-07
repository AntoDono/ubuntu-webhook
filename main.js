const { exec } = require("child_process");
const express = require('express')
require("dotenv").config();
const app = express()
const PORT = process.env.PORT

app.get('/deploy/:name', (req, res) => {
    res.status(200).send(`Deploy request received, name: ${req.params.name}`)
    exec(`sudo docker pull ${req.params.name}:latest`, (error, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        if (error !== null) {
            console.log(`exec error: ${error}`);
        }
    })
    console.log(`Pulling latest docker ${req.params.name} image...`)
    exec(`sudo docker restart ${req.params.name}:latest`, (error, stdout, stderr) => {
        console.log(stdout);
        console.log(stderr);
        if (error !== null) {
            console.log(`exec error: ${error}`);
        }
    })
    console.log(`Restartubg docker container ${req.params.name}:latest`)
})

app.listen(PORT, () => {
    console.log(`Deploy webhook listening at http://localhost:${PORT}`)
})