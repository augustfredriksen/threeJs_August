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
	g_camera.position.x = 30;
	g_camera.position.y = 160;
	g_camera.position.z = 100;

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
	const material = new THREE.MeshStandardMaterial({color: '#ffc206', side: THREE.DoubleSide, wireframe: false});
	material.roughness = 0.5;
	material.metalness = 0.6;

	const materialStandardFolder = g_lilGui.addFolder( 'StandardMaterial' );
	materialStandardFolder.add(material, 'roughness').min(0).max(1).step(0.001).name("Material Roughness");
	materialStandardFolder.add(material, 'metalness').min(0).max(1).step(0.001).name("Material Metalness");

	// For å enkelt kunne bytte materiale:
	const activeMaterial = material;  //material, materialToon materialMatCap

	// Objekter:
	const geoPlane = new THREE.PlaneGeometry(100, 100, 256, 256);
	const meshPlane = new THREE.Mesh(geoPlane, activeMaterial);
	meshPlane.position.y = -2;
	meshPlane.rotateX(-Math.PI/2)
	meshPlane.name="myPlane";
	meshPlane.receiveShadow = true;
	//console.log(meshPlane.geometry.attributes)
	g_scene.add(meshPlane);

	const geoSphere = new THREE.SphereGeometry(2, 64, 64);
	const meshSphere = new THREE.Mesh(geoSphere, activeMaterial);
	meshSphere.castShadow = true;
	meshSphere.name="mySphere";
	meshSphere.animation = {
		distance:0,     // Hvor mange meter kula faller i løpet av tidsenhet.
		height:100,     // Kulas starthøyde.
		mass:1,         // Kulas masse.
		active: true
	}
	meshSphere.position.y = meshSphere.animation.height;
	g_scene.add(meshSphere);

	// Kube
	//Definerer geometri og materiale (her kun farge) for en kube:
	let geometry = new THREE.BoxGeometry(10, 4, 10);
	const cubeMesh = new THREE.Mesh(geometry, material);
	cubeMesh.position.x  = -30;
	cubeMesh.position.z  = 30;
	cubeMesh.name = "myCube";
	cubeMesh.position.y = 20;
	g_scene.add(cubeMesh);

	// Linje
	const lineMaterial = new THREE.LineBasicMaterial( { color: 0x0000ff } );
	const points = [];
	points.push( meshSphere.position );
	points.push( cubeMesh.position );
	const lineGeometry = new THREE.BufferGeometry().setFromPoints( points );
	const line = new THREE.Line( lineGeometry, lineMaterial );
	line.name = "myLine";
	g_scene.add(line);
}

function addLights() {
	// Ambient:
	let ambientLight1 = new THREE.AmbientLight(0xffffff, 0.7);
	ambientLight1.visible = true;
	g_scene.add(ambientLight1);
	const ambientFolder = g_lilGui.addFolder( 'Ambient Light' );
	ambientFolder.add(ambientLight1, 'visible').name("On/Off");
	ambientFolder.add(ambientLight1, 'intensity').min(0).max(1).step(0.01).name("Intensity");
	ambientFolder.addColor(ambientLight1, 'color').name("Color");

	//** RETNINGSORIENTERT LYS (som gir skygge):
	let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
	directionalLight.visible = true;
	directionalLight.position.set(0, 105, 0);
	directionalLight.castShadow = true;     //Merk!
	g_scene.add(directionalLight);

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

	const mySphere = g_scene.getObjectByName("mySphere");
	if (mySphere.animation.active) {
		if (mySphere.position.y > 0) {
			//Beregner distansen,s, kula har falt i løpet av elapsed (tiden fra programmet startet).
			mySphere.animation.distance = 0.5 * 9.81 * (elapsed * elapsed);
			//Setter ny høyde basert på opprinnelig høyde og distance.
			mySphere.position.y = mySphere.animation.height - mySphere.animation.distance;
		} else {
			mySphere.animation.active = false;
			mySphere.position.y = 0;
		}
	}

	const myCube = g_scene.getObjectByName("myCube");
	const myLine = g_scene.getObjectByName("myLine");
	const lineVertexPositions = myLine.geometry.attributes.position.array;
	lineVertexPositions[0] = mySphere.position.x;
	lineVertexPositions[1] = mySphere.position.y;
	lineVertexPositions[2] = mySphere.position.z;
	lineVertexPositions[3] = myCube.position.x;
	lineVertexPositions[4] = myCube.position.y;
	lineVertexPositions[5] = myCube.position.z;
	myLine.geometry.attributes.position.needsUpdate = true;
	myLine.geometry.computeBoundingBox();
	myLine.geometry.computeBoundingSphere();
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
	let cube = g_scene.getObjectByName("myCube");
	//Roter foten:s
	if (g_currentlyPressedKeys['KeyA']) { //A
		cube.position.x -= 0.1;
	}
	if (g_currentlyPressedKeys['KeyD']) {	//D
		cube.position.x += 0.1;
	}

	if (g_currentlyPressedKeys['KeyS']) {	//S
		cube.position.z += 0.1;
	}
	if (g_currentlyPressedKeys['KeyW']) {	//W
		cube.position.z -= 0.1;
	}
}
