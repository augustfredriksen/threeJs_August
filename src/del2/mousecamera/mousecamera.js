import '../../style.css';
//Globale variabler:
import * as THREE from "three";
import {addCoordSystem} from "../../../static/lib/wfa-coord.js";

//Globale variabler:
let g_scene, g_renderer, g_camera, g_clock, g_currentlyPressedKeys = [];
const g_cursor = {
	x:0,
	y: 0
};
const g_rendererSize = new THREE.Vector2(0,0);

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
	g_renderer.shadowMap.type = THREE.PCFSoftShadowMap; //THREE.BasicShadowMap;

	// Scene
	g_scene = new THREE.Scene();
	g_scene.background = new THREE.Color( 0xdddddd );
	// Sceneobjekter
	await addSceneObjects();
	addLights();

	// Kamera:
	g_camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	g_camera.position.x = 0;
	g_camera.position.y = 0;
	g_camera.position.z = 4;
	g_camera.up = new THREE.Vector3(0, 1, 0);
	let target = new THREE.Vector3(0.0, 0.0, 0.0);
	g_camera.lookAt(target);


	window.addEventListener( 'mousemove', onMouseMove, false);
	window.addEventListener( 'mousedown', onMouseDown, false);
	window.addEventListener( 'mouseup', onMouseUp, false);

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

function onMouseMove(event) {
	g_renderer.getSize(g_rendererSize);
	g_cursor.x = event.clientX / g_rendererSize.x - 0.5;
	g_cursor.y = -(event.clientY / g_rendererSize.y - 0.5);
}

function onMouseDown(event) {
	g_currentlyPressedKeys['mousePressed'] = true;
}

function onMouseUp(event) {
	g_currentlyPressedKeys['mousePressed'] = false;
}

function handleKeyUp(event) {
	g_currentlyPressedKeys[event.code] = false;
}

function handleKeyDown(event) {
	g_currentlyPressedKeys[event.code] = true;
}

async function addSceneObjects() {
	addCoordSystem(g_scene);

	//Geometri-objekter:
	const boxGeometry = new THREE.BoxGeometry(1,1,1);
	let material = new THREE.MeshStandardMaterial({color: 0xf5ef43,side: THREE.DoubleSide, wireframe: false});
	material.roughness = 0.4;
	const boxMesh = new THREE.Mesh(boxGeometry, material);
	boxMesh.name = "myCube";
	g_scene.add(boxMesh);
}

function addLights() {
	// Ambient:
	let ambientLight1 = new THREE.AmbientLight(0xffffff, 0.3);
	g_scene.add(ambientLight1);

	let spotLight = new THREE.SpotLight(0xffffff); //hvitt lys
	spotLight.position.set( 0, 800, 0 );
	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;
	spotLight.shadow.camera.near = 200;
	spotLight.shadow.camera.far = 810;
	g_scene.add(spotLight);
}

function animate(currentTime) {
	window.requestAnimationFrame((currentTime) => {
		animate(currentTime);
	});

	let delta = g_clock.getDelta();

	const boxMesh = g_scene.getObjectByName("myCube");

	//Enkel kamerastyring:
	/*
	g_camera.position.x = g_cursor.x * 10;
	g_camera.position.y = g_cursor.y * 10   ;
	g_camera.lookAt(boxMesh.position);   //NB! Kjør denne etter at position er satt.
	 */

	//Litt mer avansert ...
	if (g_currentlyPressedKeys['mousePressed']) {
		g_camera.position.x = Math.sin(g_cursor.x * Math.PI * 2) * 2;
		g_camera.position.z = Math.cos(g_cursor.x * Math.PI * 2) * 2;
		g_camera.position.y = g_cursor.y * 3;
		g_camera.lookAt(boxMesh.position);  //NB! Kjør denne etter at position er satt.
	}

	//Sjekker input:
	handleKeys(delta);

	//Tegner scenen med gitt kamera:
	renderScene();
}

//Sjekker tastaturet:
function handleKeys(delta) {
	/*
	if (g_currentlyPressedKeys['KeyU']) {
		meshLeftUpperArm.animation.angle = meshLeftUpperArm.animation.angle - (rotationSpeed * delta);
		meshLeftUpperArm.animation.angle %= (Math.PI * 2);
	}
	 */
}

function renderScene()
{
	g_renderer.render(g_scene, g_camera);
}


function onWindowResize() {

	g_camera.aspect = window.innerWidth / window.innerHeight;
	g_camera.updateProjectionMatrix();

	g_renderer.setSize(window.innerWidth, window.innerHeight);

	renderScene();
}
