# GitHubCatcher

# Wtf

Can fetch and deploy:
- Basic NodeJS project (simple-backend)
- Build static files and move it to public backend folder for Vue (vue-frontend)
- Build and serve nuxt project (nuxt-universal)

On your own server!

Requirements:
- NodeJS >= 10
- NPM (globally)
- PM2 (globally)
- Git

# Installing

## First
Install PM2 to controll processes
```
npm i pm2 -g
```

## Second
Go to root directory
```
cd /
```
Clone this project:
```
git clone https://github.com/powerdot/GitHubCatcher.git
```

## Third
Determine dir where you will store your projects.  
For example: `/node`  
Create it.
```
mkdir node
```

## Fourth
Clone here your github existing project to base path.  
```
git clone https://github.com/USERNAME/PROJECTNAME.git
```
**This step needed for each project. This is initial deployment.**

## Fifth
Configure GitHubCatcher.
Go to GitHubCatcher folder:
```
cd /GitHubCatcher
```
Open CONFIG.json
```
nano CONFIG.json
```
Enter your port, secret, and base path (projects dir).
```
{
    "settings": {
        "port": 2021,
        "base_path": "/node/",
        "secret": "my_secret_word"
    },

    "projets": {
        "PROJECTNAME": {
            "pm2": "my_project",
            "branch": "master"
        }
    }
}
```
Save and close (CTRL+X): Y

- Project is a object that indexed as GitHub project name, for example: https://github.com/powerdot/`GitHubCatcher`/
- `pm2` key is a name of process in PM2. Need to stop and restart project.
- `branch` key is a name of branch to listen.  
  
Optional:
- `path` key is a subdir of your `base_path`: /node/`here_is_path`/
- `git_link_path` key is a GitHub path to fetch your project, example: `/powerdot/GitHubCatcher`. *For vue-frontend, nuxt-universal*
- `build_command` key is a build-step termimal command, basicly: `npm start build`. *For vue-frontend, nuxt-universal*
- `temp_name` key is a temprary folder name to build your app and then move it to main directory. *For vue-frontend*

## Sixth
Install packages:
```
npm i
```
Run GitHubCatcher
```
pm2 start index.js --name gitcatch
```

## Done!

Rigth now I developing [Basic-Nice](https://github.com/powerdot/Basic-Nice-CICD) CICD based on this project.  
Contribute your code and help to upgrade project.

# For Private Projects

[Setup](https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh) certificates.
