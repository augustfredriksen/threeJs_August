import * as THREE from "three";
import {addMeshToScene} from "./myThreeHelper.js";
import {createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies} from "./myAmmoHelper.js";
import {COLLISION_GROUP_PLANE, COLLISION_GROUP_PLAYER} from "./myAmmoHelper";

const STATE = { DISABLE_DEACTIVATION : 4 }
const FLAGS = { CF_KINEMATIC_OBJECT: 2 }
let ballObject = null;

export function createPlayer(mass = 50, color=0x00F604, position={x:0, y:5, z:20}) {
	const radius = mass*0.2
    let quat = {x: 0, y: 0, z: 0, w: 1};

	//THREE
	let mesh = ballObject = new THREE.Mesh(
		new THREE.SphereGeometry(radius),
		new THREE.MeshStandardMaterial({color: color}));
	mesh.name = 'sphere';
	mesh.position.set(position.x, position.y, position.z);
	mesh.castShadow = true;
	mesh.receiveShadow = true;

	//AMMO


	let width = mesh.geometry.parameters.width;
	let height = mesh.geometry.parameters.height;
	let depth = mesh.geometry.parameters.depth;

	let shape = new Ammo.btSphereShape(radius);
	shape.setMargin( 0.05 );
    let localInertia = new Ammo.btVector3(0,0,0);
    shape.calculateLocalInertia(mass, localInertia);
	let rigidBody = createAmmoRigidBody(shape, mesh, 0.7, 0.8, position, mass);
    rigidBody.setFriction(4);
    rigidBody.setRollingFriction(10);
    rigidBody.setActivationState( STATE.DISABLE_DEACTIVATION )

	mesh.userData.physicsBody = rigidBody;

	// Legger til physics world:
	g_ammoPhysicsWorld.addRigidBody(
		rigidBody,
		COLLISION_GROUP_PLAYER,
		COLLISION_GROUP_PLANE | COLLISION_GROUP_PLAYER
	);

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;
}

export function moveBall(moveDirection = {right: 0, left: 0, forward: 0, back: 0}) {
    let scalingFactor = 100;

    let moveX =  moveDirection.right - moveDirection.left;
    let moveZ =  moveDirection.back - moveDirection.forward;
    let moveY =  0; 

    if( moveX == 0 && moveY == 0 && moveZ == 0) return;

    let resultantImpulse = new Ammo.btVector3( moveX, moveY, moveZ )
    resultantImpulse.op_mul(scalingFactor);

    let physicsBody = ballObject.userData.physicsBody;
    physicsBody.setLinearVelocity( resultantImpulse );
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
let forceVector = new Ammo.btVector3(800*direction.x, 800*direction.y, 800*direction.z);

rigidBody.activate(true);
rigidBody.applyForce(forceVector, relativeVector);
}
