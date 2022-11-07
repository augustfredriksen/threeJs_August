import * as THREE from "three";

function createAxesHelper() {
  const helper = new THREE.AxesHelper(5.5);
  helper.position.set(-5.5, 0, -5.5);
  return helper;
}

function createGridHelper() {
  const helper = new THREE.GridHelper(10);
  return helper;
}

export { createAxesHelper, createGridHelper };
