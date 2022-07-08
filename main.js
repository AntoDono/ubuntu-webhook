const util = require('util');
const exec = util.promisify(require('child_process').exec);
const express = require('express')
require("dotenv").config();
const app = express()
const PORT = process.env.PORT

async function bash(file_path, arg) {
  try {
    const { stdout, stderr } = await exec(`bash '${file_path}' ${arg}`);
    console.log(stdout);
    if (stderr) console.log(`[ ERROR ]: ${stderr}`);
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
        console.log(`[Redeploy Sys]: Fetching for pacakage ID and name of ${name}/${package}:${version} image`)
        let result = (await bash('./scripts/get_package.sh', `-n ${name} -p '${package}' -v '${version}'`)).split(",")

        if (result.length == 2){ 
          console.log(`[Redeploy Sys]: Running container already exists, stopping ${name}/${package}:${version}`)
          await bash('./scripts/stop.sh', `-n ${result[0]} -i '${result[1]}'`) // 0 index should be id, 1 should be name
          console.log(`[Redeploy Sys]: Removing name of container ${name}/${package}:${version}`)
          await bash('./scripts/rm.sh', `-n ${result[0]} -i '${result[1]}'`) // 0 index should be id, 1 should be name
        }

        console.log(`[Redeploy Sys]: Pulling latest docker ${name}/${package}:${version} image...`)
        await bash('./scripts/pull.sh', `-n ${name} -p '${package}' -v '${version}'`)
    
        console.log(`[Redeploy Sys]: Starting docker container ${name}/${package}:${version}`)
        await bash('./scripts/start.sh', `-n ${name} -p '${package}' -v '${version}'`)

    }catch(err){
        console.error(`[ ERROR ]: ${err}\n\nAbandoning current request.`);
        res.status(400)
    }


    res.status(200).send(`Deploy request received, package: ${req.params.package}`)
})

app.listen(PORT, () => {
    console.log(`Deploy webhook listening at http://localhost:${PORT}`)
})