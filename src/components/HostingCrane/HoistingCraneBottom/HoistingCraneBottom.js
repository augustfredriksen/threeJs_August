import * as THREE from "three";

import { createMeshes } from './meshes.js';

class HoistingCraneBottom extends THREE.Group {
  constructor() {
    super();

    this.meshes = createMeshes();

    this.add(
      this.meshes.beltRight,
      this.meshes.beltLeft,
      this.meshes.beltInsideRight,
      this.meshes.halfCylinderFrontRight,
      this.meshes.halfCylinderBackRight,
      this.meshes.beltInsideLeft,
      this.meshes.halfCylinderFrontLeft,
      this.meshes.halfCylinderBackLeft,
      this.meshes.bottomBase,
    );
  }

  tick(delta) {

  }
}

export { HoistingCraneBottom };