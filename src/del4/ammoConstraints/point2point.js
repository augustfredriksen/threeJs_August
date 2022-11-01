import * as THREE from "three";
import {COLLISION_GROUP_P2P, createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies} from "./myAmmoHelper";
import {addMeshToScene} from "./myThreeHelper";
import {
	COLLISION_GROUP_BOX,
	COLLISION_GROUP_SPRING,
	COLLISION_GROUP_MOVEABLE,
	COLLISION_GROUP_PLANE,
	COLLISION_GROUP_SPHERE
} from "./myAmmoHelper";

export function createP2P() {

	const mass1 = 0;
	const mass2 = 20;
	const positionAnchor = {x: -10, y: 20, z: -10};
	const positionCube = {x: -10, y: 10, z: -10};
	const width=2, height=2, depth=2

	// Three:
	const springAnchorMesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), new THREE.MeshPhongMaterial({color: 0xFF0F00}));
	springAnchorMesh.position.set(positionAnchor.x, positionAnchor.y, positionAnchor.z);
	addMeshToScene(springAnchorMesh);

	const springCubeMesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), new THREE.MeshPhongMaterial({color: 0x00E0FF}));
	springCubeMesh.position.set(positionCube.x, positionCube.y, positionCube.z);
	addMeshToScene(springCubeMesh);

	// Ammo: samme shape brukes av begge RBs:
	const boxShape = new Ammo.btBoxShape( new Ammo.btVector3( width/2, height/2, depth/2 ) );

	const rigidBodyAnchor = createAmmoRigidBody(boxShape, springAnchorMesh, 0.4, 0.6, positionAnchor, mass1);
	const rigidBodyCube = createAmmoRigidBody(boxShape, springCubeMesh, 0.4, 0.6, positionCube, mass2);
	rigidBodyAnchor.threeMesh = springAnchorMesh;
	rigidBodyCube.threeMesh = springCubeMesh;

	springAnchorMesh.userData.physicsBody = rigidBodyAnchor;
	springCubeMesh.userData.physicsBody = rigidBodyCube;

	// Legger til physics world:
	g_ammoPhysicsWorld.addRigidBody(
		rigidBodyAnchor,
		COLLISION_GROUP_P2P,
		COLLISION_GROUP_P2P, COLLISION_GROUP_BOX | COLLISION_GROUP_SPHERE | COLLISION_GROUP_MOVEABLE | COLLISION_GROUP_PLANE
	);
	// Legger til physics world:
	g_ammoPhysicsWorld.addRigidBody(
		rigidBodyCube,
		COLLISION_GROUP_P2P,
		COLLISION_GROUP_P2P, COLLISION_GROUP_BOX | COLLISION_GROUP_SPHERE | COLLISION_GROUP_MOVEABLE | COLLISION_GROUP_PLANE
	);

	//Pivotpunkt: rbBox2 "koples til" nedre, venstre, ytre hjørne av rbBox1
	let box1Pivot = new Ammo.btVector3( -width/2, -height/2, depth/2 );   //nedre, venstre, ytre
	let box2Pivot = new Ammo.btVector3( - width/2, 1, 1 );

	let p2pConstraint = new Ammo.btPoint2PointConstraint( rigidBodyAnchor, rigidBodyCube, box1Pivot, box2Pivot);
	g_ammoPhysicsWorld.addConstraint( p2pConstraint, false );

	g_rigidBodies.push(springAnchorMesh);
	g_rigidBodies.push(springCubeMesh);
	g_ammoPhysicsWorld.addConstraint( p2pConstraint, false );
}
