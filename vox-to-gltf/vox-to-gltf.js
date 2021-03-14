
const readVox = require('vox-reader');
const voxelTriangulation = require('voxel-triangulation');
const zeros = require('zeros');
const { flatten } = require('ramda');
const { BufferGeometry, BufferAttribute, MeshStandardMaterial, Mesh } = require('three');

const THREE = require('three');

const { Blob, FileReader } = require('vblob');

global.window = global;
global.THREE = THREE;
global.Blob = Blob;
global.FileReader = FileReader;

// https://github.com/mrdoob/three.js/issues/9562
require('three/examples/js/exporters/GLTFExporter');

const voxToGLTF = (voxData, callback) => 
{
    let vox = readVox(voxData);

    let voxelData;
    let size;
    let rgba;
    vox.children.forEach(child => {
        if(child.id === 'XYZI') {
            voxelData = child.data.values;
        } else if(child.id === 'SIZE') {
            size = child.data;
        } else if(child.id === 'RGBA') {
            rgba = child.data.values;
        }
    });

    if(!voxelData) {
        console.log('Feta error: Can not get voxel data.');
    }
    if(!size) {
        console.log('Feta error: Can not get size data.');
    }
    if(!rgba) {
        console.log('Feta error: Can not get rgba data.');
    }

    let componentizedColores = rgba.map((c) => [c.r, c.g, c.b])
    let voxels = zeros([size.x, size.y, size.z]);

    voxelData.forEach(({ x, y, z, i }) => voxels.set(x, y, z, i));

    voxels = voxels.transpose(1, 2, 0);

    let { vertices, normals, indices, voxelValues } = voxelTriangulation(voxels);

    let normalizedColors = componentizedColores.map((color) => color.map((c) => c / 255.0));
    let alignedColors = [ [0, 0, 0], ...normalizedColors ];
    let flattenedColors = flatten(voxelValues.map((v) => alignedColors[v]));

    let geometry = new BufferGeometry();

    geometry.addAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
    geometry.addAttribute('normal', new BufferAttribute(new Float32Array(normals), 3));
    geometry.addAttribute('color', new BufferAttribute(new Float32Array(flattenedColors), 3) );
    geometry.setIndex(new BufferAttribute(new Uint32Array(indices), 1));

    let material = new MeshStandardMaterial({ color: '#ffffff', roughness: 1.0, metalness: 1.0 });
    let mesh = new Mesh(geometry, material);
    let exporter = new THREE.GLTFExporter();

    exporter.parse(mesh, (gltfData) => {
        callback(gltfData);
    }, {binary: global.binary});
};

module.exports = voxToGLTF;