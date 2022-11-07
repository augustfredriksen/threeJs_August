import * as THREE from "three";

import { createGeometries } from "./geometries.js";
import { createMaterials } from "../materials.js";
import { createMeshes as createBottomMeshes }  from '../HoistingCraneBottom/meshes.js';
import { Vector3 } from "three";

function createMeshes() {
	const geometries = createGeometries();
	const materials = createMaterials();
	const bottomMeshes = createBottomMeshes();

	const rotationBase = new THREE.Mesh(geometries.rotationBase, materials.metal2);
	rotationBase.position.y = bottomMeshes.bottomBase.position.y + bottomMeshes.bottomBase.geometry.parameters.height;
	rotationBase.position.z = bottomMeshes.bottomBase.geometry.parameters.depth/2;
	rotationBase.receiveShadow = true;
	rotationBase.castShadow = true;

	const cranePlatform = new THREE.Mesh(geometries.cranePlatform, materials.standardMaterial2);
	cranePlatform.position.y = rotationBase.position.y + rotationBase.geometry.parameters.height + cranePlatform.geometry.parameters.height/5;
	cranePlatform.position.z = rotationBase.position.z
	cranePlatform.position.x = -.5
	cranePlatform.receiveShadow = true;
	cranePlatform.castShadow = true;

	const cranePlatformDetailBottom = new THREE.Mesh(geometries.cranePlatformDetailBottom, materials.standardMaterial3);
	cranePlatformDetailBottom.position.x = cranePlatform.position.x;
	cranePlatformDetailBottom.position.y = cranePlatform.position.y - cranePlatform.geometry.parameters.height/4;
	cranePlatformDetailBottom.position.z = cranePlatform.position.z;
	cranePlatformDetailBottom.receiveShadow = true;
	cranePlatformDetailBottom.castShadow = true;

	const cranePlatformDetail = new THREE.Mesh(geometries.cranePlatformDetail, materials.standardMaterial2);
	cranePlatformDetail.position.x = - cranePlatform.geometry.parameters.width/2;
	cranePlatformDetail.position.y = cranePlatform.position.y + cranePlatform.geometry.parameters.height/4;
	cranePlatformDetail.position.z = cranePlatform.position.z;
	cranePlatformDetail.receiveShadow = true;
	cranePlatformDetail.castShadow = true;

	const cranePlatformDetail2 = cranePlatformDetail.clone();
	cranePlatformDetail2.position.x = cranePlatformDetail.position.x + 0.6;

	const cranePlatformDetail3 = cranePlatformDetail.clone();
	cranePlatformDetail3.position.x = cranePlatformDetail2.position.x + 0.6;

	const cranePlatformDetail4 = cranePlatformDetail.clone();
	cranePlatformDetail4.scale.set(3, 1, 1);
	cranePlatformDetail4.position.x = cranePlatformDetail3.position.x + 0.6;

	const cranePlatformDetail5 = cranePlatformDetail.clone();
	cranePlatformDetail5.scale.set(3, 1, 1);
	cranePlatformDetail5.position.x = cranePlatformDetail4.position.x + 0.6;

	const cranePlatformDetail6 = cranePlatformDetail.clone();
	cranePlatformDetail6.position.x = cranePlatformDetail5.position.x + 0.6;

	const cranePlatformDetail7 = cranePlatformDetail.clone();
	cranePlatformDetail7.position.x = cranePlatformDetail6.position.x + 0.6;

	const cranePlatformDetail8 = cranePlatformDetail.clone();
	cranePlatformDetail8.position.x = cranePlatformDetail7.position.x + 0.6;

	const cranePlatformDetail9 = cranePlatformDetail.clone();
	cranePlatformDetail9.position.x = cranePlatformDetail8.position.x + 0.6;

	const cranePlatformBack = new THREE.Mesh(geometries.cranePlatformBack, materials.standardMaterial3);
	cranePlatformBack.position.x = cranePlatform.position.x - cranePlatform.geometry.parameters.width/2;
	cranePlatformBack.position.y = cranePlatform.position.y + 0.2;
	cranePlatformBack.position.z = cranePlatform.position.z;
	cranePlatformBack.receiveShadow = true;
	cranePlatformBack.castShadow = true;

	const cranePlatFormPillarDetail = new THREE.Mesh(geometries.cranePlatFormPillarDetail, materials.metal3);
	cranePlatFormPillarDetail.position.x = - cranePlatform.geometry.parameters.width/2.2;
	cranePlatFormPillarDetail.position.y = cranePlatform.position.y + cranePlatform.geometry.parameters.height/2;
	cranePlatFormPillarDetail.position.z = cranePlatform.position.z;
	cranePlatFormPillarDetail.receiveShadow = true;
	cranePlatFormPillarDetail.castShadow = true;


	const craneWinchPillar = new THREE.Mesh(geometries.craneWinchPillar, materials.metal3);
	craneWinchPillar.position.x = - cranePlatform.geometry.parameters.width/2.2;
	craneWinchPillar.position.y = cranePlatform.position.y + cranePlatform.geometry.parameters.height/2;
	craneWinchPillar.position.z = cranePlatform.position.z/1.20;
	craneWinchPillar.receiveShadow = true;
	craneWinchPillar.castShadow = true;

	const craneWinchPillar2 = craneWinchPillar.clone();
	craneWinchPillar2.position.z = cranePlatform.position.z/0.80;

	const pillarCylinder = new THREE.Mesh(geometries.pillarCylinder, materials.metal3);
	pillarCylinder.position.x = craneWinchPillar.position.x;
	pillarCylinder.position.y = craneWinchPillar.position.y + craneWinchPillar.geometry.parameters.height/3;
	pillarCylinder.position.z = cranePlatform.position.z + .05;
	pillarCylinder.rotation.x = Math.PI/2;
	pillarCylinder.receiveShadow = true;
	pillarCylinder.castShadow = true;

	const wireDisc = new THREE.Mesh(geometries.wireDisc, materials.metal3);
	wireDisc.position.x = craneWinchPillar.position.x;
	wireDisc.position.y = craneWinchPillar.position.y + craneWinchPillar.geometry.parameters.height/3;
	wireDisc.position.z = cranePlatform.position.z + .05;
	wireDisc.rotation.x = Math.PI/2;
	wireDisc.receiveShadow = true;
	wireDisc.castShadow = true;

	const craneHouse = new THREE.Mesh(geometries.craneHouse, materials.metal3);
	craneHouse.position.y = cranePlatform.position.y + craneHouse.geometry.parameters.height/5;
	craneHouse.position.x = cranePlatform.geometry.parameters.width/3;
	craneHouse.position.z = rotationBase.position.z/2;
	craneHouse.receiveShadow = true;
	craneHouse.castShadow = true;

	const mirror = new THREE.Mesh(geometries.mirror, materials.standardMaterial);
	mirror.position.x = craneHouse.position.x;
	mirror.position.y = craneHouse.position.y;
	mirror.position.z = craneHouse.position.z - craneHouse.geometry.parameters.depth/1.99;
	mirror.rotateY(Math.PI)
	mirror.receiveShadow = true;
	mirror.castShadow = true;

	const frontMirror = new THREE.Mesh(geometries.frontMirror, materials.standardMaterial);
	frontMirror.position.x = craneHouse.position.x + craneHouse.geometry.parameters.width/1.99;
	frontMirror.position.y = craneHouse.position.y;
	frontMirror.position.z = craneHouse.position.z;
	frontMirror.rotateY(Math.PI/2)
	frontMirror.receiveShadow = true;
	frontMirror.castShadow = true;

	const halfMirror = new THREE.Mesh(geometries.halfMirror, materials.standardMaterial);
	halfMirror.position.x = craneHouse.position.x;
	halfMirror.position.y = craneHouse.position.y + craneHouse.geometry.parameters.height/3.8;
	halfMirror.position.z = craneHouse.position.z + craneHouse.geometry.parameters.depth/1.99;
	halfMirror.receiveShadow = true;
	halfMirror.castShadow = true;
	
	const mastSphere = new THREE.Mesh(geometries.mastSphere, materials.metal3);
	mastSphere.position.x = cranePlatform.geometry.parameters.width/2.5;
	mastSphere.position.y = cranePlatform.position.y + cranePlatform.geometry.parameters.height/2;
	mastSphere.position.z = cranePlatform.geometry.parameters.depth;
	mastSphere.receiveShadow = true;
	mastSphere.castShadow = true;


	return {
        rotationBase,
		cranePlatform,
		cranePlatformDetailBottom,
		cranePlatFormPillarDetail,
		cranePlatformDetail,
		cranePlatformDetail2,
		cranePlatformDetail3,
		cranePlatformDetail4,
		cranePlatformDetail5,
		cranePlatformDetail6,
		cranePlatformDetail7,
		cranePlatformDetail8,
		cranePlatformDetail9,
		cranePlatformBack,
		craneWinchPillar,
		craneWinchPillar2,
		pillarCylinder,
		wireDisc,
		craneHouse,
		mirror,
		frontMirror,
		halfMirror,
		mastSphere,
	};
}

export { createMeshes };
