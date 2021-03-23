const shell = require('shelljs');

module.exports = function(p){
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
    return true;
}