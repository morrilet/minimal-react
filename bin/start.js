#!/usr/bin/env node

const fs = require('fs')
const fse = require('fs-extra')
const path = require('path')
const https = require('https')
const { exec } = require('child_process')

const packageJson = require('../package.json')

const scripts = `"start": "webpack-dev-server --mode=development --open --hot", "build": "webpack --mode=production"`
// const babel = `"babel": ${JSON.stringify(packageJson.babel)}`
const formatDependencies = (deps) => {
    return Object.entries(deps)
        .map(dep => `${dep[0]}@${dep[1]}`)
        .toString()
        .replace(/,/g, " ")  // Replace commas with spaces
        .replace(/\^/g, "")  // Remove ^ from versions
        .replace('/fs-extra[^\s]+/g', "")  // Remove fs-extra from dependencies - it's used internally.
}

console.log('Initializing...')

// Create the folder and initialize NPM
exec(
    `mkdir ${process.argv[2]} && cd ${process.argv[2]} && npm init -f`,
    (initErr, initStdout, initStderr) => {
        if (initErr) {
            console.error(`Initialization error: ${initErr}`);
            return;
        }

        // Replace the default scripts
        const packageJSON = `${process.argv[2]}/package.json`;
        fs.readFile(packageJSON, (err, file) => {
            if (err) throw err;
            const data = file
            .toString()
            .replace(
                '"test": "echo \\"Error: no test specified\\" && exit 1"',
                scripts
            )
            // .replace('"keywords": []', babel);
            fs.writeFile(packageJSON, data, (err2) => err2 || true);
        });
  
        const filesToCopy = ["webpack.config.js", ".babelrc"];
  
        for (let i = 0; i < filesToCopy.length; i += 1) {
            fs.createReadStream(path.join(__dirname, `../${filesToCopy[i]}`)).pipe(
                fs.createWriteStream(`${process.argv[2]}/${filesToCopy[i]}`)
            );
        }
  
        // NPM will remove the .gitignore file when the package is installed, therefore it cannot be copied locally.
        https.get(
            "https://raw.githubusercontent.com/morrilet/minimal-react/master/.gitignore",
            (res) => {
                res.setEncoding("utf8");
                let body = "";
                res.on("data", (data) => {
                    body += data;
                });
                res.on("end", () => {
                    fs.writeFile(
                        `${process.argv[2]}/.gitignore`,
                        body,
                        { encoding: "utf-8" },
                        (err) => {
                            if (err) throw err;
                        }
                    );
                });
            }
        );
  
        console.log("Installing dependencies...");
  
        // Install dependencies.
        const devDeps = formatDependencies(packageJson.devDependencies);
        const deps = formatDependencies(packageJson.dependencies);

        exec(
            `cd ${process.argv[2]} && git init && node -v && npm -v && npm i -D ${devDeps} && npm i -S ${deps}`,
            (npmErr, npmStdout, npmStderr) => {
                if (npmErr) {
                    console.error(`Dependency error: ${npmErr}`);
                    return;
                }
                console.log(npmStdout);
        
                console.log("Copying additional files...");

                // Copy additional source files
                fse.copy(path.join(__dirname, "../src"), `${process.argv[2]}/src`)
                    .then(() => {
                        console.log("All done! Use the below command to run the app.")
                        console.log(`cd ${process.argv[2]}\nnpm start`)
                    })
                    .catch((err) => console.error(err));
            }
        );
    }
);