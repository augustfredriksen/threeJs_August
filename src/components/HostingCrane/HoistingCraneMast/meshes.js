import * as THREE from "three";

import { createGeometries } from "./geometries.js";
import { createMaterials } from "../materials.js";
import { createMeshes as createMiddleMeshes } from "../HoistingCraneMiddle/meshes.js";

function createMeshes() {
	const pillarAngle = Math.PI / 9;
	const detailPillarAngle = Math.PI / 2;
	const geometries = createGeometries();
	const materials = createMaterials();
	const middleMeshes = createMiddleMeshes();

	const mastSphere = new THREE.Mesh(geometries.mastSphere, materials.metal3);
	mastSphere.position.x = middleMeshes.cranePlatform.geometry.parameters.width / 2.5;
	mastSphere.position.y =
		middleMeshes.cranePlatform.position.y + middleMeshes.cranePlatform.geometry.parameters.height / 2;
	mastSphere.position.z = middleMeshes.cranePlatform.geometry.parameters.depth;

	const bottomPillar = new THREE.Mesh(geometries.bottomPillar, materials.metal3);
	bottomPillar.castShadow = true;

	const bottomPillar2 = bottomPillar.clone();
	bottomPillar2.position.z =
		bottomPillar.position.z + pillarAngle - bottomPillar.geometry.parameters.radiusBottom / 2;
	bottomPillar2.rotation.x = pillarAngle;

	const bottomPillar3 = bottomPillar.clone();
	bottomPillar3.position.z =
		bottomPillar.position.z - pillarAngle + bottomPillar.geometry.parameters.radiusBottom / 2;
	bottomPillar3.rotation.x = -pillarAngle;

	const bottomPillar4 = bottomPillar.clone();
	bottomPillar4.position.x =
		bottomPillar.position.x - pillarAngle + bottomPillar.geometry.parameters.radiusBottom / 2;
	bottomPillar4.rotation.z = pillarAngle;

	const bottomPillar5 = bottomPillar.clone();
	bottomPillar5.position.x =
		bottomPillar.position.x + pillarAngle - bottomPillar.geometry.parameters.radiusBottom / 2;
	bottomPillar5.rotation.z = -pillarAngle;

	const bottomMast = new THREE.Group();
	bottomMast.position.x = mastSphere.position.x;
	bottomMast.position.y = mastSphere.position.y + bottomPillar.geometry.parameters.height / 2;
	bottomMast.position.z = mastSphere.position.z;
	bottomMast.add(bottomPillar2);
	bottomMast.add(bottomPillar3);
	bottomMast.add(bottomPillar4);
	bottomMast.add(bottomPillar5);

	const middlePillar = new THREE.Mesh(geometries.middlePillar, materials.metal3);
	middlePillar.castShadow = true;

	const middlePillar2 = middlePillar.clone();
	middlePillar2.position.z =
		bottomPillar.position.z - pillarAngle * 2 + bottomPillar.geometry.parameters.radiusBottom / 2;

	const middlePillar3 = middlePillar.clone();
	middlePillar3.position.z =
		bottomPillar.position.z + pillarAngle * 2 - bottomPillar.geometry.parameters.radiusBottom / 2;

	const middlePillar4 = middlePillar.clone();
	middlePillar4.position.x =
		bottomPillar.position.x - pillarAngle * 2 + bottomPillar.geometry.parameters.radiusBottom / 2;

	const middlePillar5 = middlePillar.clone();
	middlePillar5.position.x =
		bottomPillar.position.x + pillarAngle * 2 - bottomPillar.geometry.parameters.radiusBottom / 2;

	const middleMast = new THREE.Group();
	middleMast.position.x = mastSphere.position.x;
	middleMast.position.y =
		mastSphere.position.y + middlePillar.geometry.parameters.height / 2 + bottomPillar.geometry.parameters.height;
	middleMast.position.z = mastSphere.position.z;
	middleMast.add(middlePillar2);
	middleMast.add(middlePillar3);
	middleMast.add(middlePillar4);
	middleMast.add(middlePillar5);

	const topMast = bottomMast.clone();
	topMast.rotation.z = Math.PI;
	topMast.position.y =
		mastSphere.position.y + middlePillar.geometry.parameters.height / 2 + middlePillar.geometry.parameters.height - bottomPillar.geometry.parameters.height*0.5;

	const topOfMast = new THREE.Mesh(geometries.topOfMast, materials.metal3);
	topOfMast.position.y =
		topMast.position.y + bottomPillar.geometry.parameters.height / 2 - topOfMast.geometry.parameters.height;
	topOfMast.position.z = topMast.position.z;
	topOfMast.position.x = topMast.position.x;
	topOfMast.receiveShadow = true;
	topOfMast.castShadow = true;

	const mastDetailPillar = new THREE.Mesh(geometries.mastDetailPillar, materials.metal3);
	mastDetailPillar.castShadow = true;

	const mastDetailPillar2 = mastDetailPillar.clone();
	mastDetailPillar2.position.z = bottomPillar.position.z + pillarAngle;
	mastDetailPillar2.position.x = bottomPillar.position.x + pillarAngle;
	mastDetailPillar2.rotation.x = Math.PI / 2;
	mastDetailPillar2.rotation.z = Math.PI / 4;

	const mastDetailPillar3 = mastDetailPillar.clone();
	mastDetailPillar3.position.z = bottomPillar.position.z - pillarAngle;
	mastDetailPillar3.position.x = bottomPillar.position.x - pillarAngle;
	mastDetailPillar3.rotation.x = Math.PI / 2;
	mastDetailPillar3.rotation.z = Math.PI / 4;

	const mastDetailPillar4 = mastDetailPillar.clone();
	mastDetailPillar4.rotation.x = Math.PI / 2;
	mastDetailPillar4.rotation.z = Math.PI / (1 + 1 / 3);
	mastDetailPillar4.position.x -= 1 / 3;
	mastDetailPillar4.position.z += 1 / 3;

	const mastDetailPillar5 = mastDetailPillar.clone();
	mastDetailPillar5.position.x += 1 / 3;
	mastDetailPillar5.position.z -= 1 / 3;
	mastDetailPillar5.rotation.x = Math.PI / 2;
	mastDetailPillar5.rotation.z = Math.PI / (1 + 1 / 3);

	const mastDetailSphere = new THREE.Mesh(geometries.mastDetailSphere, materials.metal3);
	mastDetailSphere.castShadow = true;

	const mastDetailSphere2 = mastDetailSphere.clone();
	mastDetailSphere2.position.z =
		bottomPillar.position.z - pillarAngle * 2 + bottomPillar.geometry.parameters.radiusBottom / 2;

	const mastDetailSphere3 = mastDetailSphere.clone();
	mastDetailSphere3.name = "DetailSphere";
	mastDetailSphere3.position.z =
		bottomPillar.position.z + pillarAngle * 2 - bottomPillar.geometry.parameters.radiusBottom / 2;

	const mastDetailSphere4 = mastDetailSphere.clone();
	mastDetailSphere4.position.x =
		bottomPillar.position.x - pillarAngle * 2 + bottomPillar.geometry.parameters.radiusBottom / 2;

	const mastDetailSphere5 = mastDetailSphere.clone();
	mastDetailSphere5.position.x =
		bottomPillar.position.x + pillarAngle * 2 - bottomPillar.geometry.parameters.radiusBottom / 2;

	const mastDetail = new THREE.Group();
	mastDetail.position.x = mastSphere.position.x;
	mastDetail.position.y = mastSphere.position.y + bottomPillar.geometry.parameters.height;
	mastDetail.position.z = mastSphere.position.z;
	mastDetail.add(mastDetailSphere2);
	mastDetail.add(mastDetailSphere3);
	mastDetail.add(mastDetailSphere4);
	mastDetail.add(mastDetailSphere5);
	mastDetail.add(mastDetailPillar2);
	mastDetail.add(mastDetailPillar3);
	mastDetail.add(mastDetailPillar4);
	mastDetail.add(mastDetailPillar5);

	const mastDetail2 = mastDetail.clone();
	mastDetail2.position.y += 1;

	const mastDetail3 = mastDetail2.clone();
	mastDetail3.position.y += 1;

	const mastDetail4 = mastDetail3.clone();
	mastDetail4.position.y += 1;

	const mastDetail5 = mastDetail4.clone();
	mastDetail5.position.y += 1;

	const mastDetail6 = mastDetail5.clone();
	mastDetail6.position.y += 1;

	const mastDetail7 = mastDetail6.clone();
	mastDetail7.position.y += 1;

	const mastDetail8 = mastDetail7.clone();
	mastDetail8.position.y += 1;

	const mastDetail9 = mastDetail8.clone();
	mastDetail9.position.y += 1;

	const mastDetailGroup = new THREE.Group();
	mastDetailGroup.add(mastDetail);
	mastDetailGroup.add(mastDetail2);
	mastDetailGroup.add(mastDetail3);
	mastDetailGroup.add(mastDetail4);
	mastDetailGroup.add(mastDetail5);
	mastDetailGroup.add(mastDetail6);
	mastDetailGroup.add(mastDetail7);
	mastDetailGroup.add(mastDetail8);
	mastDetailGroup.add(mastDetail9);

	const mastSupport = new THREE.Object3D();
	const mastSupportMesh = new THREE.Mesh(geometries.mastSupport, materials.metal3);
	mastSupportMesh.castShadow = true;
	mastSupportMesh.receiveShadow = true;
	mastSupportMesh.position.y = mastSphere.position.y;
	mastSupportMesh.position.z = mastSphere.position.z;
	mastSupportMesh.position.x = -mastSphere.position.x
	mastSupport.add(mastSupportMesh);

	const hook = new THREE.Mesh(geometries.hook, materials.metal3);
	hook.position.x = middleMeshes.cranePlatform.geometry.parameters.width;
	hook.position.y = middlePillar.geometry.parameters.height;
	hook.position.z = mastSphere.position.z;
	hook.receiveShadow = true;
	hook.castShadow = true;
	hook.rotation.z = Math.PI/5;
	//hook.rotation.z = -Math.PI/2;

	const points = [];
	points.push(topOfMast.position);
	points.push(hook.position);
	const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
	const line = new THREE.Line(lineGeometry, materials.lineMaterial);
	line.receiveShadow = true;
	line.castShadow = true;

	const points2 = [];
	points2.push(topOfMast.position);
	points2.push(middleMeshes.wireSupportDisc.position);
	const lineGeometry2 = new THREE.BufferGeometry().setFromPoints(points);
	const line2 = new THREE.Line(lineGeometry2, materials.lineMaterial);
	line2.receiveShadow = true;
	line2.castShadow = true;




	return {
		bottomMast,
		middleMast,
		topMast,
		topOfMast,
		mastDetailGroup,
		hook,
		line,
		line2,
	};
}

export { createMeshes };
