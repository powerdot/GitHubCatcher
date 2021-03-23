const shell = require('shelljs');

module.exports = function(p){
    shell.exec('cd '+p.path+' && git stash && git pull && npm i && pm2 restart '+p.pm2);
    return true;
}