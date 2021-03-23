var http = require('http')
var createHandler = require('github-webhook-handler')
var handler = createHandler({ path: '/', secret: 'deploymyfriend' })
const shell = require('shelljs');
let path = require("path");

let params = {
	"actid-cards-core": {
		path: "/node/actid-cards-core",
		pm2: "cards-core",
		branch: 'master'
	},
	"Actid-ChatConnect": {
		path: "/node/Actid-ChatConnect",
		pm2: "chatconnect",
		branch: 'master'
	},
	"Actid-Wallet": {
		path: "/node/Actid-Wallet",
		pm2: "wallet",
		branch: 'master'
	},
	"Actid-Inventory": {
		path: "/node/Actid-Inventory",
		pm2: "inventory",
		branch: 'master'
	},
	"gcloud-game0admin": {
		path: "/node/gcloud-game0admin",
		pm2: "game0",
		branch: 'master'
	},
	"aMenu-server": {
		path: "/node/aMenu-server",
		pm2: "amenu",
		branch: 'master'
	},
	"cnctes-nuxt": {
		type: 'nuxt-universal',
		pm2: "cnctes",
		branch: 'master',
		path: "/node/cnctes_nuxt",
		build_command: "npm run build",
    git_link_path: "evaproject/cnctes-nuxt",
    port: 3422
	}
	// "Easyren-Flow": {
	// 	type: 'vue-frontend',
	// 	git_link_path: "powerdot/Easyren-flow",
	// 	path: "/home/powerdot/node/",
	// 	temp_name: "EasyrenFlow_temp",
	// 	frontend_path: "Frontend-flow/public",
	// 	build_command: "npm run build",
	// 	branch: 'master'
	// }
};

let port = 2020;

http.createServer(function (req, res) {
  handler(req, res, function (err) {
    res.statusCode = 404;
    res.end('no such location')
  })
}).listen(port);
console.log("GitHub webhook started on port", 2020);

handler.on('error', function (err) {
  console.error('Error:', err.message)
});

handler.on('push', function (event) {
  let p = params[event.payload.repository.name]
  if(!p) return;
  console.log('Received a push event for %s to %s',event.payload.repository.name,event.payload.ref);
  if(event.payload.ref != 'refs/heads/'+p.branch){
    console.log("No need to update cause not",p.branch,'branch.');
    return;
  }
  if(p.type === 'nuxt-universal'){
    shell.cd('/');

    console.info("[GitDeploy] -> cleaning folder", p.path);
    shell.exec(`rm -r -f ${p.path} && mkdir ${p.path}`);

    console.info("[GitDeploy] -> going to", p.path);
    shell.cd(p.path);

    console.info(`[GitDeploy] -> git clone`)
    shell.exec(`git clone git@github.com:${p.git_link_path} ${p.path}`);

    console.info("[GitDeploy] -> removing package-lock.json");
    shell.exec(`rm -f package-lock.json`);

    console.info("[GitDeploy] -> removing yarn.json");
    shell.exec(`rm -f yarn.lock`);

    console.info('[GitDeploy] -> running npm i')
    shell.exec(`npm i`);

    console.info("[GitDeploy] -> running", p.build_command)
    shell.exec(p.build_command);

    console.info(`[GitDeploy] -> stopping pm2 ${p.pm2}`)
    shell.exec(`pm2 delete ${p.pm2}`);
    
    console.info(`[GitDeploy] -> starting pm2 ${p.pm2}`)
    shell.exec(`pm2 start nuxt --name "${p.pm2}" -- start -p ${p.port} -H 0.0.0.0`);

    shell.cd('/');

    console.info("[GitDeploy] -> done!");
	
  }else if(p.type === 'vue-frontend'){
    let temp_id = Math.ceil(Math.random()*100000000);
    let tmpPath = p.path+p.temp_name+temp_id;
    let deployPath = p.path + p.frontend_path;
    
    console.info("[GitDeploy] -> going to", p.path);
    shell.cd(p.path);

    console.info(`[GitDeploy] -> git clone ${p.git_link_path} into ${tmpPath}`)
    shell.exec(`git clone git@github.com:${p.git_link_path} ${tmpPath}`);

    console.info("[GitDeploy] -> going to", tmpPath);
    shell.cd(tmpPath);

    console.info("[GitDeploy] -> removing package-lock.json");
    shell.exec(`rm -f package-lock.json`);

    console.info("[GitDeploy] -> removing yarn.json");
    shell.exec(`rm -f yarn.lock`);

    console.info('[GitDeploy] -> running npm i')
    shell.exec(`npm i`);

    console.info("[GitDeploy] -> running", p.build_command)
    shell.exec(p.build_command);

    console.info(`[GitDeploy] -> copy files from ${tmpPath}/dist/* to ${deployPath}/`)
    shell.exec(`cp -r ${tmpPath}/dist/* ${deployPath}/`);

    console.info("[GitDeploy] -> going back to", p.path);
    shell.cd(p.path);

    console.info(`[GitDeploy] -> removing temp folder ${tmpPath}`)
    shell.exec(`rm -r -f ${tmpPath}`);

    console.info("[GitDeploy] -> done!");
  }else if(!p.type || p.type === 'backend'){
    shell.exec('cd '+p.path+' && git stash && git pull && npm i && pm2 restart '+p.pm2);
  }
})

handler.on('issues', function (event) {
  console.log('Received an issue event for %s action=%s: #%d %s',
    event.payload.repository.name,
    event.payload.action,
    event.payload.issue.number,
    event.payload.issue.title)
})
