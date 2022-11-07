import * as THREE from "three";

function createCamera() {
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 100);

  camera.position.set(-9, 7, 7);

  return camera;
}

export { createCamera };
