import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { VRButton } from 'three/addons/webxr/VRButton.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;                  //Enable the shadow in the remderer'
renderer.shadowMap.type = THREE.PCFShadowMap;
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();
document.body.appendChild(VRButton.createButton(renderer));     //VR BUTTON
renderer.xr.enabled = true;

//Create a PointLight and turn on shadows for the light
const light = new THREE.PointLight(0xffffff, 10, 100);
light.position.set(0, 5, 2);
light.castShadow = true; // default false
scene.add(light);

//Set up shadow properties for the light
light.shadow.mapSize.width = 512; // default
light.shadow.mapSize.height = 512; // default
light.shadow.camera.near = 0.5; // default
light.shadow.camera.far = 500; // default

const loader = new GLTFLoader();
let spiderman;
loader.load('spiderman.glb', function (gltf) {
    spiderman = gltf.scene;
    spiderman.traverse(function (node) {
        if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
        }
    });
    scene.add(spiderman);

}, undefined, function (error) {

    console.error(error);

});
// spiderman.position.set(0, 0, 0);

const geometry = new THREE.PlaneGeometry(100, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xffff00, side: THREE.DoubleSide });
const plane = new THREE.Mesh(geometry, material);
plane.receiveShadow = true;
scene.add(plane);
plane.rotation.x = Math.PI / 2;

camera.position.z = 5;
camera.position.y = 2;
function animate() {
    renderer.setAnimationLoop(function () {

        renderer.render(scene, camera);

    });
}

// create an AudioListener and add it to the camera
const listener = new THREE.AudioListener();
camera.add(listener);

// create a global audio source
const sound = new THREE.Audio(listener);

// load a sound and set it as the Audio object's buffer
const audioLoader = new THREE.AudioLoader();
function soundOn() {
    audioLoader.load('TV Theme Band - Spiderman Theme Song.mp3', function (buffer) {
        sound.setBuffer(buffer);
        sound.setLoop(true);
        sound.setVolume(0.5);
        sound.play();
    });
}



var sp = 0.05;
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keycode = event.which;
    if (keycode == 87) {
        spiderman.position.z += sp;
    }
    if (keycode == 65) {
        spiderman.position.x += sp;
    }
    if (keycode == 66) {
        soundOn();
    }
}
animate();