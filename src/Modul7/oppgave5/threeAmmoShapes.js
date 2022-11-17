import * as THREE from "three";
import {addMeshToScene} from "./myThreeHelper.js";
import {createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies} from "./myAmmoHelper.js";

let g_xzPlaneSideLength=50;

import { COLLISION_GROUP_PLANE, COLLISION_GROUP_PLAYER, COLLISION_GROUP_DOOR } from "./myAmmoHelper.js";     //..osv. legg til etter behov.

export function createAmmoXZPlane(xzPlaneSideLength, rotation={x: 0, y: 0, z: 0}, position= {x: 0, y: 0, z: 0}) {
	const mass=0;
	g_xzPlaneSideLength = xzPlaneSideLength;
	// THREE:
	let geometry = new THREE.BoxGeometry( g_xzPlaneSideLength, 2, g_xzPlaneSideLength*2, 1, 1 );
	let material = new THREE.MeshStandardMaterial( { color: 0xA8A8F8, side: THREE.DoubleSide } );
	let mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);

	mesh.receiveShadow = true;
	mesh.name = 'xzplane';

	// AMMO:
	let shape = new Ammo.btBoxShape(new Ammo.btVector3(g_xzPlaneSideLength/2, 1, g_xzPlaneSideLength));
	//shape.setMargin( 0.05 );
	let rigidBody = createAmmoRigidBody(shape, mesh, 0.7, 0.8, position, mass);

	mesh.userData.physicsBody = rigidBody;

	// Legger til physics world:
	g_ammoPhysicsWorld.addRigidBody(
		rigidBody,
		COLLISION_GROUP_PLANE,
		COLLISION_GROUP_PLAYER | COLLISION_GROUP_PLANE | COLLISION_GROUP_DOOR);

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh; //Brukes til collision events:
}

export function createAmmoWallRight(xzPlaneSideLength) {
    createAmmoXZPlane(
        g_xzPlaneSideLength,
        {x: 0, y: 0, z: Math.PI/2},
        {x: xzPlaneSideLength/2, y: xzPlaneSideLength/2, z: 0})
}

export function createAmmoWallFront(xzPlaneSideLength) {
    createAmmoXZPlane(
        g_xzPlaneSideLength,
        {x: Math.PI/2, y: 0, z: 0},
        {x: 0, y: xzPlaneSideLength/2, z: -xzPlaneSideLength/2})
}

export function createAmmoWallLeft(xzPlaneSideLength) {
    createAmmoXZPlane(
        g_xzPlaneSideLength,
        {x: 0, y: 0, z: Math.PI/2},
        {x: -xzPlaneSideLength/2, y: xzPlaneSideLength/2, z: 0})
}

export function createAmmoWallBack(xzPlaneSideLength) {
    createAmmoXZPlane(
        g_xzPlaneSideLength,
        {x: Math.PI/2, y: 0, z: 0},
        {x: 0, y: xzPlaneSideLength/2, z: xzPlaneSideLength/2})
}

export function createAmmoWallTop(xzPlaneSideLength) {
    createAmmoXZPlane(
        g_xzPlaneSideLength,
        {x: 0, y: 0, z: 0},
        {x: 0, y: xzPlaneSideLength, z: 0})
}

export function createHingedArm(mass = 10, color=0x00FF00, position={x:50, y:0, z:0}) {

	const rigidBodyArm = createArm({x:g_xzPlaneSideLength/4, y:g_xzPlaneSideLength/7.4, z:-g_xzPlaneSideLength/2});
	const rigidBodyAnchor = createAnchor({x:50, y:g_xzPlaneSideLength/7.4, z:-g_xzPlaneSideLength/2});
	const armLength = rigidBodyArm.threeMesh.geometry.parameters.width;
	//AMMO, hengsel: SE F.EKS: https://www.panda3d.org/manual/?title=Bullet_Constraints#Hinge_Constraint:
	const anchorPivot = new Ammo.btVector3( 0, 0, 0 );
	const anchorAxis = new Ammo.btVector3(0,1,0);
	const armPivot = new Ammo.btVector3( armLength/2, 0, 0 );
	const armAxis = new Ammo.btVector3(0,1,0);
	const hingeConstraint = new Ammo.btHingeConstraint(
		rigidBodyAnchor,
		rigidBodyArm,
		anchorPivot,
		armPivot,
		anchorAxis,
		armAxis,
		false
	);

	const lowerLimit = -Math.PI/3;
	const upperLimit = Math.PI/3;
	const softness = 0.9;
	const biasFactor = 0.3;
	const relaxationFactor = 1.0;
	hingeConstraint.setLimit( lowerLimit, upperLimit, softness, biasFactor, relaxationFactor);
	hingeConstraint.enableAngularMotor(true, 0, 10);
	g_ammoPhysicsWorld.addConstraint( hingeConstraint, false );

}

export function createHingedArm2(mass = 10, color=0x00FF00, position={x:50, y:0, z:0}) {

	const rigidBodyArm = createArm({x:-g_xzPlaneSideLength/4, y:g_xzPlaneSideLength/7.4, z:-g_xzPlaneSideLength/2});
	const rigidBodyAnchor = createAnchor({x:-50, y:g_xzPlaneSideLength/7.4, z:-g_xzPlaneSideLength/2});
	const armLength = rigidBodyArm.threeMesh.geometry.parameters.width;
	//AMMO, hengsel: SE F.EKS: https://www.panda3d.org/manual/?title=Bullet_Constraints#Hinge_Constraint:
	const anchorPivot = new Ammo.btVector3( 0, 0, 0 );
	const anchorAxis = new Ammo.btVector3(0,1,0);
	const armPivot = new Ammo.btVector3( -armLength/2, 0, 0 );
	const armAxis = new Ammo.btVector3(0,1,0);
	const hingeConstraint = new Ammo.btHingeConstraint(
		rigidBodyAnchor,
		rigidBodyArm,
		anchorPivot,
		armPivot,
		anchorAxis,
		armAxis,
		false
	);

	const lowerLimit = -Math.PI/3;
	const upperLimit = Math.PI/3;
	const softness = 0.9;
	const biasFactor = 0.3;
	const relaxationFactor = 1.0;
	hingeConstraint.setLimit( lowerLimit, upperLimit, softness, biasFactor, relaxationFactor);
	hingeConstraint.enableAngularMotor(true, 0, 10);
	g_ammoPhysicsWorld.addConstraint( hingeConstraint, false );

}

function createArm(position={x: 0, y: 0, z: 0}) {
	const mass=10;
	const width=g_xzPlaneSideLength/2.001, height=g_xzPlaneSideLength/4, depth=2;

	//THREE
	const mesh = new THREE.Mesh(
		new THREE.BoxGeometry(width,height,depth, 1, 1),
		new THREE.MeshStandardMaterial({color: 0xf906e4}));
	mesh.name = 'hinge_arm';
	mesh.position.set(position.x, position.y, position.z);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	const direction = new THREE.Vector3();
	

	//AMMO
	const mesh_width = mesh.geometry.parameters.width;    //(er her overflødig)
	const mesh_height = mesh.geometry.parameters.height;  //(er her overflødig)
	const mesh_depth = mesh.geometry.parameters.depth;    //(er her overflødig)

	const shape = new Ammo.btBoxShape( new Ammo.btVector3( mesh_width/2, mesh_height/2, mesh_depth/2) );
	shape.setMargin( 0.05 );
	const rigidBody = createAmmoRigidBody(shape, mesh, 0.3, 0.0, position, mass);
	rigidBody.setDamping(0.1, 0.5);
	rigidBody.setActivationState(4);
	mesh.userData.physicsBody = rigidBody;

	// Legger til physics world:
	g_ammoPhysicsWorld.addRigidBody(
		rigidBody,
		COLLISION_GROUP_DOOR,
		COLLISION_GROUP_PLAYER | COLLISION_GROUP_PLANE | COLLISION_GROUP_DOOR
	);

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;

	return rigidBody;
}

function createAnchor(position={x: 0, y: 0, z:0}) {
	const radius = 4;;
	const mass = 0;

	//THREE
	const mesh = new THREE.Mesh(
		new THREE.SphereGeometry(radius, 32, 32),
		new THREE.MeshStandardMaterial({color: 0xb846db, transparent: true, opacity: 0.5}));
	mesh.name = 'hinge_anchor';
	mesh.position.set(position.x, position.y, position.z);
	mesh.castShadow = true;
	mesh.receiveShadow = true;
	mesh.collisionResponse = (mesh1) => {
		mesh1.material.color.setHex(Math.random() * 0xffffff);
	};
	//AMMO
	const shape = new Ammo.btSphereShape(mesh.geometry.parameters.radius);
	shape.setMargin( 0.05 );
	const rigidBody = createAmmoRigidBody(shape, mesh, 0.4, 0.6, position, mass);
	mesh.userData.physicsBody = rigidBody;
	g_ammoPhysicsWorld.addRigidBody(
		rigidBody,
		1,
		1);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh;

	return rigidBody;
}

