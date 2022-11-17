import * as THREE from "three";
import {addMeshToScene} from "./myThreeHelper.js";
import {createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies} from "./myAmmoHelper.js";

let g_xzPlaneSideLength=100;

const COLLISION_GROUP_PLANE = 1;
const COLLISION_GROUP_SPHERE = 1;
const COLLISION_GROUP_MOVEABLE = 1;
const COLLISION_GROUP_BOX = 1; 
const COLLISION_GROUP_CONE = 1;
const COLLISION_GROUP_CAPSULE = 1;
const COLLISION_GROUP_CYLINDER = 8;      //..osv. legg til etter behov.

export function createAmmoXZPlane(xzPlaneSideLength) {
	const mass=0;
	const position = {x: 0, y: 0, z: 0};
	g_xzPlaneSideLength = xzPlaneSideLength;
	// THREE:
	let geometry = new THREE.BoxGeometry( g_xzPlaneSideLength, 2, g_xzPlaneSideLength, 1, 1 );
	let material = new THREE.MeshStandardMaterial( { color: 0xA8A8F8, side: THREE.DoubleSide } );
	let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0,0,0);
	mesh.receiveShadow = true;
	mesh.name = 'xzplane';

	// AMMO:
	let shape = new Ammo.btBoxShape(new Ammo.btVector3(g_xzPlaneSideLength/2, 1, g_xzPlaneSideLength/2));
	//shape.setMargin( 0.05 );
	let rigidBody = createAmmoRigidBody(shape, mesh, 0.7, 0.8, position, mass);

	mesh.userData.physicsBody = rigidBody;

	// Legger til physics world:
	g_ammoPhysicsWorld.addRigidBody(
		rigidBody,
		COLLISION_GROUP_PLANE,
		COLLISION_GROUP_SPHERE | COLLISION_GROUP_BOX | COLLISION_GROUP_CONE | COLLISION_GROUP_CAPSULE| COLLISION_GROUP_CYLINDER);

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh; //Brukes til collision events:
}

export function createAmmoSphere(mass = 10, color=0x00FF00, position={x:10, y:40, z:-10}) {
	const radius = 0.2*mass;

	//THREE
	let mesh = new THREE.Mesh(
		new THREE.SphereGeometry(radius, 32, 32),
		new THREE.MeshStandardMaterial({color: color}));
	mesh.name = 'sphere';
	mesh.position.set(position.x, position.y, position.z);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	mesh.collisionResponse = (mesh1) => {
		mesh1.material.color.setHex(Math.random() * 0xffffff);
	};
	//AMMO
	let shape = new Ammo.btSphereShape(mesh.geometry.parameters.radius);
	shape.setMargin( 0.05 );
	let rigidBody = createAmmoRigidBody(shape, mesh, 1, 0.6, position, mass);

	mesh.userData.physicsBody = rigidBody;

	// Legger til physics world:
	g_ammoPhysicsWorld.addRigidBody(
		rigidBody,
		COLLISION_GROUP_SPHERE,
		COLLISION_GROUP_SPHERE | COLLISION_GROUP_BOX | COLLISION_GROUP_MOVEABLE | COLLISION_GROUP_PLANE | COLLISION_GROUP_CONE | COLLISION_GROUP_CAPSULE| COLLISION_GROUP_CYLINDER);

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;
}

export function createAmmoCube(mass = 17, color=0xF00FE0, position={x:-10, y:60, z:-10}) {
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
	shape.setMargin( 0.05 );
	let rigidBody = createAmmoRigidBody(shape, mesh, 0.7, 0.8, position, mass);

	mesh.userData.physicsBody = rigidBody;

	// Legger til physics world:
	g_ammoPhysicsWorld.addRigidBody(
		rigidBody,
		COLLISION_GROUP_BOX,
		COLLISION_GROUP_BOX | COLLISION_GROUP_SPHERE | COLLISION_GROUP_MOVEABLE | COLLISION_GROUP_PLANE | COLLISION_GROUP_CONE | COLLISION_GROUP_CAPSULE| COLLISION_GROUP_CYLINDER
	);

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;
}

export function createAmmoCone(mass = 20, color = new THREE.Color("firebrick"), position = {x: 0, y: 10, z: 0}) {
    const radius = 0.2*mass;

	//THREE
	let mesh = new THREE.Mesh(
		new THREE.ConeGeometry(radius, 10, 64, 8),
		new THREE.MeshStandardMaterial({color: color}));
	mesh.name = 'cone';
	mesh.position.set(position.x, position.y, position.z);
    mesh.rotateZ(Math.PI/69)
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	mesh.collisionResponse = (mesh1) => {
		mesh1.material.color.setHex(Math.random() * 0xffffff);
	};
	//AMMO
    let height = mesh.geometry.parameters.height
	let shape = new Ammo.btConeShape(mesh.geometry.parameters.radius, height);
	shape.setMargin( 0.05 );
	let rigidBody = createAmmoRigidBody(shape, mesh, 0.7, .5, position, mass);

	mesh.userData.physicsBody = rigidBody;

	// Legger til physics world:
	g_ammoPhysicsWorld.addRigidBody(
		rigidBody,
		COLLISION_GROUP_CONE,
		COLLISION_GROUP_SPHERE | COLLISION_GROUP_BOX | COLLISION_GROUP_MOVEABLE | COLLISION_GROUP_PLANE | COLLISION_GROUP_CONE | COLLISION_GROUP_CAPSULE| COLLISION_GROUP_CYLINDER );

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;
}

export function createAmmoCapsule(mass = 20, color = new THREE.Color("skyblue"), position = {x: 0, y: 100, z: 0}) {
    const radius = 0.1*mass;

	//THREE
	let mesh = new THREE.Mesh(
		new THREE.CapsuleGeometry(radius, 5, 32, 32),
		new THREE.MeshStandardMaterial({color: color}));
	mesh.name = 'capsule';
	mesh.position.set(position.x, position.y, position.z);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	mesh.collisionResponse = (mesh1) => {
		mesh1.material.color.setHex(Math.random() * 0xffffff);
	};
	//AMMO
    let height = mesh.geometry.parameters.height
	let shape = new Ammo.btCapsuleShape(mesh.geometry.parameters.radius, height);
	shape.setMargin( 0.05 );
	let rigidBody = createAmmoRigidBody(shape, mesh, 1, 0.8, position, mass);

	mesh.userData.physicsBody = rigidBody;

	// Legger til physics world:
	g_ammoPhysicsWorld.addRigidBody(
		rigidBody,
		COLLISION_GROUP_CAPSULE,
		COLLISION_GROUP_SPHERE | COLLISION_GROUP_BOX | COLLISION_GROUP_MOVEABLE | COLLISION_GROUP_PLANE | COLLISION_GROUP_CONE | COLLISION_GROUP_CAPSULE| COLLISION_GROUP_CYLINDER );

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;
}

export function createAmmoCylinder(mass = 20, color = new THREE.Color("yellow"), position = {x: -10, y: 80, z: 10}) {
    const radius = 0.1*mass;

	//THREE
	let mesh = new THREE.Mesh(
		new THREE.CylinderGeometry(radius, radius, 10, 32, 32),
		new THREE.MeshStandardMaterial({color: color}));
	mesh.name = 'cylinder';
	mesh.position.set(position.x, position.y, position.z);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	mesh.collisionResponse = (mesh1) => {
		mesh1.material.color.setHex(Math.random() * 0xffffff);
	};
	//AMMO
    let height = mesh.geometry.parameters.height
	let shape = new Ammo.btCylinderShape(new Ammo.btVector3(radius, height/2, radius));
	shape.setMargin( 0.05 );
	let rigidBody = createAmmoRigidBody(shape, mesh, 0.7, 0.1, position, mass);

	mesh.userData.physicsBody = rigidBody;

	// Legger til physics world:
	g_ammoPhysicsWorld.addRigidBody(
		rigidBody,
		COLLISION_GROUP_CYLINDER,
		COLLISION_GROUP_SPHERE | COLLISION_GROUP_BOX | COLLISION_GROUP_MOVEABLE | COLLISION_GROUP_PLANE | COLLISION_GROUP_CONE | COLLISION_GROUP_CAPSULE | COLLISION_GROUP_CYLINDER );

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;
}

