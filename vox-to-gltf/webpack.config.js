const path = require('path');

module.exports = {
    mode: 'production',
    entry: './vox-to-gltf.js',
    output: {
        filename: 'vox-to-gltf.min.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'umd'
    },
};