import "../../style.css";
//Threejs-biblioteket (importert via package.json):
import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import { ArcballControls } from "three/examples/jsm/controls/ArcballControls";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";
import { FlyControls } from "three/examples/jsm/controls/FlyControls";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { createScooterMesh } from "./scooterHelper.js";
//Globale variabler:
let g_scene,
	g_renderer,
	g_camera,
	g_clock,
	g_controls,
	g_currentlyPressedKeys = [];

//STARTER!
await main();
export async function main() {
	const canvas = document.createElement("canvas");
	document.body.appendChild(canvas);

	// Renderer:
	g_renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
	g_renderer.setSize(window.innerWidth, window.innerHeight);
	g_renderer.setClearColor(0xbfd104, 0xff); //farge, alphaverdi.
	g_renderer.shadowMap.enabled = true; //NB!
	g_renderer.shadowMap.type = THREE.PCFSoftShadowMap; //THREE.BasicShadowMap;

	// Scene
	g_scene = new THREE.Scene();
	g_scene.background = new THREE.Color(0x333333);
	// Sceneobjekter
	await addSceneObjects();
	addLights();

	// Kamera:
	g_camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	g_camera.position.x = -44;
	g_camera.position.y = 43;
	g_camera.position.z = 50;

	//Håndterer endring av vindusstørrelse:
	window.addEventListener("resize", onWindowResize, false);
	//Input - standard Javascript / WebGL:
	document.addEventListener("keyup", handleKeyUp, false);
	document.addEventListener("keydown", handleKeyDown, false);

	// TrackballControls:
	//g_controls = new TrackballControls(g_camera, g_renderer.domElement);
	//g_controls = new ArcballControls(g_camera, g_renderer.domElement);
	//g_controls = new DragControls(g_camera, g_renderer.domElement);
	//g_controls = new FirstPersonControls(g_camera, g_renderer.domElement);
	//g_controls = new FlyControls(g_camera, g_renderer.domElement);
	g_controls = new OrbitControls(g_camera, g_renderer.domElement);
	//g_controls = new PointerLockControls(g_camera, g_renderer.domElement);
	//g_controls = new TransformControls(g_camera, g_renderer.domElement);
	g_controls.addEventListener("change", renderScene);

	// Klokke for animasjon
	g_clock = new THREE.Clock();

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
	// Koordinatsystem
	let axesHelper = new THREE.AxesHelper(30);
	g_scene.add(axesHelper);

	// Plan:
	let gPlane = new THREE.PlaneGeometry(600, 600, 10, 10);
	let mPlane = new THREE.MeshLambertMaterial({
		color: 0x91aff11,
		side: THREE.DoubleSide,
		wireframe: true,
	});
	let meshPlane = new THREE.Mesh(gPlane, mPlane);
	meshPlane.receiveShadow = false;
	meshPlane.rotation.x = Math.PI / 2;
	g_scene.add(meshPlane);

	let scooter = await createScooterMesh();
	scooter.translateY(2.5);
	g_scene.add(scooter);
}

function addLights() {
	// Ambient:
	let ambientLight1 = new THREE.AmbientLight(0xffffff, 0.5);
	ambientLight1.visible = true;
	g_scene.add(ambientLight1);
	let light1 = new THREE.DirectionalLight(0xffffff, .5); //farge, intensitet (1=default)
	light1.position.set(2, 1, 4);
	g_scene.add(light1);

	let light2 = new THREE.DirectionalLight(0xffffff, .5); //farge, intensitet (1=default)
	light2.position.set(-2, -1, -4);
	g_scene.add(light2);

	let light3 = new THREE.DirectionalLight(0xffffff, .5); //farge, intensitet (1=default)
	light3.position.set(100, 300, 300);
	light3.target.position.set(0, 0, 0);
	g_scene.add(light3);
}

function animate(currentTime) {
	window.requestAnimationFrame((currentTime) => {
		animate(currentTime);
	});

	let delta = g_clock.getDelta();

	let elapsedTime = g_clock.getElapsedTime();

	//Oppdater trackball-kontrollen:
	g_controls.update();

	//ROTERER
	let scooter = g_scene.getObjectByName("base");
	//scooter.scale.set(2,2,2);
	let frontWheel = scooter.getObjectByName("frontWheel", true);
	let baseStick = frontWheel.getObjectByName("bottomStick", true);
	frontWheel.rotation.z = frontWheel.animation.angle;

	// SJEKKER INPUT
	handleKeys(delta, frontWheel);

	//Tegner scenen med gitt kamera:
	renderScene();
}

function handleKeys(delta, frontWheel) {
	let rotationSpeed = Math.PI;

	if (g_currentlyPressedKeys["KeyQ"]) {
		console.log(frontWheel.rotation.z);
		if (frontWheel.animation.angle < 1) {
			frontWheel.animation.angle = frontWheel.animation.angle + rotationSpeed * delta;
			frontWheel.animation.angle %= Math.PI * 2;
		}
	}
	if (g_currentlyPressedKeys["KeyE"]) {
		console.log("E WAS PRESSED");
		if (frontWheel.animation.angle > -1) {
			frontWheel.animation.angle = frontWheel.animation.angle - rotationSpeed * delta;
			frontWheel.animation.angle %= Math.PI * 2;
		}
	}
	if (g_currentlyPressedKeys["KeyA"]) {
		console.log("A WAS PRESSED");

		frontWheel.animation.scale = frontWheel.animation.scale + rotationSpeed * delta;
		frontWheel.animation.scale %= Math.PI * 2;
	}
	if (g_currentlyPressedKeys["KeyD"]) {
		console.log("D WAS PRESSED");
		frontWheel.animation.scale = frontWheel.animation.scale - rotationSpeed * delta;
		frontWheel.animation.scale %= Math.PI * 2;
	}
}

function renderScene() {
	g_renderer.render(g_scene, g_camera);
}

function onWindowResize() {
	g_camera.aspect = window.innerWidth / window.innerHeight;
	g_camera.updateProjectionMatrix();

	g_renderer.setSize(window.innerWidth, window.innerHeight);

	g_controls.handleResize();
	renderScene();
}
