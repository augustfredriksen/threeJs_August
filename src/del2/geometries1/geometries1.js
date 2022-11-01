import '../../style.css';
//Globale variabler:
import * as THREE from "three";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry';
import {addCoordSystem} from "../../../static/lib/wfa-coord.js";

//Globale variabler:
let g_scene, g_renderer, g_camera, g_clock, g_controls, g_currentlyPressedKeys = [];
// Lokal hjelpeklasse
class HalfTubeCurve extends THREE.Curve {
	constructor( scale = 1, radius = 1 ) {
		super();
		this.scale = scale;
		this.radius = radius;
	}

	getPoint( t, optionalTarget = new THREE.Vector3() ) {
		let angle = Math.PI*t;
		const tx = this.radius * Math.sin(angle);
		const ty = this.radius * Math.cos(angle);
		const tz = 0;
		return optionalTarget.set( tx, ty, tz ).multiplyScalar( this.scale );
	}
}

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
	g_camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
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
	createPlane();

	//Convex hull:
	createConvexMesh();

	//Lathe:
	createLatheMesh();

	//Extrudemesh:
	createExtrudeMesh();

	//Extrudemesh 2:
	createSpikes();

	createHalftube();
}

function createPlane() {
	const gPlane = new THREE.PlaneGeometry(600, 600, 10, 10);
	const mPlane = new THREE.MeshLambertMaterial({ color: 0x91aff11, side: THREE.DoubleSide, wireframe:true });
	const meshPlane = new THREE.Mesh(gPlane, mPlane);
	meshPlane.rotation.x = Math.PI / 2;
	g_scene.add(meshPlane);
}

function createConvexMesh() {
// add 100 random points / spheres:
	let points = [];
	for (let i = 0; i < 100; i++) {
		let randomX = -205 + Math.round(Math.random() * 510);
		let randomY = -150 + Math.round(Math.random() * 300);
		let randomZ = -200 + Math.round(Math.random() * 400);
		points.push(new THREE.Vector3(randomX, randomY, randomZ));
	}

	let mConvex = new THREE.MeshLambertMaterial({ color: 0xff6611, side: THREE.DoubleSide });
	let gConvex = new ConvexGeometry(points);
	let meshConvex = new THREE.Mesh(gConvex, mConvex);
	meshConvex.position.x = -400;
	meshConvex.position.z = -400;
	g_scene.add(meshConvex);
}

function createLatheMesh() {
	let points = [];
	let height = 5;
	let count = 30;
	for (let i = 0; i < count; i++) {
		points.push(new THREE.Vector2((Math.sin(i * 0.2) + Math.cos(i * 0.3)) * height + 12, (i - count) + count / 2));
	}
	let gLathe = new THREE.LatheGeometry(points, 12, 0, 2 * Math.PI);
	let mLathe = new THREE.MeshLambertMaterial({ color: 0x88EE79, side: THREE.DoubleSide });
	let meshLathe = new THREE.Mesh(gLathe, mLathe);
	meshLathe.scale.set(5,5,5);
	meshLathe.position.set(-120,0,0);
	g_scene.add(meshLathe);
}

function createExtrudeMesh() {
	let options = {
		amount: 10,
		bevelThickness: 2,
		bevelSize: 1,
		bevelSegments: 3,
		bevelEnabled: false,
		curveSegments: 12,
		steps: 1
	};

	let gExtrude = new THREE.ExtrudeGeometry(getShape(), options);
	let mExtrude = new THREE.MeshLambertMaterial({ color: 0xFF00EE, side: THREE.DoubleSide, wireframe: true });
	let meshExtrude = new THREE.Mesh(gExtrude, mExtrude);
	meshExtrude.scale.set(5,5,5);
	g_scene.add(meshExtrude);
}

function getShape() {
	// create a basic shape
	let shape = new THREE.Shape();

	// startpoint
	shape.moveTo(10, 10);

	// straight line upwards
	shape.lineTo(10, 40);

	// the top of the figure, curve to the right
	shape.bezierCurveTo(15, 25, 25, 25, 30, 40);

	// spline back down
	shape.splineThru(
		[new THREE.Vector2(32, 30),
			new THREE.Vector2(28, 20),
			new THREE.Vector2(30, 10),
		])

	// curve at the bottom
	shape.quadraticCurveTo(20, 15, 10, 10);

	// add 'eye' hole one
	let hole1 = new THREE.Path();
	hole1.absellipse(16, 24, 2, 3, 0, Math.PI * 2, true);
	shape.holes.push(hole1);

	// add 'eye hole 2'
	let hole2 = new THREE.Path();
	hole2.absellipse(23, 24, 2, 3, 0, Math.PI * 2, true);
	shape.holes.push(hole2);

	// add 'mouth'
	let hole3 = new THREE.Path();
	hole3.absarc(20, 16, 2, 0, Math.PI, true);
	shape.holes.push(hole3);

	return shape;
}

// Spike
function createSpikes() {
	// Spike vha spline:
	let spikeShape1 = createSpikeSplineShape();
	let spikeMesh1 = createSpikeMesh(spikeShape1);
	spikeMesh1.position.set(-50,0, 160);
	spikeMesh1.scale.set(10,10, 10);
	g_scene.add(spikeMesh1);

	// Spike vha line:
	let spikeShape2 = createSpikeLineShape();
	let spikeMesh2 = createSpikeMesh(spikeShape2);
	spikeMesh2.position.set(50,0, 160);
	spikeMesh2.scale.set(10,10, 10);
	g_scene.add(spikeMesh2);
}

function createSpikeMesh(shape) {
	let extrudeSettings = {
		depth: 0.4,
		bevelEnabled: false,
		bevelSegments: 1,
		steps: 1,
		bevelSize: 1,
		bevelThickness: 0.2
	};
	let geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
	let spikeMesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({color: 0xFF00FF}) );
	spikeMesh.translateOnAxis(new THREE.Vector3(0,-0.2,0), 1);
	spikeMesh.scale.set(0.3, 0.25, 1);
	return spikeMesh;
}

// Smoooth...
function createSpikeSplineShape() {
	let spikeShape = new THREE.Shape();
	spikeShape.moveTo( -4, 0 );
	spikeShape.splineThru([
		new THREE.Vector2(-3, 0.4),
		new THREE.Vector2(-2, 1.2),
		new THREE.Vector2(-1, 3),
		new THREE.Vector2(0, 5),
		new THREE.Vector2(1, 3),
		new THREE.Vector2(2, 1.2),
		new THREE.Vector2(3, 0.4),
		new THREE.Vector2(4, 0),
	]);
	spikeShape.lineTo(4,-1);
	spikeShape.lineTo(-4,-1);
	spikeShape.lineTo(-4,0);
	return spikeShape;
}

// Rette streker
function createSpikeLineShape() {
	let spikeShape = new THREE.Shape();
	spikeShape.moveTo( -4, 0 );
	spikeShape.lineTo(-3, 0.4);
	spikeShape.lineTo(-2, 1.2);
	spikeShape.lineTo(-1, 3);
	spikeShape.lineTo(0, 5);
	spikeShape.lineTo(1, 3);
	spikeShape.lineTo(2, 1.2);
	spikeShape.lineTo(3, 0.4);
	spikeShape.lineTo(4, 0);
	spikeShape.lineTo(4,-1);
	spikeShape.lineTo(-4,-1);
	spikeShape.lineTo(-4,0);
	return spikeShape;
}

function createHalftube() {
	let group = new THREE.Group(); // Object3D

	let halfTubeLength = 50;
	const path = new HalfTubeCurve( 20 );
	const geometry = new THREE.TubeGeometry( path, 20, 1.5, 8, false );
	const material = new THREE.MeshBasicMaterial( {color: 0xAAAA00, side: THREE.DoubleSide} );
	const bend = new THREE.Mesh( geometry, material );
	bend.position.set(halfTubeLength,0, 0);
	group.add(bend);

	const geometryCyl = new THREE.CylinderGeometry( 1.5, 1.5, halfTubeLength, 100 );
	const rod1 = new THREE.Mesh( geometryCyl, material );
	rod1.position.set(halfTubeLength/2,20, 0);
	rod1.rotateZ(Math.PI/2);
	group.add(rod1);

	const rod2 = new THREE.Mesh( geometryCyl, material );
	rod2.position.set(halfTubeLength/2,-20, 0);
	rod2.rotateZ(Math.PI/2);
	group.add(rod2);

	group.rotateX(Math.PI/2);
	group.position.set(170, 50, 130);
	group.scale.set(2,2,2);
	g_scene.add(group);
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

	g_scene.add(directionalLight1);
}

function animate(currentTime) {
	window.requestAnimationFrame((currentTime) => {
		animate(currentTime);
	});

	let delta = g_clock.getDelta();

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
