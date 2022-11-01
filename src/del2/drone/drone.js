import '../../style.css';
//Globale variabler:
import * as THREE from "three";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";
import {addCoordSystem} from "../../../static/lib/wfa-coord.js";
import {
	createArmBaseMesh,
	createDroneBaseMesh,
	createEngineMesh,
	createFootMesh,
	createPropellerCoverMesh,
	createPropellerMesh,
	createSphereMesh
} from "./droneHelper.js";

//Globale variabler:
let g_scene, g_renderer, g_camera, g_clock, g_controls;
let g_propellerAngle = 0;
let g_currentlyPressedKeys = [];

//STARTER!
await main();

export async function main() {
	const canvas = document.createElement('canvas');
	document.body.appendChild(canvas);

	// Renderer:
	g_renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
	g_renderer.setSize(window.innerWidth, window.innerHeight);

	// Scene
	g_scene = new THREE.Scene();
	g_scene.background = new THREE.Color( 0xdddddd );
	// Sceneobjekter
	await addSceneObjects();
	addLights();

	// Kamera:
	g_camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	g_camera.position.x = 7;
	g_camera.position.y = 8;
	g_camera.position.z = 20;

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
	g_currentlyPressedKeys[event.keyCode] = false;
}

function handleKeyDown(event) {
	g_currentlyPressedKeys[event.keyCode] = true;
}

async function addSceneObjects() {
	addCoordSystem(g_scene);

	let drone = createDrone();
	drone.name = "myDrone";
	drone.animation = {
		posX: 0,
		posY: 0,
		rotationAngleY: 0
	};
	drone.position.y = 10
	g_scene.add(drone);
}

function createDrone() {
	// Dronekroppen:
	let droneBaseDiameter = 6;
	let droneHeight = 1;
	// Merk: droneBase er et Mesh-objekt (som igjen arver fra Object3D):
	let droneBase = createDroneBaseMesh(droneBaseDiameter, droneHeight);
	//droneBase.position.set(-10, 23, -44);

	// "Pynter" droneBase med noen kuler:
	let radius = droneBaseDiameter/2;
	let noSpheres = 20;     //numberOfSpheres
	let step = (2*Math.PI)/noSpheres;
	for (let angle=0; angle <2*Math.PI; angle+=step) {
		let sphereMesh = createSphereMesh(0.4);
		// Beregne x/z-posisjonen:
		sphereMesh.position.x = radius * Math.cos(angle);
		sphereMesh.position.z = radius * Math.sin(angle);
		// Samme høyde på alle kulene:
		sphereMesh.position.y = droneHeight/2;

		droneBase.add(sphereMesh);
	}

	let droneArm1 = createDroneArm(droneBaseDiameter, droneHeight, 1,  0);
	droneBase.add(droneArm1);

	let droneArm2 = createDroneArm(droneBaseDiameter, droneHeight, 2, Math.PI/2);
	droneBase.add(droneArm2);

	let droneArm3 = createDroneArm(droneBaseDiameter, droneHeight, 3, Math.PI);
	droneBase.add(droneArm3);

	let droneArm4 = createDroneArm(droneBaseDiameter, droneHeight, 4, Math.PI + Math.PI/2);
	droneBase.add(droneArm4);

	return droneBase;
}

/**
 * En dronearm inkludert motor og propell.
 * @param droneDiameter
 * @returns {Group}
 */
function createDroneArm(droneDiameter, droneHeight, armNumber, angle) {
	// Merk: armBase er et Mesh-objekt.
	let armBase = createArmBaseMesh(droneDiameter, droneHeight);
	armBase.rotateY(angle);
	armBase.translateX(droneDiameter);

	let engineBase = createEngineBase(armNumber, droneHeight);
	engineBase.translateX(droneDiameter/2);
	armBase.add(engineBase);

	let footHeight = 2;
	let armFoot = createFootMesh(footHeight);
	armFoot.translateY(-footHeight/2)
	armBase.add(armFoot);

	return armBase;
}

/**
 * Motor og propell m.m.
 * @returns {Group}
 */
function createEngineBase(armNumber, droneHeight) {
	let group = new THREE.Group();
	let height = droneHeight*1.3;
	let motor = createEngineMesh(height);
	group.add(motor);

	let propLengt=6, propHeight=0.1, propWidth=0.7;
	let propeller = createPropeller(armNumber, propLengt, propHeight, propWidth);
	propeller.name = "propeller"+String(armNumber);
	propeller.animation = {
		rotationAngleY: 0
	};
	propeller.position.set(0,height/2 + propHeight/2,0)
	//propeller.rotateY(Math.PI/5);
	motor.add(propeller);

	let cover = createPropellerCoverMesh(3);
	cover.translateY(0.5);
	group.add(cover);

	return group;
}

function createPropeller(armNumber, propLengt, propHeight, propWidth) {
	let group = new THREE.Group();
	let blade1 = createPropellerMesh(propLengt/2, propHeight, propWidth);
	blade1.rotateX(Math.PI/7);
	blade1.translateX(propLengt/4)
	group.add(blade1);
	let blade2 = createPropellerMesh(propLengt/2, propHeight, propWidth);
	blade2.rotateX(-Math.PI/7);
	blade2.translateX(-propLengt/4)
	group.add(blade2);

	group.name = "propeller" + String(armNumber);
	return group;
}

function addLights() {
	let light1 = new THREE.DirectionalLight(0xffffff, 1.0); //farge, intensitet (1=default)
	light1.position.set(2, 1, 4);
	g_scene.add(light1);

	let light2 = new THREE.DirectionalLight(0xffffff, 1.0); //farge, intensitet (1=default)
	light2.position.set(-2, -1, -4);
	g_scene.add(light2);

	let light3 = new THREE.DirectionalLight(0xffffff, 1.0); //farge, intensitet (1=default)
	light3.position.set(100, 300, 300);
	light3.target.position.set(0, 0, 0);
	g_scene.add(light3);
}

function animate(currentTime) {
	window.requestAnimationFrame((currentTime) => {
		animate(currentTime);
	});

	let delta = g_clock.getDelta();

	let propeller_rps = 5; //Rotations Per Second
	let propeller_rotationSpeed = propeller_rps * (2*Math.PI);

	let drone_rps = 0.4; //Rotations Per Second
	let drone_rotationSpeed = drone_rps * (2*Math.PI);

	let elapsedTime = g_clock.getElapsedTime();

	// Lager en sirkelbevegelse: Posisjonerer dronen vha. sin/cos:
	let meshDrone = g_scene.getObjectByName("myDrone");
	meshDrone.position.x = Math.sin(elapsedTime) * 20;
	meshDrone.position.z = Math.cos(elapsedTime) * 20;

	// Rotasjon som dronens egen y-akse:
	meshDrone.animation.rotationAngleY = meshDrone.animation.rotationAngleY + (drone_rotationSpeed * delta);
	meshDrone.animation.rotationAngleY %= Math.PI*2;
	meshDrone.rotation.y = meshDrone.animation.rotationAngleY;

	// Roterer propellene:
	let propeller1 = meshDrone.getObjectByName("propeller1");
	propeller1.animation.rotationAngleY = propeller1.animation.rotationAngleY + (propeller_rotationSpeed * delta);
	propeller1.animation.rotationAngleY %= Math.PI*2;
	propeller1.rotation.y = propeller1.animation.rotationAngleY;

	let propeller2 = meshDrone.getObjectByName("propeller2");
	propeller2.animation.rotationAngleY = propeller2.animation.rotationAngleY + (propeller_rotationSpeed * delta);
	propeller2.animation.rotationAngleY %= Math.PI*2;
	propeller2.rotation.y = propeller2.animation.rotationAngleY;

	let propeller3 = meshDrone.getObjectByName("propeller3");
	propeller3.animation.rotationAngleY = propeller3.animation.rotationAngleY + (propeller_rotationSpeed * delta);
	propeller3.animation.rotationAngleY %= Math.PI*2;
	propeller3.rotation.y = propeller3.animation.rotationAngleY;

	let propeller4 = meshDrone.getObjectByName("propeller4");
	propeller4.animation.rotationAngleY = propeller4.animation.rotationAngleY + (propeller_rotationSpeed * delta);
	propeller4.animation.rotationAngleY %= Math.PI*2;
	propeller4.rotation.y = propeller4.animation.rotationAngleY;

	//Oppdater trackball-kontrollen:
	g_controls.update();

	document.getElementById("drone_rps").innerHTML = "Drone rps: <b>" + String(drone_rps) + "</b>";
	document.getElementById("propeller_rps").innerHTML = "Propeller rps: <b>" + String(propeller_rps) + "</b>";
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
