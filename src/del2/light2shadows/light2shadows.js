import '../../style.css';
//Globale variabler:
import * as THREE from "three";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";
import {addCoordSystem} from "../../../static/lib/wfa-coord.js";
import GUI from 'lil-gui'; //Kjør: npm install --save lil-gui

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
	g_renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	g_renderer.setClearColor(0xBFD104, 0xff);  //farge, alphaverdi.
	g_renderer.shadowMap.enabled = true; //NB!
	g_renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	// Scene
	g_scene = new THREE.Scene();
	g_scene.background = new THREE.Color( 0xdddddd );

	// lil-gui kontroller:
	g_lilGui = new GUI();

	// Sceneobjekter
	await addSceneObjects();
	addLight();

	// Kamera:
	g_camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	g_camera.position.x = 30;
	g_camera.position.y = 44;
	g_camera.position.z = 130;
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

	let material = new THREE.MeshStandardMaterial({side: THREE.DoubleSide, wireframe: false});
	material.roughness = 0.4;
	g_lilGui.add(material, 'roughness').min(0).max(1).name("Material Roughness");

	//Plan:
	let geometryPlane = new THREE.PlaneGeometry(200, 200);
	let meshPlane = new THREE.Mesh(geometryPlane, material);
	meshPlane.receiveShadow = true;         //Merk!
	meshPlane.rotation.x = Math.PI / 2;
	g_scene.add(meshPlane);

	// Kule
	let geometrySphere = new THREE.SphereGeometry(2, 32, 32);
	let meshSphere = new THREE.Mesh(geometrySphere, material);
	meshSphere.castShadow = true;       //Merk!
	meshSphere.position.set(-5, 6, 4);
	g_scene.add(meshSphere);

	// Kube
	let geometryCube = new THREE.BoxGeometry(5,5,5);
	let meshCube = new THREE.Mesh(geometryCube, material);
	meshCube.castShadow = true;       //Merk!
	meshCube.position.set(5, 10, 0);
	g_scene.add(meshCube);
}

/**
 * Demonstrerer alle typer lyskilder og tilhørende "helpers" som illustrerer lyskildene.
 */
function addLight() {

	// Ambient:
	let ambientLight1 = new THREE.AmbientLight(0xffffff, 0.3);
	ambientLight1.visible = true;
	g_scene.add(ambientLight1);
	const ambientFolder = g_lilGui.addFolder( 'Ambient Light' );
	ambientFolder.add(ambientLight1, 'visible').name("On/Off");
	ambientFolder.add(ambientLight1, 'intensity').min(0).max(1).step(0.01).name("Intensity");
	ambientFolder.addColor(ambientLight1, 'color').name("Color");

	//** RETNINGSORIENTERT LYS (som gir skygge):
	let directionalLight = new THREE.DirectionalLight(0x11ff00, 0.3);
	directionalLight.visible = false;
	directionalLight.position.set(0, 20, 0);
	directionalLight.castShadow = true;     //Merk!

	directionalLight.shadow.mapSize.width = 1024;
	directionalLight.shadow.mapSize.height = 1024;
	directionalLight.shadow.camera.near = 0;
	directionalLight.shadow.camera.far = 21;
	directionalLight.shadow.camera.left = -15;
	directionalLight.shadow.camera.right = 15;
	directionalLight.shadow.camera.top = 15;
	directionalLight.shadow.camera.bottom = -15;

	g_scene.add(directionalLight);
	// Viser lyskilden:
	const directionalLightHelper = new THREE.DirectionalLightHelper( directionalLight, 10, 0xff0000);
	directionalLightHelper.visible = false;
	g_scene.add(directionalLightHelper);
	// Viser lyskildekamera (hva lyskilden "ser")
	const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
	directionalLightCameraHelper.visible = false;
	g_scene.add(directionalLightCameraHelper);
	//lil-gui:
	const directionalFolder = g_lilGui.addFolder( 'Directional Light' );
	directionalFolder.add(directionalLight, 'visible').name("On/Off").onChange(value => {
		directionalLightHelper.visible = value;
		directionalLightCameraHelper.visible = value;
	});
	directionalFolder.add(directionalLight, 'intensity').min(0).max(1).step(0.01).name("Intensity");
	directionalFolder.addColor(directionalLight, 'color').name("Color");

	//** SPOTLIGHT (penumbra = skarpe kanter dersom 0, mer diffus ved økende verdi):
	const spotLight = new THREE.SpotLight(0xffffff, 0.5, 50, Math.PI*0.3, 0, 0);
	spotLight.visible = false;
	spotLight.castShadow = true;
	spotLight.shadow.camera.near = 10;
	spotLight.shadow.camera.far = 30;
	spotLight.position.set(4, 25, -6);
	g_scene.add(spotLight.target);
	g_scene.add(spotLight);
	// Viser lyskilden:
	const spotLightHelper = new THREE.SpotLightHelper( spotLight );
	spotLightHelper.visible = false;
	g_scene.add( spotLightHelper );
	// Viser lyskildekamera (hva lyskilden "ser")
	const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
	spotLightCameraHelper.visible = false;
	g_scene.add(spotLightCameraHelper);
	//lil-gui:
	const spotFolder = g_lilGui.addFolder( 'Spotlight' );
	spotFolder.add(spotLight, 'visible').name("On/Off").onChange(value => {
		spotLightHelper.visible = value;
		spotLightCameraHelper.visible = value;
	});
	spotFolder.add(spotLight, 'intensity').min(0).max(1).step(0.01).name("Intensity");
	spotFolder.addColor(spotLight, 'color').name("Color");

	//** POINTLIGHT:
	let pointLight = new THREE.PointLight(0xff9000, 0.5);
	pointLight.visible = false;
	pointLight.position.set(0, 25, 0);
	pointLight.shadow.camera.near = 10;
	pointLight.shadow.camera.far = 31;
	pointLight.shadow.mapSize.width = 1024;
	pointLight.shadow.mapSize.width = 1024;
	pointLight.castShadow = true;
	g_scene.add(pointLight);
	// Viser lyskilden:
	const pointLightHelper = new THREE.PointLightHelper( pointLight, 1 );
	pointLightHelper.visible = false;
	g_scene.add( pointLightHelper );
	// Viser lyskildekamera (hva lyskilden "ser"):
	const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
	pointLightCameraHelper.visible = false;
	g_scene.add(pointLightCameraHelper);
	//lil-gui:
	const pointLigthFolder = g_lilGui.addFolder( 'Pointlight' );
	pointLigthFolder.add(pointLight, 'visible').name("On/Off").onChange(value => {
		pointLightHelper.visible = value;
		pointLightCameraHelper.visible = value;
	});
	pointLigthFolder.add(pointLight, 'intensity').min(0).max(1).step(0.01).name("Intensity");
	pointLigthFolder.addColor(pointLight, 'color').name("Color");
	pointLigthFolder.add(pointLight.position, 'y').min(0).max(100).step(1).name("Height");
}

function animate(currentTime) {
	window.requestAnimationFrame((currentTime) => {
		animate(currentTime);
	});

	let delta = g_clock.getDelta();

	//Oppdater trackball-kontrollen:
	g_controls.update();

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
function handleKeys(delta, digger) {
	let rotationSpeed = (Math.PI); // Bestemmer rotasjonshastighet.

	//Roter foten:s
	if (g_currentlyPressedKeys['KeyA']) { //A
		digger.baseRot = digger.baseRot + (rotationSpeed * delta);
		digger.baseRot %= (Math.PI * 2); // "Rull rundt" dersom digger.baseRot >= 360 grader.
	}
	if (g_currentlyPressedKeys['KeyD']) {	//D
		digger.baseRot = digger.baseRot - (rotationSpeed * delta);
		digger.baseRot %= (Math.PI * 2); // "Rull rundt" dersom digger.baseRot >= 360 grader.
	}

	//Roter joint1:
	if (g_currentlyPressedKeys['KeyS']) {	//S
		digger.joint1Rot = digger.joint1Rot + (rotationSpeed * delta);
		digger.joint1Rot %= (Math.PI * 2); // "Rull rundt" dersom digger.joint1Rot >= 360 grader.
	}
	if (g_currentlyPressedKeys['KeyW']) {	//W
		digger.joint1Rot = digger.joint1Rot - (rotationSpeed * delta);
		digger.joint1Rot %= (Math.PI * 2); // "Rull rundt" dersom digger.joint1Rot >= 360 grader.
	}

	//Roter joint2:
	if (g_currentlyPressedKeys['KeyV']) { //V
		digger.joint2Rot = digger.joint2Rot + (rotationSpeed * delta);
		digger.joint2Rot %= (Math.PI * 2); // "Rull rundt" dersom digger.joint2Rot >= 360 grader.
	}
	if (g_currentlyPressedKeys['KeyB']) {	//B
		digger.joint2Rot = digger.joint2Rot - (rotationSpeed * delta);
		digger.joint2Rot %= (Math.PI * 2); // "Rull rundt" dersom digger.joint2Rot >= 360 grader.
	}
}
