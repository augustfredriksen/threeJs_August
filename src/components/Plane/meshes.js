import * as THREE from "three";

import { createGeometries } from './geometries.js';
import { createMaterials } from './materials.js';

function createMeshes() {
  const geometries = createGeometries();
  const materials = createMaterials();

  const plane = new THREE.Mesh(geometries.plane, materials.body);
  plane.rotation.x = Math.PI/2
  plane.position.set(0, 0, 0);
  plane.receiveShadow = true;



  return { plane };
}

export { createMeshes };