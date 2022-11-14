import * as THREE from "three";

function createAmmoXZPlane(xzPlaneSideLength) {
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
    }

    return {mesh, rigidBody}