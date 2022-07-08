const util = require('util');
const exec = util.promisify(require('child_process').exec);
const express = require('express')
require("dotenv").config();
const app = express()
const PORT = process.env.PORT

async function bash(file_path, name, package, version) {
  try {
    const { stdout, stderr } = await exec(`bash '${file_path}' -n ${name} -p '${package}' -v '${version}'`);
    console.log(stdout);
    if (stderr) console.log(`[ ERROR ]: ${stderr}`);
    console.log("==========\n\nDONE WITH SCRIPT\n\n==========")
    return stdout
  }catch (err){
    console.error(`[ FATAL ERROR ]: ${err}`);
  };
};

app.get('/deploy/:name/:package/:version', async(req, res) => {
    let name = req.params.name
    let package = req.params.package
    let version = req.params.version

    try{
        console.log(`Fetching for pacakage ID and name of ${name}/${package}:${version} image`)
        let result = await bash('./scripts/get_package.sh', name, package, version).split(",")

        if (result.length == 2){ 
          console.log(`Stopping docker container ${name}/${package}:${version}`)
          await bash('./scripts/stop.sh', result[0], result[1]) // 0 index should be id, 1 should be name
        }

        console.log(`Pulling latest docker ${name}/${package}:${version} image...`)
        await bash('./scripts/pull.sh', name, package, version)
    
        console.log(`Starting docker container ${name}/${package}:${version}`)
        await bash('./scripts/start.sh', name, package, version)

    }catch(err){
        console.error(`[ ERROR ]: ${err}\n\nAbandoning current request.`);
        res.status(400)
    }


    res.status(200).send(`Deploy request received, package: ${req.params.package}`)
})

app.listen(PORT, () => {
    console.log(`Deploy webhook listening at http://localhost:${PORT}`)
})