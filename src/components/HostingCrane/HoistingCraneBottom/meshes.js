import * as THREE from "three";

import { createGeometries } from "./geometries.js";
import { createMaterials } from "../materials.js";

function createMeshes() {
	const geometries = createGeometries();
	const materials = createMaterials();

	const beltRight = new THREE.Mesh(geometries.belt, materials.beltRight);
	beltRight.scale.set(0.5, 0.6, 0.3);
	beltRight.position.y = 0.61;
	beltRight.receiveShadow = true;
	beltRight.castShadow = true;

	const beltLeft = new THREE.Mesh(geometries.belt, materials.beltLeft);
	beltLeft.scale.set(0.5, 0.6, 0.3);
	beltLeft.position.y = 0.61;
	beltLeft.position.z = 3.25;
	beltLeft.receiveShadow = true;
	beltLeft.castShadow = true;

	const beltInsideRight = new THREE.Mesh(geometries.beltInside, materials.metal2);
	beltInsideRight.position.y = beltRight.position.y;
	beltInsideRight.receiveShadow = true;
	beltInsideRight.castShadow = true;

	const halfCylinderFrontRight = new THREE.Mesh(geometries.halfCylinder, materials.metal2);
	halfCylinderFrontRight.rotation.x = Math.PI / 2;
	halfCylinderFrontRight.position.y = beltInsideRight.position.y;
	halfCylinderFrontRight.position.x = beltInsideRight.geometry.parameters.width / 2;
	halfCylinderFrontRight.receiveShadow = true;
	halfCylinderFrontRight.castShadow = true;

	const halfCylinderBackRight = halfCylinderFrontRight.clone();
	halfCylinderBackRight.position.x = -beltInsideRight.geometry.parameters.width / 2;
	halfCylinderBackRight.rotation.z = Math.PI;
	halfCylinderBackRight.receiveShadow = true;
	halfCylinderBackRight.castShadow = true;

	const beltInsideLeft = beltInsideRight.clone();
	beltInsideLeft.position.z = beltLeft.position.z;

	const halfCylinderFrontLeft = halfCylinderFrontRight.clone();
  halfCylinderFrontLeft.position.z = beltInsideLeft.position.z;

	const halfCylinderBackLeft = halfCylinderBackRight.clone();
  halfCylinderBackLeft.position.z = beltInsideLeft.position.z;

  const bottomBase = new THREE.Mesh(geometries.bottomBase, materials.metal2);
  bottomBase.position.z = beltInsideLeft.position.z/2
  bottomBase.position.y = beltInsideLeft.geometry.parameters.height/2;
  bottomBase.receiveShadow = true;
  bottomBase.castShadow = true;
  

	return {
		beltRight,
		beltLeft,
		beltInsideRight,
		halfCylinderFrontRight,
		halfCylinderBackRight,
		beltInsideLeft,
		halfCylinderFrontLeft,
		halfCylinderBackLeft,
    bottomBase,
	};
}

export { createMeshes };
