import '../../style.css';
//Globale variabler:
import * as THREE from "three";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";
import {createBoxmanMesh} from "./boxmanHelper.js";
import {addCoordSystem} from "../../../static/lib/wfa-coord.js";

//Globale variabler:
let g_scene, g_renderer, g_camera, g_clock, g_controls, g_currentlyPressedKeys = [];;
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
	g_camera.position.x = 30;
	g_camera.position.y = 70;
	g_camera.position.z = 80;
	g_camera.up = new THREE.Vector3(0, 1, 0);
	let target = new THREE.Vector3(0.0, 0.0, 0.0);
	g_camera.lookAt(target);

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
	let boxManMesh = await createBoxmanMesh();
	g_scene.add(boxManMesh);

	// Alternativt eget koordinatsystem:
	addCoordSystem(g_scene);
}

function addLights() {
	let spotLight = new THREE.SpotLight(0xffffff); //hvitt lys
	spotLight.position.set( 0, 800, 0 );
	spotLight.castShadow = true;
	spotLight.shadow.mapSize.width = 1024;
	spotLight.shadow.mapSize.height = 1024;
	spotLight.shadow.camera.near = 200;
	spotLight.shadow.camera.far = 810;
	//spotLight.shadowCameraVisible = true;		//NB!! Viser lyskildens posisjon og utstrekning.
	g_scene.add(spotLight);
}

function animate(currentTime) {
	window.requestAnimationFrame((currentTime) => {
		animate(currentTime);
	});

	let delta = g_clock.getDelta();

	let meshTorso = g_scene.getObjectByName("torso");
	meshTorso.scale.set(2,2,2);

	//HØYRE ARM (over&under):
	let meshRightUpperArm = meshTorso.getObjectByName('rightUpperArm', true);
	let meshRightLowerArm = meshTorso.getObjectByName('rightLowerArm', true);
	//Merk: finner opprinnelig størrelse.
	let rightUpperArmWidth = meshRightUpperArm.geometry.parameters.width;

	meshRightUpperArm.translateX(-rightUpperArmWidth / 2);	    //Flytt til sentrum ...
	meshRightUpperArm.rotation.z = meshRightUpperArm.animation.angle;   //roter ...
	meshRightUpperArm.translateX(rightUpperArmWidth / 2);	    //Flytt tilbake.

	meshRightLowerArm.translateX(-rightUpperArmWidth / 2);
	meshRightLowerArm.rotation.z = meshRightLowerArm.animation.angle;
	meshRightLowerArm.translateX(rightUpperArmWidth / 2);

	//VENSTRE ARM (over&under)
	let meshLeftUpperArm = meshTorso.getObjectByName('leftUpperArm', true);
	let meshLeftLowerArm = meshTorso.getObjectByName('leftLowerArm', true);
	//Merk: henter opprinnelig str.
	let leftUpperArmWidth = meshRightUpperArm.geometry.parameters.width;
	meshLeftUpperArm.translateX(leftUpperArmWidth / 2);
	meshLeftUpperArm.rotation.z = meshLeftUpperArm.animation.angle;
	meshLeftUpperArm.translateX(-leftUpperArmWidth / 2);

	meshLeftLowerArm.translateX(leftUpperArmWidth / 2);
	meshLeftLowerArm.rotation.z = meshLeftLowerArm.animation.angle;
	meshLeftLowerArm.translateX(-leftUpperArmWidth / 2);

	//Sjekker input:
	handleKeys(delta, meshRightUpperArm, meshRightLowerArm, meshLeftUpperArm, meshLeftLowerArm);

	//Oppdater trackball-kontrollen:
	g_controls.update();

	//Tegner scenen med gitt kamera:
	renderScene();
}

//Sjekker tastaturet:
function handleKeys(delta, meshRightUpperArm, meshRightLowerArm, meshLeftUpperArm, meshLeftLowerArm) {
	let rotationSpeed = (Math.PI); // Bestemmer rotasjonshastighet.

	//RIGHT ARM:
	if (g_currentlyPressedKeys['KeyA']) { //A
		meshRightLowerArm.animation.angle = meshRightLowerArm.animation.angle + (rotationSpeed * delta);
		meshRightLowerArm.animation.angle %= (Math.PI * 2);
	}
	if (g_currentlyPressedKeys['KeyD']) {	//D
		meshRightLowerArm.animation.angle = meshRightLowerArm.animation.angle - (rotationSpeed * delta);
		meshRightLowerArm.animation.angle %= (Math.PI * 2);
	}

	if (g_currentlyPressedKeys['KeyS']) {	//S
		meshRightUpperArm.animation.angle = meshRightUpperArm.animation.angle + (rotationSpeed * delta);
		meshRightUpperArm.animation.angle %= (Math.PI * 2);
	}
	if (g_currentlyPressedKeys['KeyW']) {	//W
		meshRightUpperArm.animation.angle = meshRightUpperArm.animation.angle - (rotationSpeed * delta);
		meshRightUpperArm.animation.angle %= (Math.PI * 2);
	}
	// LEFT ARM
	if (g_currentlyPressedKeys['KeyH']) {
		meshLeftLowerArm.animation.angle = meshLeftLowerArm.animation.angle + (rotationSpeed * delta);
		meshLeftLowerArm.animation.angle %= (Math.PI * 2);
	}
	if (g_currentlyPressedKeys['KeyK']) {
		meshLeftLowerArm.animation.angle = meshLeftLowerArm.animation.angle - (rotationSpeed * delta);
		meshLeftLowerArm.animation.angle %= (Math.PI * 2);
	}
	if (g_currentlyPressedKeys['KeyJ']) {
		meshLeftUpperArm.animation.angle = meshLeftUpperArm.animation.angle + (rotationSpeed * delta);
		meshLeftUpperArm.animation.angle %= (Math.PI * 2);
	}
	if (g_currentlyPressedKeys['KeyU']) {
		meshLeftUpperArm.animation.angle = meshLeftUpperArm.animation.angle - (rotationSpeed * delta);
		meshLeftUpperArm.animation.angle %= (Math.PI * 2);
	}
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
