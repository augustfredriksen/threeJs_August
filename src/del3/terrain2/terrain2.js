import '../../style.css';

import * as THREE from "three";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";
import {addCoordSystem} from "../../../static/lib/wfa-coord.js";
import GUI from "lil-gui";

//Globale variabler:
let g_scene, g_renderer, g_camera, g_clock, g_controls, g_currentlyPressedKeys = [];
//datGui-kontoller UI: SE https://github.com/dataarts/dat.gui/blob/071edeb334c246ac5eb406010c773dfbb8f6dcce/API.md#guiopen
let g_lilGui;

//STARTER!
await main();

export async function main() {
	const canvas = document.createElement('canvas');
	document.body.appendChild(canvas);

	// Renderer:
	g_renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
	g_renderer.setSize(window.innerWidth, window.innerHeight);
	g_renderer.setClearColor(0xBFD104, 0xff);  //farge, alphaverdi.
	g_renderer.shadowMap.enabled = true; //NB!
	g_renderer.shadowMapSoft = true;
	g_renderer.shadowMap.type = THREE.PCFSoftShadowMap; //THREE.BasicShadowMap;

	// Scene
	g_scene = new THREE.Scene();
	g_scene.background = new THREE.Color( 0xdddddd );

	// lil-gui kontroller:
	g_lilGui = new GUI();

	// Sceneobjekter
	await addSceneObjects();
	addLights();

	// Kamera:
	g_camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
	g_camera.position.x = 2;
	g_camera.position.y = 2;
	g_camera.position.z = 2;

	// TrackballControls:
	g_controls = new TrackballControls(g_camera, g_renderer.domElement);
	g_controls.addEventListener( 'change', renderScene);

	// Klokke for animasjon
	g_clock = new THREE.Clock();

	//Håndterer endring av vindusstørrelse:
	window.addEventListener('resize', onWindowResize, false);
	//Input - standard Javascript / WebGL:
	document.addEventListener('keyup', handleKeyUp, false);
	document.addEventListener('keydown', handleKeyDown, false);

	// Start animasjonsløkka:
	animate(0);
}

function handleKeyUp(event) {
	g_currentlyPressedKeys[event.code] = false;
}

function handleKeyDown(event) {
	g_currentlyPressedKeys[event.code] = true;
}

async function addSceneObjects() {
	addCoordSystem(g_scene);

	const loader = new THREE.TextureLoader();

	const texture = await loader.loadAsync('../../../assets/textures/narviksatellite_1024.png');
	const textureDisplacementmap = await loader.loadAsync('../../../assets/textures/narvik_displacementmap.png');
	const textureNormalmap = await loader.loadAsync('../../../assets/textures/narvik_normalmap.png');

	const material = new THREE.MeshStandardMaterial({map: texture, side: THREE.DoubleSide, wireframe: false});
	material.displacementMap = textureDisplacementmap;
	material.displacementScale = 0.7;
	material.normalMap = textureNormalmap;
	material.normalScale = new THREE.Vector2(0.5, 0.5);

	const materialStandardFolder = g_lilGui.addFolder( 'StandardMaterial' );
	materialStandardFolder.add(material, 'roughness').min(0).max(1).step(0.001).name("Material Roughness");
	materialStandardFolder.add(material, 'metalness').min(0).max(1).step(0.001).name("Material Metalness");
	materialStandardFolder.add(material, 'displacementScale').min(0).max(2).step(0.001).name("Displacement scale");
	materialStandardFolder.add(material, 'displacementBias').min(-10).max(10).step(0.001).name("Displacement bias");
	materialStandardFolder.add(material.normalScale, 'x').min(0).max(1).step(0.001).name("normalScale.x");
	materialStandardFolder.add(material.normalScale, 'y').min(0).max(1).step(0.001).name("normalScale.y");

	// Objekter:
	const geoPlane = new THREE.PlaneGeometry(10, 10, 256, 256);
	const meshPlane = new THREE.Mesh(geoPlane, material);
	meshPlane.rotateX(-Math.PI/2)
	meshPlane.name="myPlane";
	console.log(meshPlane.geometry.attributes)

	g_scene.add(meshPlane);

}

function addLights() {
	// Ambient:
	let ambientLight1 = new THREE.AmbientLight(0xffffff, 0.5);
	ambientLight1.visible = true;
	g_scene.add(ambientLight1);
	const ambientFolder = g_lilGui.addFolder( 'Ambient Light' );
	ambientFolder.add(ambientLight1, 'visible').name("On/Off");
	ambientFolder.add(ambientLight1, 'intensity').min(0).max(1).step(0.01).name("Intensity");
	ambientFolder.addColor(ambientLight1, 'color').name("Color");

	// Pointlight:
	let pointLight = new THREE.PointLight(0xff9000, 0.5);
	pointLight.visible = true;
	pointLight.position.set(-3, 3, 2);
	g_scene.add(pointLight);
	// Viser lyskilden:
	const pointLightHelper = new THREE.PointLightHelper( pointLight, 1 );
	pointLightHelper.visible = true;
	g_scene.add( pointLightHelper );
	//lil-gui:
	const pointLigthFolder = g_lilGui.addFolder( 'Pointlight' );
	pointLigthFolder.add(pointLight, 'visible').name("On/Off").onChange(value => {
		pointLightHelper.visible = value;
	});
	pointLigthFolder.add(pointLight, 'intensity').min(0).max(1).step(0.01).name("Intensity");
	pointLigthFolder.addColor(pointLight, 'color').name("Color");
	pointLigthFolder.add(pointLight.position, 'y').min(0).max(10).step(0.001).name("Height");

	//** RETNINGSORIENTERT LYS (som gir skygge):
	let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
	directionalLight.visible = false;
	directionalLight.position.set(0, 6, 0);
	g_scene.add(directionalLight);
	// Viser lyskilden:
	const directionalLightHelper = new THREE.DirectionalLightHelper( directionalLight, 10, 0xff0000);
	directionalLightHelper.visible = true;
	g_scene.add(directionalLightHelper);

	//lil-gui:
	const directionalFolder = g_lilGui.addFolder( 'Directional Light' );
	directionalFolder.add(directionalLight, 'visible').name("On/Off");
	directionalFolder.add(directionalLight, 'intensity').min(0).max(1).step(0.01).name("Intensity");
	directionalFolder.addColor(directionalLight, 'color').name("Color");
}

function animate(currentTime) {
	window.requestAnimationFrame((currentTime) => {
		animate(currentTime);
	});

	let delta = g_clock.getDelta();
	let elapsed = g_clock.getElapsedTime();

	const plane = g_scene.getObjectByName("myPlane");

	//Oppdater trackball-kontrollen:
	g_controls.update();

	//Sjekker input:
	handleKeys(delta);

	//Tegner scenen med gitt kamera:
	renderScene();
}

function renderScene()
{
	g_renderer.render(g_scene, g_camera);
}


function onWindowResize() {
	g_camera.aspect = window.innerWidth / window.innerHeight;
	g_camera.updateProjectionMatrix();
	g_renderer.setSize(window.innerWidth, window.innerHeight);
	g_controls.handleResize();
	renderScene();
}

//Sjekker tastaturet:
function handleKeys(delta) {
}
