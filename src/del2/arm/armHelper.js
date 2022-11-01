/**
 * Funksjoner som lager meshobjekter til dronen.
 */
import * as THREE from "three";

export async function createArmMesh() {

	const loader = new THREE.TextureLoader();
	const textureObject = await loader.loadAsync('../../../assets/textures/metal1.jpg');

	//Konteiner for hele armen:
	const arm = new THREE.Group();

	let material = new THREE.MeshPhongMaterial({ map: textureObject });
	let gFoot = new THREE.CylinderGeometry(20, 30, 10, 20, 5, false);
	let meshFoot = new THREE.Mesh(gFoot, material);
	meshFoot.name = 'foot';
	meshFoot.position.x = 0;
	meshFoot.position.y = 5;
	meshFoot.position.z = 0;
	arm.add(meshFoot);

	//LowerArm:
	let gLowerArm = new THREE.CylinderGeometry(4, 4, 100, 8, 1, false);
	let meshLowerArm = new THREE.Mesh(gLowerArm, material);
	meshLowerArm.name = 'LowerArm';
	meshLowerArm.position.x = 0;
	meshLowerArm.position.y = 60;	//Flytter opp 50 (halvparten av sylinderens høyde) + 10 (høyde på foten)
	meshLowerArm.position.z = 0;
	meshFoot.add(meshLowerArm);

	//** ArmAndJoint1:
	let armAndJoint1 = new THREE.Group();
	armAndJoint1.position.x = 0;
	armAndJoint1.position.y = 50;
	armAndJoint1.position.z = 0;
	armAndJoint1.name = 'armAndJoint1';
	//* joint1:
	let gJoint1 = new THREE.SphereGeometry(10, 8, 6);					//radius, widthSegments, heightSegments,
	let meshJoint1 = new THREE.Mesh(gJoint1, material);
	meshJoint1.castShadow = true;
	meshJoint1.name = 'joint1';
	armAndJoint1.add(meshJoint1);
	//* arm1:
	let gMidArm = new THREE.CylinderGeometry(4, 4, 100, 8, 1, false);
	let meshMidArm = new THREE.Mesh(gMidArm, material);
	meshMidArm.castShadow = true;
	meshMidArm.name = 'MidArm';
	meshMidArm.position.x = 0;
	meshMidArm.position.y = 50;
	meshMidArm.position.z = 0;
	armAndJoint1.add(meshMidArm);

	// Legg til parent:
	meshLowerArm.add(armAndJoint1);

	//** ArmAndJoint2:
	let armAndJoint2 = new THREE.Group();
	armAndJoint2.position.x = 0;
	armAndJoint2.position.y = 100;
	armAndJoint2.position.z = 0;
	armAndJoint2.name = 'armAndJoint2';
	//* joint2:
	let gJoint2 = new THREE.SphereGeometry(10, 8, 6);					//radius, widthSegments, heightSegments,
	let meshJoint2 = new THREE.Mesh(gJoint2, material);
	meshJoint2.name = 'joint2';
	meshJoint2.castShadow = true;
	armAndJoint2.add(meshJoint2);
	//* arm2:
	let gUpperArm = new THREE.CylinderGeometry(4, 4, 100, 8, 1, false);
	let meshUpperArm = new THREE.Mesh(gUpperArm, material);
	meshUpperArm.castShadow = true;
	meshUpperArm.name = 'UpperArm';
	meshUpperArm.position.x = 0;
	meshUpperArm.position.y = 50;
	meshUpperArm.position.z = 0;
	armAndJoint2.add(meshUpperArm);

	// Legg til parent:
	armAndJoint1.add(armAndJoint2);

	return arm;
}
