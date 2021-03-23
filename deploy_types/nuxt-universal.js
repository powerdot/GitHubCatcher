const shell = require('shelljs');

module.exports = function(p){
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
    return true;
}