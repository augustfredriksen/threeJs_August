import * as THREE from "three";
import {addArrowHelper, addMeshToScene} from "./myThreeHelper.js";
import {createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies} from "./myAmmoHelper.js";
import {COLLISION_GROUP_BOX, COLLISION_GROUP_PLANE, COLLISION_GROUP_SPHERE, COLLISION_GROUP_MOVEABLE} from "./myAmmoHelper.js";

export function createBox(mass = 17, color=0xF00FE0, position={x:20, y:50, z:30}) {
	const boxHeigt = 0.2 * mass;
	const boxDepth = 0.2 * mass;
	const boxWidth = 0.6 * mass;

	//THREE
	let mesh = new THREE.Mesh(
		new THREE.BoxGeometry(boxWidth, boxHeigt, boxDepth, 1, 1),
		new THREE.MeshStandardMaterial({color: color}));
	mesh.name = 'box';
	mesh.position.set(position.x, position.y, position.z);
	mesh.castShadow = true;
	mesh.receiveShadow = true;

	let direction = new THREE.Vector3();
	mesh.getWorldDirection(direction);  // NB! worldDIRECTION! Gir en vektor som peker mot +Z. FRA DOC: Returns a vector representing the direction of object's positive z-axis in world space.
	addArrowHelper(mesh, direction.normalize(), new THREE.Vector3( 0, 0, 0 ), 'worlddirection_arrow', 0xff0000, 10);

	//AMMO
	let width = mesh.geometry.parameters.width;
	let height = mesh.geometry.parameters.height;
	let depth = mesh.geometry.parameters.depth;

	let shape = new Ammo.btBoxShape( new Ammo.btVector3( width/2, height/2, depth/2) );
	shape.setMargin( 0.05 );
	let rigidBody = createAmmoRigidBody(shape, mesh, 0.7, 0.8, position, mass);
	rigidBody.setActivationState(4);

	mesh.userData.physicsBody = rigidBody;

	// Legger til physics world:
	g_ammoPhysicsWorld.addRigidBody(
		rigidBody,
		COLLISION_GROUP_BOX,
		COLLISION_GROUP_BOX | COLLISION_GROUP_SPHERE | COLLISION_GROUP_MOVEABLE | COLLISION_GROUP_PLANE
	);

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;
}


/**
 * Flytte kinetic rigid bodies.
 * @param movableMesh
 * @param direction
 */
export function moveRigidBody(movableMesh, direction) {
	let transform = new Ammo.btTransform();
	let motionState = movableMesh.userData.physicsBody.getMotionState();
	motionState.getWorldTransform(transform);
	let position = transform.getOrigin();
	transform.setOrigin(new Ammo.btVector3(position.x() + direction.x, position.y() + direction.y, position.z() + direction.z));
	motionState.setWorldTransform(transform);
}

/**
 * Flytte objekter vha. applyForce.
 * @param movableMesh
 * @param direction
 */
export function applyForce(mesh) {
	if (!mesh.userData.physicsBody)
		return;

	let rigidBody = mesh.userData.physicsBody;

	let boxLength = mesh.geometry.parameters.width;
	//let relativeVector = new Ammo.btVector3(-boxLength/2, 0, 0);
	let relativeVector = new Ammo.btVector3(0, 0, 0);

	// NB! getWorldDirection() gir en vektor som peker mot +Z.
	// FRA DOC: Returns a vector representing the direction of object's positive z-axis in world space.
	let direction = new THREE.Vector3();
	mesh.getWorldDirection(direction);
	//direction.multiplyScalar(-1);
	let forceVector = new Ammo.btVector3(400*direction.x, 400*direction.y, 400*direction.z);

	rigidBody.activate(true);
	rigidBody.applyForce(forceVector, relativeVector);
}

/**
 * Rotere objekter vha. applyTorque.
 */
export function applyTorque(mesh, direction) {
	if (!mesh.userData.physicsBody)
		return;
	let rigidBody = mesh.userData.physicsBody;
	let tourqueVector = new Ammo.btVector3(direction.x, direction.y, direction.z);
	rigidBody.activate(true);
	rigidBody.applyTorque(tourqueVector);
}

/**
 * Gir objektet et støt i punkt bestemt av
 */
export function applyImpulse(mesh, direction = {x:0, y:1, z:0}) {
	if (!mesh.userData.physicsBody)
		return;
	let rigidBody = mesh.userData.physicsBody;
	let relativeVector = new Ammo.btVector3(5, 0, 0);
	let impulseVector = new Ammo.btVector3(direction.x, direction.y, direction.z);
	rigidBody.activate(true);
	rigidBody.applyImpulse(impulseVector, relativeVector);
}

export function applyTorqueImpulse(mesh, direction = {x:0, y:1, z:0}) {
	if (!mesh.userData.physicsBody)
		return;
	let rigidBody = mesh.userData.physicsBody;
	let impulseVector = new Ammo.btVector3(direction.x, direction.y, direction.z);
	rigidBody.activate(true);
	rigidBody.applyTorqueImpulse(impulseVector);
}

export function applyCentralForce(mesh, direction = {x:0, y:1, z:0}) {
	if (!mesh.userData.physicsBody)
		return;
	let rigidBody = mesh.userData.physicsBody;
	let forceVector = new Ammo.btVector3(direction.x, direction.y, direction.z);
	rigidBody.activate(true);
	rigidBody.applyCentralForce(forceVector);
}

export function applyCentralImpulse(mesh, direction = {x:0, y:1, z:0}) {
	if (!mesh.userData.physicsBody)
		return;
	let rigidBody = mesh.userData.physicsBody;
	let impulseVector = new Ammo.btVector3(direction.x, direction.y, direction.z);
	rigidBody.activate(true);
	rigidBody.applyCentralImpulse(impulseVector);
}

export function setLinearVelocity(mesh, direction={x:1, y:0, z:-1}) {
	if (!mesh.userData.physicsBody)
		return;
	let rigidBody = mesh.userData.physicsBody;
	let velocityVector = new Ammo.btVector3(40*direction.x, 40*direction.y, 40*direction.z);
	rigidBody.activate(true);
	rigidBody.setLinearVelocity(velocityVector);
}

export function setAngularVelocity(mesh, direction={x:-1, y:0, z:1}) {
	if (!mesh.userData.physicsBody)
		return;
	let rigidBody = mesh.userData.physicsBody;
	let velocityVector = new Ammo.btVector3(4*direction.x, 4*direction.y, 4*direction.z);
	rigidBody.activate(true);
	rigidBody.setAngularVelocity(velocityVector);
}
