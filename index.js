let http = require('http')
let createHandler = require('github-webhook-handler')
let path = require("path");
let fs = require("fs");
const { exit } = require('process');
let deploy_types = require('./deploy_types');

// Load configuration 

if(!fs.existsSync(path.resolve(__dirname, 'CONFIG.json'))){
  console.error('Create CONFIG.json like in https://github.com/powerdot/GitHubCatcher/blob/master/CONFIG.json');
  exit(1);
}

let CONFIG = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'CONFIG.json'), {encoding: 'utf-8'}));

if(!CONFIG){
  console.error('Syntax errors in CONFIG.json.');
  exit(1);
}

let base_path = CONFIG.settings.base_path;
let secret = CONFIG.settings.secret;
let port = CONFIG.settings.port;
let params = CONFIG.projects;

// Check for base path

if(!fs.existsSync(base_path)){
  fs.mkdirSync(base_path);
  console.log("Base path created:", base_path);
}


var handler = createHandler({ path: '/', secret })

http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404;
    res.end('no such location')
  })
}).listen(port);
console.log("GitHub webhook started on port:", port);

handler.on('error', function (err) {
  console.error('Error:', err.message)
});

handler.on('push', function (event) {
  let p = params[event.payload.repository.name]
  if(!p) return;
  console.log('Received a push event for %s to %s',event.payload.repository.name,event.payload.ref);
  if(event.payload.ref != 'refs/heads/'+p.branch){
    console.warn("No need to update cause not",p.branch,'branch.');
    return;
  }

  if(p.path){
    if(p.path[0] != "/"){
      p.path = path.resolve(base_path, p.path);
    }
  }else{
    p.path = path.resolve(base_path, event.payload.repository.name);
  }

  let deploy = deploy_types[p.type];
  if(!deploy){
    console.warn("Deploy Type not found:", p.type)
    deploy = deploy_types['simple-backend']
  }

  let deploy_done = deploy(p);

  if(deploy_done){
    console.info("[GitDeploy] -> done!");
  }else{
    console.error("[GitDeploy] -> error:", event.payload.repository.name,event.payload.ref, 'at', (new Date()).toISOString());
  }
});

handler.on('issues', function (event) {
  console.log('Received an issue event for %s action=%s: #%d %s',
    event.payload.repository.name,
    event.payload.action,
    event.payload.issue.number,
    event.payload.issue.title)
})
