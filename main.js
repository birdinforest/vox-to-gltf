const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const chalk = require('chalk');
const voxToGLTF = require('./vox-to-gltf/vox-to-gltf.js');

const options = yargs
    .usage(chalk.green('Walk thought directories and convert .vox files to gltf files.'))
    .usage(chalk.yellow('Usage: node main.js <Dirctory>'))
    .demandCommand(1)
    .argv;

async function main() {
    const directories = options._;

    for (const d of directories) {
        if (fs.existsSync(d)) {
            walk(d, (error) => {
                if (error) {
                    console.log(error)
                } else {
                    console.log('-------------------------------------------------------------');
                    console.log('finished.');
                    console.log('-------------------------------------------------------------');
                }
            })
        } else {
            console.log(chalk.red('Error: directory not found!'), d);
        }
    }
}

const walk = function (dir, done) {
    fs.readdir(dir, function (error, list) {
        if (error) {
            return done(error);
        }

        var i = 0;

        (function next() {
            var file = list[i++];

            if (!file) {
                return done(null);
            }

            file = path.join(dir, file);

            fs.stat(file, function (error, stat) {

                if (stat && stat.isDirectory()) {
                    walk(file, function (error) {
                        next();
                    });
                } else {
                    // do stuff to file here
                    if (!(/(^|\/)\.[^\/\.]/g).test(file) && path.extname(file) === '.vox') {
                        console.log(file);
                        const outputFile = file.replace('.vox', '.gltf');
                        fs.readFile(file, (error, buffer) =>
                        {
                            if(error) throw error;

                            voxToGLTF(buffer, (gltfData) => {
                                const gltfString = JSON.stringify(gltfData);
                                fs.writeFile(outputFile, gltfString, (error) =>
                                {
                                    if(error) throw err;

                                    console.log(`The ${file} has been saved as ${outputFile}.`);
                                });
                            });

                        });
                    }

                    next();
                }
            });
        })();
    });
};

main();