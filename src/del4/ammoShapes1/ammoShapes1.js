import '../../style.css';
import * as THREE from "three";
import GUI from "lil-gui";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";

//Globale variabler:
let g_scene, g_renderer, g_camera, g_clock, g_controls, g_lilGui;
const g_currentlyPressedKeys = []
let g_ammoPhysicsWorld;
let g_transform;
let g_rigidBodies = [];
const XZPLANE_SIDELENGTH = 100;
const COLLISION_GROUP_PLANE = 1;
const COLLISION_GROUP_SPHERE = 2;
const COLLISION_GROUP_CONVEX = 4;
const COLLISION_GROUP_COMPOUND = 8;
const COLLISION_GROUP_MOVEABLE = 16;
const COLLISION_GROUP_TRIANGLE = 32;
const COLLISION_GROUP_HINGE_SPHERE = 64;
const COLLISION_GROUP_BOX = 128;       //..osv. legg til etter behov.

//STARTER!
//Ammojs Initialization
Ammo().then( async function( AmmoLib ) {
	Ammo = AmmoLib;
	await main();
} );

export async function main() {
	//Input - standard Javascript / WebGL:
	document.addEventListener('keyup', handleKeyUp, false);
	document.addEventListener('keydown', handleKeyDown, false);

	// three:
	createThreeScene();
	// ammo
	createAmmoWorld();
	// three/ammo-objekter:
	addAmmoSceneObjects();

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

function createThreeScene() {
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
}

function createAmmoWorld() {
	g_transform = new Ammo.btTransform();           // Hjelpeobjekt.

	// Initialiserer g_ammoPhysicsWorld:
	let collisionConfiguration = new Ammo.btDefaultCollisionConfiguration(),
		dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration),
		overlappingPairCache = new Ammo.btDbvtBroadphase(),
		solver = new Ammo.btSequentialImpulseConstraintSolver();

	g_ammoPhysicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration);
	g_ammoPhysicsWorld.setGravity(new Ammo.btVector3(0, -9.81, 0));
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

function addAmmoSceneObjects() {
	createAmmoXZPlane();
	createAmmoSphere();
	createAmmoCube();
	createMovable();
}

function createAmmoXZPlane() {
	const mass=0;
	const position = {x: 0, y: 0, z: 0};

	// THREE:
	let geometry = new THREE.PlaneGeometry( XZPLANE_SIDELENGTH, XZPLANE_SIDELENGTH, 1, 1 );
	geometry.rotateX( -Math.PI / 2 );
	let material = new THREE.MeshStandardMaterial( { color: 0xA8A8F8, side: THREE.DoubleSide } );
	let mesh = new THREE.Mesh(geometry, material);
	mesh.receiveShadow = true;
	mesh.name = 'xzplane';

	// AMMO:
	let shape = new Ammo.btBoxShape(new Ammo.btVector3(XZPLANE_SIDELENGTH/2, 0, XZPLANE_SIDELENGTH/2));
	let rigidBody = createAmmoRigidBody(shape, mesh, 0.7, 0.8, position, mass);

	mesh.userData.physicsBody = rigidBody;

	// Legger til physics world:
	g_ammoPhysicsWorld.addRigidBody(rigidBody, COLLISION_GROUP_PLANE,
		COLLISION_GROUP_SPHERE |
		COLLISION_GROUP_BOX |
		COLLISION_GROUP_COMPOUND |
		COLLISION_GROUP_MOVEABLE |
		COLLISION_GROUP_CONVEX |
		COLLISION_GROUP_TRIANGLE);

	g_scene.add(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh; //Brukes til collision events:
}

function createAmmoSphere(mass = 10, color=0x00FF00, position={x:0, y:50, z:0}) {
	const radius = 0.2*mass;

	//THREE
	let mesh = new THREE.Mesh(
		new THREE.SphereGeometry(radius, 32, 32),
		new THREE.MeshStandardMaterial({color: color}));
	mesh.name = 'sphere';
	mesh.position.set(position.x, position.y, position.z);
	mesh.castShadow = true;
	mesh.receiveShadow = true;

	//AMMO
	let shape = new Ammo.btSphereShape(mesh.geometry.parameters.radius);
	let rigidBody = createAmmoRigidBody(shape, mesh, 0.7, 0.8, position, mass);
	mesh.userData.physicsBody = rigidBody;
	// Legger til physics world:
	g_ammoPhysicsWorld.addRigidBody(rigidBody, COLLISION_GROUP_SPHERE,
		COLLISION_GROUP_SPHERE |
		COLLISION_GROUP_PLANE |
		COLLISION_GROUP_COMPOUND |
		COLLISION_GROUP_CONVEX |
		COLLISION_GROUP_MOVEABLE |
		COLLISION_GROUP_TRIANGLE |
		COLLISION_GROUP_BOX |
		COLLISION_GROUP_HINGE_SPHERE
	);

	g_scene.add(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;
}

function createAmmoCube(mass = 17, color=0xF00FE0, position={x:20, y:50, z:30}) {
		const sideLength = 0.2*mass;

		//THREE
		let mesh = new THREE.Mesh(
			new THREE.BoxGeometry(sideLength,sideLength,sideLength, 1, 1),
			new THREE.MeshStandardMaterial({color: color}));
		mesh.name = 'cube';
		mesh.position.set(position.x, position.y, position.z);
		mesh.castShadow = true;
		mesh.receiveShadow = true;

		//AMMO
		let width = mesh.geometry.parameters.width;
		let height = mesh.geometry.parameters.height;
		let depth = mesh.geometry.parameters.depth;

		let shape = new Ammo.btBoxShape( new Ammo.btVector3( width/2, height/2, depth/2) );
		let rigidBody = createAmmoRigidBody(shape, mesh, 0.7, 0.8, position, mass);

		mesh.userData.physicsBody = rigidBody;

		// Legger til physics world:
		g_ammoPhysicsWorld.addRigidBody(rigidBody, COLLISION_GROUP_BOX,
			COLLISION_GROUP_SPHERE |
			COLLISION_GROUP_PLANE |
			COLLISION_GROUP_COMPOUND |
			COLLISION_GROUP_CONVEX |
			COLLISION_GROUP_MOVEABLE |
			COLLISION_GROUP_TRIANGLE |
			COLLISION_GROUP_BOX |
			COLLISION_GROUP_HINGE_SPHERE
		);

		g_scene.add(mesh);
		g_rigidBodies.push(mesh);
		rigidBody.threeMesh = mesh;
}

function createMovable(color=0x00A6E5, position={x:-10, y:0, z:-30}) {
	const sideLength = 5;
	const mass = 0; //Merk!

	//THREE
	let mesh = new THREE.Mesh(
		new THREE.BoxGeometry(sideLength,sideLength,sideLength, 1, 1),
		new THREE.MeshStandardMaterial({color: color}));
	mesh.name = 'movable';
	position.y = position.y + mesh.scale.y*sideLength/2;
	mesh.position.set(position.x, position.y, position.z);
	mesh.castShadow = true;
	mesh.receiveShadow = true;

	//AMMO
	let width = mesh.geometry.parameters.width;
	let height = mesh.geometry.parameters.height;
	let depth = mesh.geometry.parameters.depth;

	let shape = new Ammo.btBoxShape( new Ammo.btVector3( width/2, height/2, depth/2) );
	let rigidBody = createAmmoRigidBody(shape, mesh, 0.7, 0.8, position, mass);
	// Følgende er avgjørende for å kunne flytte på objektet:
	// 2 = BODYFLAG_KINEMATIC_OBJECT: Betyr kinematic object, masse=0 men kan flyttes!
	rigidBody.setCollisionFlags(rigidBody.getCollisionFlags() | 2);
	// 4 = BODYSTATE_DISABLE_DEACTIVATION, dvs. "Never sleep".
	rigidBody.setActivationState(4);

	mesh.userData.physicsBody = rigidBody;

	// Legger til physics world:
	g_ammoPhysicsWorld.addRigidBody(rigidBody, COLLISION_GROUP_MOVEABLE,
		COLLISION_GROUP_SPHERE |
		COLLISION_GROUP_PLANE |
		COLLISION_GROUP_COMPOUND |
		COLLISION_GROUP_CONVEX |
		COLLISION_GROUP_MOVEABLE |
		COLLISION_GROUP_TRIANGLE |
		COLLISION_GROUP_BOX |
		COLLISION_GROUP_HINGE_SPHERE
	);

	g_scene.add(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;
}

function animate(currentTime, myThreeScene, myAmmoPhysicsWorld) {
	window.requestAnimationFrame((currentTime) => {
		animate(currentTime, myThreeScene, myAmmoPhysicsWorld);
	});
	let deltaTime = g_clock.getDelta();
	//Oppdater trackball-kontrollen:
	g_controls.update();

	//Oppdaterer fysikken:
	updatePhysics(deltaTime);

	//Sjekker input:
	handleKeys(deltaTime);

	//Tegner scenen med gitt kamera:
	renderScene();
}

function updatePhysics(deltaTime) {
	g_ammoPhysicsWorld.stepSimulation(deltaTime, 10);
	for (let i = 0; i < g_rigidBodies.length; i++) {
		let mesh = g_rigidBodies[i];
		let rigidBody = mesh.userData.physicsBody;
		let motionState = rigidBody.getMotionState();
		if (motionState) {
			motionState.getWorldTransform(g_transform);
			let p = g_transform.getOrigin();
			let q = g_transform.getRotation();
			mesh.position.set(p.x(), p.y(), p.z());
			mesh.quaternion.set(q.x(), q.y(), q.z(), q.w());
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
function handleKeys(delta) {
	if (g_currentlyPressedKeys['KeyH']) {	//H
		createRandomSphere(200);
	}

	const movable = g_scene.getObjectByName("movable");
	if (g_currentlyPressedKeys['KeyA']) {	//A
		moveMovable(movable,{x: -0.2, y: 0, z: 0});
	}
	if (g_currentlyPressedKeys['KeyD']) {	//D
		moveMovable(movable,{x: 0.2, y: 0, z: 0});
	}
	if (g_currentlyPressedKeys['KeyW']) {	//W
		moveMovable(movable,{x: 0, y: 0, z: -0.2});
	}
	if (g_currentlyPressedKeys['KeyS']) {	//S
		moveMovable(movable,{x: 0, y: 0, z: 0.2});
	}
}

function moveMovable(movable, direction) {
	let transform1 = new Ammo.btTransform();
	let ms1 = movable.userData.physicsBody.getMotionState();
	ms1.getWorldTransform(transform1);
	let curPosition1 = transform1.getOrigin();
	transform1.setOrigin(new Ammo.btVector3(curPosition1.x() + direction.x, curPosition1.y() + direction.y, curPosition1.z() + direction.z));
	ms1.setWorldTransform(transform1);
}

function createRandomSphere(height=50) {
	const xPos = -(XZPLANE_SIDELENGTH/2) + Math.random() * XZPLANE_SIDELENGTH;
	const zPos = -(XZPLANE_SIDELENGTH/2) + Math.random() * XZPLANE_SIDELENGTH;
	const pos = {x: xPos, y: height, z: zPos};
	const mass = 5 + Math.random() * 20;

	createAmmoSphere(mass, 0x00FF00, {x:xPos, y:50, z:zPos});
}

function createAmmoRigidBody(shape, threeMesh, restitution=0.7, friction=0.8, position={x:0, y:50, z:0}, mass=1) {

	let transform = new Ammo.btTransform();
	transform.setIdentity();
	transform.setOrigin(new Ammo.btVector3(position.x, position.y, position.z));

	let quaternion = threeMesh.quaternion;
	transform.setRotation(new Ammo.btQuaternion(quaternion.x, quaternion.y, quaternion.z, quaternion.w));

	let scale = threeMesh.scale;
	shape.setLocalScaling(new Ammo.btVector3(scale.x, scale.y, scale.z));

	let motionState = new Ammo.btDefaultMotionState(transform);
	let localInertia = new Ammo.btVector3(0, 0, 0);
	shape.calculateLocalInertia(mass, localInertia);

	let rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
	let rigidBody = new Ammo.btRigidBody(rbInfo);
	rigidBody.setRestitution(restitution);
	rigidBody.setFriction(friction);

	return rigidBody;
}
