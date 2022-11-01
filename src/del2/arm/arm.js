import '../../style.css';
//Globale variabler:
import * as THREE from "three";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";
import {addCoordSystem} from "../../../static/lib/wfa-coord.js";
import {createArmMesh,} from "./armHelper.js";

//Globale variabler:
let g_scene, g_renderer, g_camera, g_clock, g_controls, g_currentlyPressedKeys = [];
let g_propellerAngle = 0;

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
	// Sceneobjekter
	await addSceneObjects();
	addLights();

	// Kamera:
	g_camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	g_camera.position.x = 230;
	g_camera.position.y = 400;
	g_camera.position.z = 350;
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
	addCoordSystem(g_scene);

	// Plan:
	let gPlane = new THREE.PlaneGeometry(600, 600, 10, 10);
	let mPlane = new THREE.MeshLambertMaterial({ color: 0x91aff11, side: THREE.DoubleSide, wireframe:true });
	let meshPlane = new THREE.Mesh(gPlane, mPlane);
	meshPlane.rotation.x = Math.PI / 2;
	meshPlane.receiveShadow = true;	//NB!
	g_scene.add(meshPlane);

	//
	let arm = await createArmMesh();
	arm.name = "arm";
	arm.baseRot = 0.0;
	arm.joint1Rot = 0.0;
	arm.joint2Rot = 0.0;
	g_scene.add(arm);
}

function addLights() {
	//Retningsorientert lys (som gir skygge):
	let directionalLight1 = new THREE.DirectionalLight(0xffffff, 1.0); //farge, intensitet (1=default)
	directionalLight1.position.set(0, 300, 0);
	directionalLight1.castShadow = true;
	directionalLight1.shadow.camera.near = 0;
	directionalLight1.shadow.camera.far = 301;
	directionalLight1.shadow.camera.left = -50;
	directionalLight1.shadow.camera.right = 50;
	directionalLight1.shadow.camera.top = 250;
	directionalLight1.shadow.camera.bottom = -250;
	directionalLight1.shadow.camera.visible = true;

	//Hjelpeklasse for å vise lysets utstrekning:
	let lightCamHelper = new THREE.CameraHelper( directionalLight1.shadow.camera );
	g_scene.add( lightCamHelper );

	g_scene.add(directionalLight1);
}

function animate(currentTime) {
	window.requestAnimationFrame((currentTime) => {
		animate(currentTime);
	});

	let delta = g_clock.getDelta();

	//Oppdater trackball-kontrollen:
	g_controls.update();

	//Roterer heile skjiten:
	let arm = g_scene.getObjectByName("arm");
	arm.rotation.y = arm.baseRot;
	let armAndJoint1 = arm.getObjectByName('armAndJoint1', true);  //true = recursive...
	armAndJoint1.rotation.x = arm.joint1Rot;

	let armAndJoint2 = arm.getObjectByName('armAndJoint2', true);  //true = recursive...
	armAndJoint2.rotation.x = arm.joint2Rot;

	//Sjekker input:
	handleKeys(delta, arm);

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
function handleKeys(delta, arm) {
	let rotationSpeed = (Math.PI); // Bestemmer rotasjonshastighet.

	//Roter foten:s
	if (g_currentlyPressedKeys['KeyA']) { //A
		arm.baseRot = arm.baseRot + (rotationSpeed * delta);
		arm.baseRot %= (Math.PI * 2); // "Rull rundt" dersom arm.baseRot >= 360 grader.
	}
	if (g_currentlyPressedKeys['KeyD']) {	//D
		arm.baseRot = arm.baseRot - (rotationSpeed * delta);
		arm.baseRot %= (Math.PI * 2); // "Rull rundt" dersom arm.baseRot >= 360 grader.
	}

	//Roter joint1:
	if (g_currentlyPressedKeys['KeyS']) {	//S
		arm.joint1Rot = arm.joint1Rot + (rotationSpeed * delta);
		arm.joint1Rot %= (Math.PI * 2); // "Rull rundt" dersom arm.joint1Rot >= 360 grader.
	}
	if (g_currentlyPressedKeys['KeyW']) {	//W
		arm.joint1Rot = arm.joint1Rot - (rotationSpeed * delta);
		arm.joint1Rot %= (Math.PI * 2); // "Rull rundt" dersom arm.joint1Rot >= 360 grader.
	}

	//Roter joint2:
	if (g_currentlyPressedKeys['KeyV']) { //V
		arm.joint2Rot = arm.joint2Rot + (rotationSpeed * delta);
		arm.joint2Rot %= (Math.PI * 2); // "Rull rundt" dersom arm.joint2Rot >= 360 grader.
	}
	if (g_currentlyPressedKeys['KeyB']) {	//B
		arm.joint2Rot = arm.joint2Rot - (rotationSpeed * delta);
		arm.joint2Rot %= (Math.PI * 2); // "Rull rundt" dersom arm.joint2Rot >= 360 grader.
	}
}
