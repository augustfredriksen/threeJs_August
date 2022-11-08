import * as THREE from "three";

function createGeometries() {
  const plane = new THREE.PlaneGeometry(20, 20);

  return {plane};
}

export { createGeometries };