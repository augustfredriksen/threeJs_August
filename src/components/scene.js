import * as THREE from "three";
import { createMaterials } from "./HostingCrane/materials.js";
function createScene() {
  const materials = createMaterials();
  const scene = new THREE.Scene();

  //scene.background = materials.environmentMapTexture;

  return scene;
}

export { createScene };
