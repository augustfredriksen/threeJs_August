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

/**
 * Beregner falltid for en kule fra en gitt høyde under påvirkning av gravitasjon (uten bruk av ammo.js)
 * Bruker bevegelseslikninger (https://no.wikipedia.org/wiki/Bevegelsesligning)
 *
 * Denne brukes til å beregne distansen etter hvert som kula faller:
 * s = v0*t + ½*a*t*t
 * der:
 *   s er strekning/forflytning,
 *   v0 er startfart,
 *   t er tida fallet tar fra start til slutt
 *   a er tyngdeaksellerasjon (9,81m/s^2).
 * Snur likninga mhp. strekning:
 * v0 = 0,
 * s = ½ * a * t * t
 *
 * Denne brukes til å beregne sluttfarten:
 * v^2 = u^2 + 2*a*s
 * der v1 er sluttfart.
 * Snur likninga:
 * v1 = sqrt(v0^2 + 2*a*s)
 * Her er v0 = 0, gir:
 * v1 = sqrt(2*a*s)
 *
 * Fallenergi beregnes vha.:
 * Ef = m*h*g, der
 * m er masse, h er høyde, og g er tyngdeaksellerasjon (9,81m/s^2).
 */
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
	addCoordSystem(g_scene);

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
	console.log(meshPlane.geometry.attributes)
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
	// Viser lyskilden:
	const directionalLightHelper = new THREE.DirectionalLightHelper( directionalLight, 10, 0xff0000);
	directionalLightHelper.visible = true;
	g_scene.add(directionalLightHelper);
	directionalLight.castShadow = true;     //Merk!
	directionalLight.shadow.mapSize.width = 1024;
	directionalLight.shadow.mapSize.height = 1024;
	directionalLight.shadow.camera.near = 5;
	directionalLight.shadow.camera.far = 110;
	directionalLight.shadow.camera.left = -50;
	directionalLight.shadow.camera.right = 50;
	directionalLight.shadow.camera.top = 50;
	directionalLight.shadow.camera.bottom = -50;
	g_scene.add(directionalLight);
	// Viser lyskildekamera (hva lyskilden "ser")
	const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
	directionalLightCameraHelper.visible = true;

	g_scene.add(directionalLightCameraHelper);

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

			document.getElementById('sphere_distance').innerHTML = mySphere.animation.distance.toFixed(3);
			document.getElementById('sphere_elapsed').innerHTML = elapsed.toFixed(3);
		} else {
			mySphere.animation.active = false;
			mySphere.position.y = 0;
			let stoptime = g_clock.getElapsedTime();
			console.log("Stopptid:" + String(stoptime));
			let velocity = Math.sqrt(2 * 9.81 * mySphere.animation.height);

			console.log("Fart ved kræsj:" + velocity + " m/s");
			const energy = mySphere.animation.mass * 9.81 * mySphere.animation.height
			console.log("Energi ved kræsj (proporsjonal med massen og høyden):" + String(energy) + ' joules');

			document.getElementById('sphere_velocity').innerHTML = velocity.toFixed(2) + " m/s";
			document.getElementById('sphere_energy').innerHTML = energy.toFixed(2) + " joules";
		}
	}

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
