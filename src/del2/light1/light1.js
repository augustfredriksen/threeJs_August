import '../../style.css';
//Globale variabler:
import * as THREE from "three";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";
import {addCoordSystem} from "../../../static/lib/wfa-coord.js";
import {RectAreaLightHelper} from "three/examples/jsm/helpers/RectAreaLightHelper.js";
import GUI from 'lil-gui'; //Kjør: npm install --save lil-gui

//Globale variabler:
let g_scene, g_renderer, g_camera, g_clock, g_controls, g_currentlyPressedKeys = [];

//Bruker lil-gui (i stedet for dat-GUI): SE https://www.npmjs.com/package/lil-gui OG https://lil-gui.georgealways.com/
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
	g_renderer.shadowMapSoft = true;
	g_renderer.shadowMap.type = THREE.PCFSoftShadowMap; //THREE.BasicShadowMap;

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

	let material = new THREE.MeshStandardMaterial({side: THREE.DoubleSide});
	material.roughness = 0.4;

	//Plan:
	let geometryPlane = new THREE.PlaneGeometry(200, 200);
	let meshPlane = new THREE.Mesh(geometryPlane, material);
	meshPlane.rotation.x = Math.PI / 2;
	g_scene.add(meshPlane);

	// Kule
	let geometrySphere = new THREE.SphereGeometry(2, 32, 32);
	let meshSphere = new THREE.Mesh(geometrySphere, material);
	meshSphere.position.set(-5, 6, 4);
	g_scene.add(meshSphere);

	// Kube
	let geometryCube = new THREE.BoxGeometry(5,5,5);
	let meshCube = new THREE.Mesh(geometryCube, material);
	meshCube.position.set(5, 3, 0);
	g_lilGui.add(meshCube.position, 'x').min(-100).max(100).name('boks-xPos');
	g_lilGui.add(meshCube.position, 'y').min(0).max(50).name('boks-yPos');
	g_lilGui.add(meshCube.position, 'z').min(-100).max(100).name('boks-yPos');
	g_scene.add(meshCube);
}

/**
 * Demonstrerer alle typer lyskilder og tilhørende "helpers" som illustrerer lyskildene.
 */
function addLight() {

	// Ambient:
	let ambientLight1 = new THREE.AmbientLight(0xffffff, 0.1);
	g_scene.add(ambientLight1);
	g_lilGui.add(ambientLight1, 'intensity').min(0).max(1).name("Ambient intensity");
	g_lilGui.addColor(ambientLight1, 'color').name("Ambient lysfarge");

	//Retningsorientert lys (som gir skygge):
	let directionalLight = new THREE.DirectionalLight(0x00fffc, 0.3);
	directionalLight.position.set(30, 20, -20);
	g_scene.add(directionalLight);

	//HemispehereLight:
	let hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.7);
	g_scene.add(hemisphereLight);

	//PointLight:
	let pointLight = new THREE.PointLight(0xff9000, 0.5);
	pointLight.position.set(-7, 10, -10);
	g_scene.add(pointLight);

	//Spotlight (penumbra = skarpe kanter dersom 0, mer diffus ved økende verdi):
	const spotLight = new THREE.SpotLight(0x78ff00, 0.5, 10, Math.PI*0.1, 0, 0);
	spotLight.position.set(-1, 15, 85);
	g_scene.add(spotLight);

	//RectAreaLight:
	let reactAreaLight = new THREE.RectAreaLight(0x4e00ff, 2 , 10,10);
	reactAreaLight.position.set(5, 5.5, 6);
	g_scene.add(reactAreaLight);

	// Helpers:
	const directionalLightHelper = new THREE.DirectionalLightHelper( directionalLight, 5, 0xff0000);
	g_scene.add(directionalLightHelper);

	const hemisphereLightHelper = new THREE.HemisphereLightHelper( hemisphereLight, 2 );
	g_scene.add( hemisphereLightHelper );

	const pointLightHelper = new THREE.PointLightHelper( pointLight, 1 );
	g_scene.add( pointLightHelper );

	const spotLightHelper = new THREE.SpotLightHelper( spotLight );
	g_scene.add( spotLightHelper );

    const rectAreaLightHelper = new RectAreaLightHelper(reactAreaLight);  //MERK import over.
	g_scene.add(rectAreaLightHelper);
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
