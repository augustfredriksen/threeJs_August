import * as THREE from "three";
import { createMaterials } from "./HostingCrane/materials.js";
function createScene() {
  const materials = createMaterials();
  const scene = new THREE.Scene();
  const scene2 = new THREE.Scene();

  scene.background = new THREE.Color("darksalmon");

  return scene;
}

export { createScene };
