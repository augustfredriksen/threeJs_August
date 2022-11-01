import '../../style.css';
//Globale variabler:
import * as THREE from "three";

//Globale variabler:
let g_scene, g_renderer, g_clock;

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
	g_scene.background = new THREE.Color( 0xdddddd );
	// Sceneobjekter
	await addSceneObjects();
	addLights();

	// Kamera:
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.x = 1;
	camera.position.y = 1;
	camera.position.z = 3;

	// Klokke for animasjon
	g_clock = new THREE.Clock();

	// Start animasjonsløkka:
	animate(0, camera);
}

async function addSceneObjects() {

	const loader = new THREE.TextureLoader();
	const textureObject = await loader.loadAsync('../../../assets/textures/bird1.png');

	//Definerer geometri og materiale (her kun farge) for en kube:
	let geometry = new THREE.BoxGeometry(1, 1, 1);
	let material = new THREE.MeshPhongMaterial({map : textureObject});	//NB! MeshPhongMaterial

	//Oppretter et kubemesh vha. geomatri og materiale:
	const cube = new THREE.Mesh(geometry, material);
	cube.name = "myCube";
	cube.animation = {    //Holder på animasjonsinfo:
		angle: 0,
	}

	//Legger kuben til scenen:
	g_scene.add(cube);

	// Koordinatsystem
	let axesHelper = new THREE.AxesHelper( 30 );
	g_scene.add( axesHelper );
}

function addLights() {
	let light1 = new THREE.DirectionalLight(0xffffff, 1.0); //farge, intensitet (1=default)
	light1.position.set(2, 1, 4);
	g_scene.add(light1);

	let light2 = new THREE.DirectionalLight(0xffffff, 1.0); //farge, intensitet (1=default)
	light2.position.set(-2, -1, -4);
	g_scene.add(light2);
}

function animate(currentTime, camera) {
	window.requestAnimationFrame((currentTime) => {
		animate(currentTime, camera);
	});

	let delta = g_clock.getDelta();

	//Roterer kuben:
	let cube = g_scene.getObjectByName("myCube");
	let rps = 0.2; //Rotations Per Second
	let rotationSpeed = rps * (2*Math.PI);

	cube.animation.angle = cube.animation.angle + (rotationSpeed * delta);
	cube.animation.angle %= (Math.PI * 2); // "Rull rundt" dersom angle >= 360 grader.

	cube.rotation.x = cube.animation.angle;
	cube.rotation.y = cube.animation.angle;

	//Tegner scenen med gitt kamera:
	g_renderer.render(g_scene, camera);
}
