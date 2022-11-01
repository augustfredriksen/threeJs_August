import * as THREE from "three";
import {addMeshToScene} from "./myThreeHelper.js";
import {createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies} from "./myAmmoHelper.js";
import {COLLISION_GROUP_BOX, COLLISION_GROUP_PLANE, COLLISION_GROUP_SPHERE} from "./myAmmoHelper.js";

export let g_xzPlaneSideLength=100;

export function createXZPlane(xzPlaneSideLength) {
	const mass=0;
	const position = {x: 0, y: 0, z: 0};
	g_xzPlaneSideLength = xzPlaneSideLength;
	// THREE:
	let geometry = new THREE.PlaneGeometry( g_xzPlaneSideLength, g_xzPlaneSideLength, 1, 1 );
	geometry.rotateX( -Math.PI / 2 );
	let material = new THREE.MeshStandardMaterial( { color: 0xA8A8F8, side: THREE.DoubleSide } );
	let mesh = new THREE.Mesh(geometry, material);
	mesh.receiveShadow = true;
	mesh.name = 'xzplane';

	// AMMO:
	let shape = new Ammo.btBoxShape(new Ammo.btVector3(g_xzPlaneSideLength/2, 0, g_xzPlaneSideLength/2));
	//shape.setMargin( 0.05 );
	let rigidBody = createAmmoRigidBody(shape, mesh, 0.7, 0.8, position, mass);

	mesh.userData.physicsBody = rigidBody;

	// Legger til physics world:
	g_ammoPhysicsWorld.addRigidBody(
		rigidBody,
		COLLISION_GROUP_PLANE,
		COLLISION_GROUP_SPHERE | COLLISION_GROUP_BOX);

	addMeshToScene(mesh);
	g_rigidBodies.push(mesh);
	rigidBody.threeMesh = mesh; //Brukes til collision events:
}
