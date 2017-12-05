// execute webpack with npm run build
// define "build": "webpack --optimize-minimize" in scripts obj in package.json BEFORE

module.exports = {
    // root point of app (index.js, app.js, main.js,...)
    entry: "./src/client/main.js",

    // where to output and save the transformed code
    output: {
        // path where the bundled file should be generated,  use __dirname to get the current directory and then append dir where it should be saved
        path: __dirname + "/dist",
        // use any name you want, but common is bundle.js.
        filename: "bundle.js"
    },
    // this creates always a new bundle.js file when changes to the js code are made
    watch: true,

    devtool: 'eval-source-map',

    // webpack can thread any type of file as a module and add it to bundle.js (even css)
    module: {
        loaders: [
            // compile es6 to es5 with babel
            {
                // use regex to get files that match certain pattern. Files that match that pattern run through loader
                //this regex runs all js files through loader
                test: /\.js$/,
                // exclude node modules
                exclude: /node_modules/,
                // define the specific (here babel) loader
                loader: "babel-loader",
            },
            // compile sass to css and css to style-tag
            {
                loaders: ["style-loader", "css-loader", "sass-loader"],
                test: /\.scss$/
            },
            // compiles css to style-tag
            {
                loaders: ["style-loader", "css-loader"],
                test: /\.css$/
            }
        ]
    }
};
