import '../../style.css';
//Globale variabler:
import * as THREE from "three";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry';
import {addCoordSystem} from "../../../static/lib/wfa-coord.js";
import GUI from "lil-gui";

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
	g_camera.position.x = 2;
	g_camera.position.y = 2;
	g_camera.position.z = 2;

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
	//*****
	//* BasicMaterial med alphaMap (som kontrollerer gjennomsiktighet vha. en tekstur)
	//*****
	const loader = new THREE.TextureLoader();
	const bricksTexture = await loader.loadAsync('../../../assets/textures/bricks2.jpg');
	const alphamapTexture = await loader.loadAsync('../../../assets/textures/bricks2_alphamap.jpg');
	const materialBasicAlpahamap = new THREE.MeshBasicMaterial({ map:bricksTexture, color: 0xFe550E, wireframe:false, side: THREE.DoubleSide });
	materialBasicAlpahamap.alphaMap = alphamapTexture;
	materialBasicAlpahamap.transparent = true;

	/****
	 * MeshNormalMaterial
	 * Fargen bestemmes av geometriens normalvektorer.
	 */
	const materialNormal = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide, wireframe:false, flatShading: false });

	/****
	 * MeshMatcapMaterial
	 * Simulerer lys vha. matcap-tekstur og normalvektorer.
	 */
	const matCapTexture1 = await loader.loadAsync('../../../assets/textures/matCap1.png');
	const materialMatCap = new THREE.MeshMatcapMaterial({side: THREE.DoubleSide});
	materialMatCap.matcap = matCapTexture1;

	const materialToon = new THREE.MeshToonMaterial();

	const stdTextureNormal = await loader.loadAsync('../../../assets/textures/bricks2_normalmap.jpg');
	const stdTextureDisplacement = await loader.loadAsync('../../../assets/textures/bricks2_displacementmap.jpg');

	const materialStandard = new THREE.MeshStandardMaterial({map: bricksTexture, side: THREE.DoubleSide});
	materialStandard.normalMap = stdTextureNormal;
	materialStandard.normalScale = new THREE.Vector2(0.5, 0.5);
	materialStandard.displacementMap = stdTextureDisplacement;
	materialStandard.displacementScale = 0.02;

	const materialStandardFolder = g_lilGui.addFolder( 'StandardMaterial' );
	materialStandardFolder.add(materialStandard, 'roughness').min(0).max(1).step(0.001).name("Material Roughness");
	materialStandardFolder.add(materialStandard, 'metalness').min(0).max(1).step(0.001).name("Material Metalness");
	materialStandardFolder.add(materialStandard, 'displacementScale').min(0).max(1).step(0.001).name("Displacement scale");
	materialStandardFolder.add(materialStandard.normalScale, 'x').min(0).max(1).step(0.001).name("normalScale.x");
	materialStandardFolder.add(materialStandard.normalScale, 'y').min(0).max(1).step(0.001).name("normalScale.y");

	// For å enkelt kunne bytte materiale:
	const activeMaterial = materialStandard;  //materialStandard, materialToon materialMatCap

	// Objekter:
	const geoPlane = new THREE.PlaneGeometry(1, 1, 100, 100);
	const meshPlane = new THREE.Mesh(geoPlane, activeMaterial);
	meshPlane.name="myPlane";
	console.log(meshPlane.geometry.attributes)

	const geoSphere = new THREE.SphereGeometry(0.5, 64, 64);
	const meshSphere = new THREE.Mesh(geoSphere, activeMaterial);
	meshSphere.name="mySphere";
	meshSphere.position.x = -1.5;

	const geoTorus = new THREE.TorusGeometry(0.3, 0.2, 64, 128);
	const meshTorus = new THREE.Mesh(geoTorus, activeMaterial);
	meshTorus.name="myTorus";
	meshTorus.position.x = 1.5;

	g_scene.add(meshPlane, meshSphere, meshTorus);

}

function createPlane() {

}

function addLights() {
	// Ambient:
	let ambientLight1 = new THREE.AmbientLight(0xffffff, 0.5);
	ambientLight1.visible = true;
	g_scene.add(ambientLight1);
	const ambientFolder = g_lilGui.addFolder( 'Ambient Light' );
	ambientFolder.add(ambientLight1, 'visible').name("On/Off");
	ambientFolder.add(ambientLight1, 'intensity').min(0).max(1).step(0.01).name("Intensity");
	ambientFolder.addColor(ambientLight1, 'color').name("Color");

	// Pointlight:
	let pointLight = new THREE.PointLight(0xff9000, 0.5);
	pointLight.visible = true;
	pointLight.position.set(-3, 3, 2);
	g_scene.add(pointLight);
	// Viser lyskilden:
	const pointLightHelper = new THREE.PointLightHelper( pointLight, 1 );
	pointLightHelper.visible = true;
	g_scene.add( pointLightHelper );
	//lil-gui:
	const pointLigthFolder = g_lilGui.addFolder( 'Pointlight' );
	pointLigthFolder.add(pointLight, 'visible').name("On/Off").onChange(value => {
		pointLightHelper.visible = value;
	});
	pointLigthFolder.add(pointLight, 'intensity').min(0).max(1).step(0.01).name("Intensity");
	pointLigthFolder.addColor(pointLight, 'color').name("Color");
	pointLigthFolder.add(pointLight.position, 'y').min(0).max(10).step(0.001).name("Height");

	//** RETNINGSORIENTERT LYS (som gir skygge):
	let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
	directionalLight.visible = false;
	directionalLight.position.set(0, 6, 0);
	g_scene.add(directionalLight);
	// Viser lyskilden:
	const directionalLightHelper = new THREE.DirectionalLightHelper( directionalLight, 10, 0xff0000);
	directionalLightHelper.visible = true;
	g_scene.add(directionalLightHelper);

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

	const plane = g_scene.getObjectByName("myPlane");
	const sphere = g_scene.getObjectByName("mySphere");
	const torus = g_scene.getObjectByName("myTorus");

	plane.rotation.x = elapsed * 0.2;
	plane.rotation.y = elapsed * 0.2;

	sphere.rotation.x = elapsed * 0.2;
	sphere.rotation.y = elapsed * 0.2;

	torus.rotation.x = elapsed * 0.2;
	torus.rotation.y = elapsed * 0.2;

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