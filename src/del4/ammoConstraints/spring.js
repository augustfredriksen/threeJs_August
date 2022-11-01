import * as THREE from "three";
import {createAmmoRigidBody, g_ammoPhysicsWorld, g_rigidBodies} from "./myAmmoHelper";
import {addMeshToScene} from "./myThreeHelper";
import {
	COLLISION_GROUP_BOX,
	COLLISION_GROUP_SPRING,
	COLLISION_GROUP_MOVEABLE,
	COLLISION_GROUP_PLANE,
	COLLISION_GROUP_SPHERE
} from "./myAmmoHelper";

export function createSpring() {

	const mass1 = 0;
	const mass2 = 20;
	const positionAnchor = {x: 10, y: 20, z: 0};
	const positionCube = {x: 10, y: 0, z: 0};
	const width=2, height=2, depth=2

	// Three:
	const springAnchorMesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), new THREE.MeshPhongMaterial({color: 0xFF0000}));
	springAnchorMesh.position.set(positionAnchor.x, positionAnchor.y, positionAnchor.z);
	addMeshToScene(springAnchorMesh);

	const springCubeMesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), new THREE.MeshPhongMaterial({color: 0x0000FF}));
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
		COLLISION_GROUP_SPRING,
		COLLISION_GROUP_SPRING, COLLISION_GROUP_BOX | COLLISION_GROUP_SPHERE | COLLISION_GROUP_MOVEABLE | COLLISION_GROUP_PLANE
	);
	// Legger til physics world:
	g_ammoPhysicsWorld.addRigidBody(
		rigidBodyCube,
		COLLISION_GROUP_SPRING,
		COLLISION_GROUP_SPRING, COLLISION_GROUP_BOX | COLLISION_GROUP_SPHERE | COLLISION_GROUP_MOVEABLE | COLLISION_GROUP_PLANE
	);

	//FJÆR MELLOM box1 og 2: https://stackoverflow.com/questions/46671809/how-to-make-a-spring-constraint-with-bulconst -physics
	const transform1 = new Ammo.btTransform();
	transform1.setIdentity();
	transform1.setOrigin( new Ammo.btVector3( 0, 1, 0 ) );
	const transform2 = new Ammo.btTransform();
	transform2.setIdentity();
	transform2.setOrigin( new Ammo.btVector3( 0, 0, 0 ) );

	const springConstraint = new Ammo.btGeneric6DofSpringConstraint(
		rigidBodyAnchor,
		rigidBodyCube,
		transform1,
		transform2,
		true
	);

	// Removing any restrictions on the y-coordinate of the hanging box
	// by setting the lower limit above the upper one.
	springConstraint.setLinearLowerLimit(new Ammo.btVector3(0.0, 1.0, 0.0));
	springConstraint.setLinearUpperLimit(new Ammo.btVector3(0.0, 0.0, 0.0));

	// NB! Disse er viktig for at ikke den hengende kuben ikke skal rotere om alle akser!!
	// Disse gjør at den hengende boksen ikke roterer når den er festet til en constraint (se side 130 i Bullet-boka).
	springConstraint.setAngularLowerLimit(new Ammo.btVector3(0, 0.0, 0.0));
	springConstraint.setAngularUpperLimit(new Ammo.btVector3(0, 0.0, 0.0));

	// FRA: https://pybullet.org/Bullet/BulletFull/classbtGeneric6DofSpringConstraint.html
	// DOF index used in enableSpring() and setStiffness() means:
	// 0 : translation X
	// 1 : translation Y
	// 2 : translation Z
	// 3 : rotation X (3rd Euler rotational around new position of X axis, range [-PI+epsilon, PI-epsilon] )
	// 4 : rotation Y (2nd Euler rotational around new position of Y axis, range [-PI/2+epsilon, PI/2-epsilon] )
	// 5 : rotation Z (1st Euler rotational around Z axis, range [-PI+epsilon, PI-epsilon] )

	// Enabling the spring behavior for they y-coordinate (index = 1)
	//springConstraint.enableSpring(0,  false);
	springConstraint.enableSpring(1,  true);    // Translation on y-axis
	//springConstraint.enableSpring(2,  false);
	//springConstraint.enableSpring(3,  false);
	//springConstraint.enableSpring(4,  false);
	//springConstraint.enableSpring(5,  false);

	//springConstraint.setStiffness(0, 0);
	springConstraint.setStiffness(1, 25);
	//springConstraint.setStiffness(2, 0);

	//springConstraint.setDamping  (0,  0);
	springConstraint.setDamping(1,  0.9);
	//springConstraint.setDamping  (2,  0);

	g_rigidBodies.push(springAnchorMesh);
	g_rigidBodies.push(springCubeMesh);
	g_ammoPhysicsWorld.addConstraint( springConstraint, false );
}
