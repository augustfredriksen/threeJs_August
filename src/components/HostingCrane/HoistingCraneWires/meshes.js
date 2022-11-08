import * as THREE from "three";

import { createGeometries } from "./geometries.js";
import { createMaterials } from "../materials.js";
import { createMeshes as createMastMeshes } from "../HoistingCraneMast/meshes.js";

function createMeshes() {
	const geometries = createGeometries();
	const materials = createMaterials();
	const mastMeshes = createMastMeshes();

	const wireSupport = new THREE.Mesh(geometries.wireSupport, materials.standardMaterial);
	wireSupport.position.x = mastMeshes.topOfMast.position.x + 4.5;
	wireSupport.position.y = mastMeshes.topOfMast.position.y - wireSupport.geometry.parameters.height;
	wireSupport.position.z = mastMeshes.topOfMast.position.z;

	

	return {
		wireSupport,
	};
}

export { createMeshes };
