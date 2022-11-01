import * as THREE from "three";
import GUI from "lil-gui";
import {
	applyCentralForce,
	applyCentralImpulse,
	applyForce,
	applyImpulse,
	applyTorqueImpulse,
	applyTorque,
	moveRigidBody, setAngularVelocity, setLinearVelocity, setMoving
} from "./box";
import {createRandomSpheres} from "./sphere.js";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls.js";

export let g_scene;
let g_renderer, g_camera, g_controls, g_lilGui;

export function createThreeScene() {
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
	//await addSceneObjects();
	addLights();

	// Kamera:
	g_camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
	g_camera.position.x = 30;
	g_camera.position.y = 160;
	g_camera.position.z = 100;

	// TrackballControls:
	g_controls = new TrackballControls(g_camera, g_renderer.domElement);
	g_controls.addEventListener( 'change', renderScene);
}

export function addLights() {
	// Ambient:
	let ambientLight1 = new THREE.AmbientLight(0xffffff, 0.7);
	ambientLight1.visible = true;
	g_scene.add(ambientLight1);

	//** RETNINGSORIENTERT LYS (som gir skygge):
	let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
	directionalLight.visible = true;
	directionalLight.castShadow = true;     //Merk!
	directionalLight.position.set(0, 105, 0);
	g_scene.add(directionalLight);
}

//Sjekker tastaturet:
export function handleKeys(delta, g_currentlyPressedKeys) {
	if (g_currentlyPressedKeys['KeyH']) {
		createRandomSpheres(200);
	}
	const box = g_scene.getObjectByName("box");

	if (g_currentlyPressedKeys['KeyF']) {
		applyForce(box, {x:0, y:200, z:0});
	}
	if (g_currentlyPressedKeys['KeyT']) {
		applyTorque(box,{x:1000, y:0, z:0});
	}
	if (g_currentlyPressedKeys['KeyI']) {
		applyImpulse(box,{x:0, y:30, z:0});
	}
	if (g_currentlyPressedKeys['KeyU']) {
		applyTorqueImpulse(box,{x:50, y:0, z:0});
	}
	if (g_currentlyPressedKeys['KeyC']) {
		applyCentralForce(box,{x:0, y:600, z:0});
	}
	if (g_currentlyPressedKeys['KeyP']) {
		applyCentralImpulse(box,{x:0, y:100, z:0});
	}

	if (g_currentlyPressedKeys['KeyZ']) {
		setLinearVelocity(box,{x:1, y:0, z:-1});
	}
	if (g_currentlyPressedKeys['KeyX']) {
		setAngularVelocity(box,{x:0, y:0, z:1});
	}

	const movable = g_scene.getObjectByName("movable");
	if (g_currentlyPressedKeys['KeyA']) {	//A
		moveRigidBody(movable,{x: -0.2, y: 0, z: 0});
	}
	if (g_currentlyPressedKeys['KeyD']) {	//D
		moveRigidBody(movable,{x: 0.2, y: 0, z: 0});
	}
	if (g_currentlyPressedKeys['KeyW']) {	//W
		moveRigidBody(movable,{x: 0, y: 0, z: -0.2});
	}
	if (g_currentlyPressedKeys['KeyS']) {	//S
		moveRigidBody(movable,{x: 0, y: 0, z: 0.2});
	}

}

export function onWindowResize() {
	g_camera.aspect = window.innerWidth / window.innerHeight;
	g_camera.updateProjectionMatrix();
	g_renderer.setSize(window.innerWidth, window.innerHeight);
	g_controls.handleResize();
	renderScene();
}

export function updateThree(deltaTime) {
	//Oppdater trackball-kontrollen:
	g_controls.update();
}

export function addMeshToScene(mesh) {
	g_scene.add(mesh);
}

export function renderScene()
{
	g_renderer.render(g_scene, g_camera);
}

export function getRigidBodyFromMesh(meshName) {
	const mesh = g_scene.getObjectByName(meshName);
	if (mesh)
		return mesh.userData.physicsBody;
	else
		return null;
}

export function addArrowHelper(mesh, direction, origin, name, color=0xff0000, length=10) {
	const meshDirectionArrow = new THREE.ArrowHelper( direction, origin, length, color );
	meshDirectionArrow.name = name;
	mesh.add(meshDirectionArrow);
}
