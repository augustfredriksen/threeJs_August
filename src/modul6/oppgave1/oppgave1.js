import '../../style.css';
//Globale variabler:
import * as THREE from "three";
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

//Globale variabler:
let g_scene, g_renderer, g_camera, g_clock, g_controls;
const SIZE = 200;

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
	g_scene.background = new THREE.Color( 0x333333 );

	// Sceneobjekter
	await addSceneObjects();
	addLights();


	// Kamera:
	g_camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	g_camera.position.x = 2;
	g_camera.position.y = 5;
	g_camera.position.z = 6;

	// TrackballControls:
	g_controls = new TrackballControls(g_camera, g_renderer.domElement);
	g_controls.addEventListener( 'change', renderScene);

	// Klokke for animasjon
	g_clock = new THREE.Clock();

	// Start animasjonsløkka:
	animate(0);
}

async function addSceneObjects() {
	const loader = new THREE.TextureLoader();
	const textureObject = await loader.loadAsync('../../../assets/textures/chocchip.png');

	// PLAN
	let gPlane = new THREE.PlaneGeometry( SIZE*2, SIZE*2 );
	let mPlane = new THREE.MeshPhongMaterial( { map : textureObject , side: THREE.DoubleSide });
	let meshPlane = new THREE.Mesh(gPlane, mPlane);
	meshPlane.rotation.x = Math.PI / 2;
	meshPlane.translateZ(.5);
	g_scene.add(meshPlane);

	// KUBE
	let gCube = new THREE.BoxGeometry(1.5, 1.5, 1.5);
	let mCube = new THREE.MeshPhongMaterial( {map : textureObject });
	let meshCube = new THREE.Mesh(gCube, mCube);
	meshCube.name = "myCube";
	meshCube.translateZ(-3);
	g_scene.add(meshCube);

	//OCTAHEDRON
	let gOctahedron = new THREE.OctahedronGeometry( 1 );
	let mOctahedron = new THREE.MeshPhongMaterial({ map : textureObject });
	let meshOctahedron = new THREE.Mesh(gOctahedron, mOctahedron);
	meshOctahedron.translateX(3);
	meshOctahedron.translateY(.5);
	g_scene.add(meshOctahedron);

	// TORUS
	let gTorus = new THREE.TorusGeometry( 1.5 );
	let mTorus = new THREE.MeshPhongMaterial({ map: textureObject });
	let meshTorus = new THREE.Mesh(gTorus, mTorus);
	meshTorus.rotation.x = Math.PI / 2;
	meshTorus.translateZ(.1);
	g_scene.add(meshTorus);

	// KULE
	let gSphere = new THREE.SphereGeometry( 1 );
	let mSphere = new THREE.MeshPhongMaterial({ map: textureObject });
	let meshSphere = new THREE.Mesh(gSphere, mSphere);
	meshSphere.translateY(.5);
	g_scene.add(meshSphere);

	// PYRAMIDE
	let gCone = new THREE.ConeGeometry( 1, 2, 100 );
	let mCone = new THREE.MeshPhongMaterial({ map: textureObject });
	let meshCone = new THREE.Mesh(gCone, mCone);
	meshCone.translateZ(2.8);
	g_scene.add(meshCone);

	// PYRAMIDE
	let gPyramid = new THREE.ConeGeometry( 1, 2, 4 );
	let mPyramid = new THREE.MeshPhongMaterial({ map: textureObject });
	let meshPyramid = new THREE.Mesh(gPyramid, mPyramid);
	meshPyramid.translateX(-3);
	meshPyramid.translateY(.5);
	g_scene.add(meshPyramid);

	// Koordinatsystem
	let axesHelper = new THREE.AxesHelper( 30 );
	g_scene.add ( axesHelper );
}

function addLights() {
	let light1 = new THREE.DirectionalLight(0xffffff, 1.0); //farge, intensitet (1=default)
	light1.position.set(2, 1, 4);
	g_scene.add(light1);

	let light2 = new THREE.DirectionalLight(0xffffff, 1.0); //farge, intensitet (1=default)
	light2.position.set(-2, -1, -4);
	g_scene.add(light2);
}

function animate(currentTime) {
	window.requestAnimationFrame((currentTime) => {
		animate(currentTime);
	});
	g_controls.update();
	renderScene();
}

function renderScene() {
	g_renderer.render(g_scene, g_camera);
}
