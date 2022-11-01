import '../../style.css';

import * as THREE from "three";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";
import {addCoordSystem} from "../../../static/lib/wfa-coord.js";
import GUI from "lil-gui";
import {getHeigtdataFromImage} from "../../../static/lib/wfa-utils.js";

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
	g_camera.position.x = 200;
	g_camera.position.y = 400;
	g_camera.position.z = 400;

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

	const loader = new THREE.TextureLoader();
	const texture = await loader.loadAsync('../../../assets/textures/chocchip.png');
	const material = new THREE.MeshStandardMaterial({map: texture, side: THREE.DoubleSide, wireframe: false});

	const materialStandardFolder = g_lilGui.addFolder( 'StandardMaterial' );
	materialStandardFolder.add(material, 'roughness').min(0).max(1).step(0.001).name("Material Roughness");
	materialStandardFolder.add(material, 'metalness').min(0).max(1).step(0.001).name("Material Metalness");

	const p_width = 128, p_height = 128; //heightmap.png har størrelse = 128 x 128 piksler.
	const geoPlane = new THREE.PlaneGeometry(1000, 1000, p_width-1, p_height-1);
	const meshPlane = new THREE.Mesh(geoPlane, material);
	meshPlane.rotateX(-Math.PI/2);
	meshPlane.name="myPlane";

// Laster høydedata for planet:
let imageLoader = new THREE.ImageLoader();
imageLoader.load('../../../assets/textures/heightmap1.png', (image) => {
	// Finner høydedata for gitt bilde:
	const heightData = getHeigtdataFromImage(image, p_width, p_height);

	// Bruker lastede høydedata på planet:
	const vertexPositions = meshPlane.geometry.attributes.position.array;    //NB! MERK .array
	let index = 0;
	let minZ=Number.POSITIVE_INFINITY;
	let maxZ=0;
	// Gjennomløper alle vertekser (hver verteks består av tre verdier; x,y,z), endrer z-verdien:
	let height=0;
	for (let i = 0; i < meshPlane.geometry.attributes.position.count; i++)
	{
		index++;    // øker med 1 for å "gå forbi" x.
		index++;    // øker med 1 for å "gå forbi" y.
		height = heightData[i];
		vertexPositions[ index++] = height;    //Endrer z-verdien, øker index med for å gå til neste verteks sin x.
		//Finner høyeste og laveste høydeveri:
		if (height>maxZ)
			maxZ=height;
		if (height<minZ)
			minZ=height;
	}
	// Sørger for å sentrere planet om y=0:
	let heightDiff = maxZ-minZ;
	let heightAdjustment = -Math.abs(minZ) - (Math.abs(heightDiff)/2);

	meshPlane.geometry.computeVertexNormals();    // NB! Viktig for korrekt belysning.
	meshPlane.translateZ(heightAdjustment);       //Sentrerer planet om y=0

	g_scene.add(meshPlane);
});
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
	pointLight.position.set(-100, 310, 200);
	g_scene.add(pointLight);
	// Viser lyskilden:
	const pointLightHelper = new THREE.PointLightHelper( pointLight, 30 );
	pointLightHelper.visible = true;
	g_scene.add( pointLightHelper );
	//lil-gui:
	const pointLigthFolder = g_lilGui.addFolder( 'Pointlight' );
	pointLigthFolder.add(pointLight, 'visible').name("On/Off").onChange(value => {
		pointLightHelper.visible = value;
	});
	pointLigthFolder.add(pointLight, 'intensity').min(0).max(1).step(0.01).name("Intensity");
	pointLigthFolder.addColor(pointLight, 'color').name("Color");
	pointLigthFolder.add(pointLight.position, 'y').min(-100).max(700).step(1).name("Height");

	//** RETNINGSORIENTERT LYS (som gir skygge):
	let directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
	directionalLight.visible = false;
	directionalLight.position.set(0, 300, 0);
	g_scene.add(directionalLight);
	// Viser lyskilden:
	const directionalLightHelper = new THREE.DirectionalLightHelper( directionalLight, 100, 0xff0000);
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
