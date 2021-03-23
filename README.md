# GitHubCatcher



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
Clone here your github existing project.  
```
git clone https://github.com/USERNAME/PROJECTNAME.git
```

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
