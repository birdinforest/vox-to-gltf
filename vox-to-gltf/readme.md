# vox-to-gltf.js
converts [.vox](https://github.com/ephtracy/voxel-model/blob/master/MagicaVoxel-file-format-vox.txt) files 
which can be exported in [MagickaVoxel](https://ephtracy.github.io/) to [.gltf](https://github.com/KhronosGroup/glTF/tree/master/specification/2.0) files. 
It is using [three.js](https://github.com/mrdoob/three.js/), [vox-reader.js](https://github.com/FlorianFe/vox-reader.js) and 
[voxel-triangulation.js](https://github.com/FlorianFe/voxel-triangulation.js). 


## 💾 Installation

 ```bash
npm install --save vox-to-gltf
```

## 🚀 Usage

To include it in your project while using a bundling system like webpack use
 ```js
const voxToGLTF = require('vox-to-gltf');
```


otherwise use
 ```js
const voxToGLTF = require('vox-to-gltf/dist/vox-to-gltf.min.js');
```


To read a .vox file and make a .gltf file out of it you can do something like this
 ```js
const fs = require('fs');
const voxToGLTF = require('vox-to-gltf');

fs.readFile('my-voxel-art.vox', (error, buffer) =>
{
  if(error) throw error;

  let gltfData = voxToGLTF(buffer);
  
  fs.writeFile('my-voxel-art.gltf', gltfData, (error) => 
  {
    if(error) throw err;
    
    console.log('The file has been saved!');
  });
});
```

## 📖 License

(c) 2019 Florian Fechner. [MIT License](https://github.com/FlorianFe/vox-to-gltf/blob/master/LICENSE)

