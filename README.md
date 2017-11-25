
###INTRODUCTION

Out Project have the Goal to provide a visualization for the OPTICS Clustering Algorithm.
For more Details see http://localhost:8080/M2/

###PROJECT STRUCTURE (not final)

```
.
├── dist                        # minified/concatenated/bundled client side code and static resources, used on production sites
│   ├── img
│   ├── bundle.js
│   └── index.html
├── doc                         # documentation generated by jsdoc
├── node_modules                # dependencies of the Project (defined in package.json)
├── src                         # "source" files to build and develop the project.   
│   ├── client                  # raw client-side code (js, scss) before minification, concatenation & bundling, used to read/edit the client-side code.
│   │   ├── components          # parts of the Application with a specific Functionality (e.g. for a Online-Shop: Chart, Customer, Billing,...)
│   │   │   └── App
│   │   │       ├── app.js
│   │   │       └── app.scss
│   │   ├── shared              # mixins and classes which are shared between components
│   │   └── main.js             # entry point for webpack
│   └── server                  # server-side code (e.g. api's, business logic, persistence)
│       └── main.js             # config of server
├── test                        # the project's tests scripts
├── .babelrc                    # babel config
├── .gitignore
├── package.json                # build scripts and dependencies
├── README.md
└── webpack.config.js
```


###REQUIREMENTS
-node (use latest lts version, i recommend installation via nvm - https://github.com/creationix/nvm/blob/master/README.md,
but you can also just download the latest lts version of node from the node.js website)

-npm (usually npm ships with node, to update: "npm install npm@latest -g")


###USAGE

1. npm update - update package.json Dependencies (only after first download via gitlab)
2. npm run build - updates the js code (bundle.js) whenever changes to the Code are made
3. npm run server - starts the server

! Don't exit the processes "build" & "server" by Typing Strg + C, if you wanna do something in the Terminal, open a new Terminal Window


###TROUBLESHOOTING

#####Webpack reports error during module bundling
delete node_modules folder and run "npm update" in terminal

#####You have Accidentally pushed node_modules folder to gitlab (which can cause errors by other users)
1. git rm -r --cached node_modules
2. git commit -m 'Remove the now ignored directory node_modules'
3. git push origin master

#####Webpack don't update my bundle.js code / the browser don't reflect the changes I made to the Code
* Check if you haven't closed the terminal Window where webpack runs after typing npm run build,
if you have hit "Strg + C" you have killed the watch process. You have to run webpack and express server in different Terminal Windows. 
* Clear the cache of the Browser, you can make this process easier by using Plugins e.g. search for "Clear Cache Chrome Plugin"
 
#####Webstorm complains about wrong js Syntax
Go to File -> Settings -> Languages & Frameworks -> JavaScript and change "Javascript language version" to "ECMAScript 6"
  
#####Error Messages from Webpack saying Module error: Unexpected ...
Most likely a dependency Problem, because some Packages don't install all required Dependencies for them automatically (e.g. "sass-loader" needs "node-sass", but
don't install it during the installation of sass-loader). Check your package.json file for this kind of missing dependencies.
You can also delete your node_modules folder and run npm update, during the reinstallation of the packages npm will warn you about needed,
but not installed dependencies. 