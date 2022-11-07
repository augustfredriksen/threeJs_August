import * as THREE from "three";

function createGeometries() {
  const plane = new THREE.PlaneGeometry(100, 100);

  return {plane};
}

export { createGeometries };