import '../../style.css';
import * as THREE from "three";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";
import {addCoordSystem} from "../../../static/lib/wfa-coord.js";
import GUI from "lil-gui";
import {toDegrees} from "../../../static/lib/wfa-utils.js";
import {coarseCollisionTest, fineCollisionTest} from "../../../static/lib/wfa-collision.js";

//Globale variabler:
let g_scene, g_renderer, g_camera, g_clock, g_controls, g_currentlyPressedKeys = [];
//datGui-kontoller UI: SE https://github.com/dataarts/dat.gui/blob/071edeb334c246ac5eb406010c773dfbb8f6dcce/API.md#guiopen
let g_lilGui;
let g_axis = new THREE.Vector3( 0, 1, 0 );
let g_rotationSpeed = Math.PI/50;
//Figurer som helikoptret kan kræsje i:
let g_collidableMeshList = [];

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
	addCoordSystem(g_scene);

	const material1 = new THREE.MeshStandardMaterial({color: '#ffc206', side: THREE.DoubleSide, wireframe: false});
	material1.roughness = 0.5;
	material1.metalness = 0.6;

	const material2 = new THREE.MeshStandardMaterial({color: '#0Fc2e6', side: THREE.DoubleSide, wireframe: false});
	material2.roughness = 0.5;
	material2.metalness = 0.6;

	const materialStandardFolder = g_lilGui.addFolder( 'StandardMaterial' );
	materialStandardFolder.add(material1, 'roughness').min(0).max(1).step(0.001).name("Material Roughness");
	materialStandardFolder.add(material1, 'metalness').min(0).max(1).step(0.001).name("Material Metalness");

	// Planet:
	const geoPlane = new THREE.PlaneGeometry(100, 100, 1, 1);
	const meshPlane = new THREE.Mesh(geoPlane, material1);
	meshPlane.position.y = -2;
	meshPlane.rotateX(-Math.PI/2)
	meshPlane.name="myPlane";
	meshPlane.receiveShadow = true;
	g_scene.add(meshPlane);

	// Kule1:
	const geoSphere = new THREE.SphereGeometry(4, 64, 64);
	const meshSphere = new THREE.Mesh(geoSphere, material1);
	meshSphere.castShadow = true;
	meshSphere.name="mySphere";
	meshSphere.position.x = 34;
	meshSphere.position.y = 4;
	meshSphere.position.z = 30;
	g_scene.add(meshSphere);
	// For kollisjonstesting:
	meshSphere.geometry.computeBoundingSphere();
	g_collidableMeshList.push(meshSphere);

	// Kule2:
	const geoSphere2 = new THREE.SphereGeometry(7, 64, 64);
	const meshSphere2 = new THREE.Mesh(geoSphere2, material2);
	meshSphere2.castShadow = true;
	meshSphere2.name="mySphere";
	meshSphere2.position.x = -34;
	meshSphere2.position.y = 10;
	meshSphere2.position.z = -30;
	g_scene.add(meshSphere2);
	// For kollisjonstesting:
	meshSphere2.geometry.computeBoundingSphere();
	g_collidableMeshList.push(meshSphere2);

	// Helikoptret:
	const meshHelicopter = await createHelicopter();
	meshHelicopter.castShadow = true;	//NB!
	meshHelicopter.position.x = 0;
	meshHelicopter.position.y = 20;
	meshHelicopter.position.z = 0;
	g_scene.add(meshHelicopter);

}

async function createHelicopter() {
	const loader = new THREE.TextureLoader();
	const metalTexture = await loader.loadAsync('../../../assets/textures/metal1.jpg');
	const chocchipTexture = await loader.loadAsync('../../../assets/textures/chocchip.png');

	const helicopter = new THREE.Group();
	helicopter.name = "helicopter";
	helicopter.position.set(new THREE.Vector3(0,20,0));
	helicopter.speed = 0;
	helicopter.direction = new THREE.Vector3(0,0,1); //Pass på at denne har samme retning som helikoptret er tegnet i.

	// lil_gui:
	const heliFolder = g_lilGui.addFolder( 'Helicopter' );

	//Cockpit:
	let gemetryCockpit = new THREE.SphereGeometry(5, 16, 16);					//radius, widthSegments, heightSegments,
	gemetryCockpit.computeBoundingSphere();
	let materialCockpit = new THREE.MeshPhongMaterial({ map: metalTexture });
	let meshCockpit = new THREE.Mesh(gemetryCockpit, materialCockpit);
	meshCockpit.castShadow = true;
	meshCockpit.name = 'cockpit';
	meshCockpit.position.x = 0;
	meshCockpit.position.y = 0;
	meshCockpit.position.z = 0;
	helicopter.add(meshCockpit);

	//Body:
	let geometryBody = new THREE.CylinderGeometry(1.0, 4, 12, 8, 4, false);
	geometryBody.computeBoundingSphere();
	let materialBody = new THREE.MeshPhongMaterial({ map: metalTexture });
	let meshBody = new THREE.Mesh(geometryBody, materialBody);
	meshBody.castShadow = true;
	meshBody.name = 'body';
	meshBody.rotation.z = Math.PI / 2;
	meshBody.position.x = -7;
	meshBody.position.y = 0;
	meshBody.position.z = 0;
	helicopter.add(meshBody);

	//Rotor:
	let geometryRotor = new THREE.BoxGeometry(0.2, 20, 1);
	geometryRotor.computeBoundingSphere();
	let materialRotor = new THREE.MeshPhongMaterial({ map: chocchipTexture });//new THREE.MeshBasicMaterial({ color:0x00de88});
	let meshRotor = new THREE.Mesh(geometryRotor, materialRotor);
	meshRotor.name = 'rotor';
	meshRotor.rotation.z = Math.PI / 2;
	meshRotor.rotation.y = Math.PI / 5;
	meshRotor.position.x = 0;
	meshRotor.position.y = 5;
	meshRotor.position.z = 0;
	meshRotor.castShadow = true;	//Skygge fra rotoren.
	meshRotor.animation = {
		rps: 1,
		angle: 0
	}
	// lil-gui:
	heliFolder.add(meshRotor.animation, 'rps').min(0).max(10).name("Rotor speed");
	helicopter.add(meshRotor);

	//Bakrotor:
	let geometryBackRotor = new THREE.BoxGeometry(5, 1, 0.2);
	geometryBackRotor.computeBoundingSphere();
	let materialBackRotor = new THREE.MeshPhongMaterial({ map: chocchipTexture });//new THREE.MeshBasicMaterial({ color:0x00de88});
	let mashBackRotor = new THREE.Mesh(geometryBackRotor, materialBackRotor);
	mashBackRotor.name = 'back_rotor';
	mashBackRotor.position.x = -13.0;
	mashBackRotor.position.y = 1;
	mashBackRotor.position.z = 0;
	mashBackRotor.animation = {
		rps: 1,
		angle: 0
	}
	// lil-gui:
	heliFolder.add(mashBackRotor.animation, 'rps').min(0).max(10).name("Back Rotor speed");
	helicopter.add(mashBackRotor);
	return helicopter;
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

	// HELICOPTER animation:
	const helicopterrMesh = g_scene.getObjectByName("helicopter");
	// Endrer posisjonsvektoren proporsjonalt med speed:
	helicopterrMesh.position.x = helicopterrMesh.position.x + (helicopterrMesh.direction.x * helicopterrMesh.speed * elapsed);
	helicopterrMesh.position.z = helicopterrMesh.position.z + (helicopterrMesh.direction.z * helicopterrMesh.speed * elapsed);
	// Rotrerer helikoptret i forhold til retningsvektoren:
	helicopterrMesh.rotation.y = Math.atan2(helicopterrMesh.direction.x, helicopterrMesh.direction.z) - Math.PI / 2;

	document.getElementById('heli_rotation').innerHTML = (toDegrees(helicopterrMesh.rotation.y)).toFixed(2);
	document.getElementById('heli_speed').innerHTML = helicopterrMesh.speed.toFixed(3);

	// ROTOR animation:
	const rotorMesh = g_scene.getObjectByName("rotor");
	let rotationSpeed = rotorMesh.animation.rps * (2*Math.PI);
	rotorMesh.animation.angle = rotorMesh.animation.angle + (rotationSpeed * delta);
	rotorMesh.rotation.y = rotorMesh.animation.angle;
	document.getElementById('rps').innerHTML = rotorMesh.animation.rps;
	// BACK-ROTOR animation:
	const backRotorMesh = g_scene.getObjectByName("back_rotor");
	let rotationBackSpeed = backRotorMesh.animation.rps * (2*Math.PI);
	backRotorMesh.animation.angle = backRotorMesh.animation.angle + (rotationBackSpeed * delta);
	backRotorMesh.rotation.z = backRotorMesh.animation.angle;
	document.getElementById('back_rps').innerHTML = backRotorMesh.animation.rps;

	//Oppdater trackball-kontrollen:
	g_controls.update();

	//Sjekker input:
	handleKeys(helicopterrMesh);

	//Kollisjonsdeteksjon:
	collisionTest(helicopterrMesh);

	//Tegner scenen med gitt kamera:
	renderScene();
}

function collisionTest(helicopterrMesh) {
	//Sjekker de ulike helikopterdelene mot collidableMeshList dvs. kula:
	let cockpit = helicopterrMesh.getObjectByName('cockpit', true);
	cockpit.updateMatrixWorld();
	collisionTestMesh(cockpit, helicopterrMesh);
	let body = helicopterrMesh.getObjectByName('body', true);
	body.updateMatrixWorld();
	collisionTestMesh(body, helicopterrMesh);
	let rotor = helicopterrMesh.getObjectByName('rotor', true);
	rotor.updateMatrixWorld();
	collisionTestMesh(rotor, helicopterrMesh);
}

function collisionTestMesh(mesh, helicopterrMesh) {
	//Gjør først grovsjekk vha. boundingsphere:
	if (coarseCollisionTest(mesh, g_collidableMeshList)) {		//Se wfa-collision.js
		//Dersom overlapp mellom sfærene gjøres en finere sjekk vha. Raycast
		if (fineCollisionTest(mesh, g_collidableMeshList)) {  	//Se wfa-collision.js
			// Collision response:
			helicopterrMesh.position.set(0,10,0);
			helicopterrMesh.speed = 0;
			helicopterrMesh.direction = new THREE.Vector3(0,0,1);
		}
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

//Sjekker tastaturet:
function handleKeys(helicopterMesh) {
	if (g_currentlyPressedKeys['KeyA']) { //A
		//Roterer retningsvektoren om y-aksen:
		let matrix = new THREE.Matrix4().makeRotationAxis( g_axis, g_rotationSpeed );
		helicopterMesh.direction.applyMatrix4( matrix );
	}
	if (g_currentlyPressedKeys['KeyD']) {	//D
		//Roterer retningsvektoren om y-aksen (motsatt vei):
		let matrix = new THREE.Matrix4().makeRotationAxis( g_axis, -g_rotationSpeed );
		helicopterMesh.direction.applyMatrix4( matrix );
	}

	// Øker / minker farta:
	if (g_currentlyPressedKeys['KeyW']) {	//W
		if (helicopterMesh.speed < 1)
			helicopterMesh.speed+=0.0051;
	}
	if (g_currentlyPressedKeys['KeyS']) {	//S
		if (helicopterMesh.speed > 0)
			helicopterMesh.speed-=0.005;
	}

	//Høyde (V/B):
	if (g_currentlyPressedKeys['KeyV']) { //V
		helicopterMesh.position.y -= 0.3;
	}
	if (g_currentlyPressedKeys['KeyB']) {	//B
		helicopterMesh.position.y += 0.3;
	}
}
