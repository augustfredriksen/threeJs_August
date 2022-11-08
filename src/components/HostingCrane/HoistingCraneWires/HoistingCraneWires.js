import * as THREE from "three";

import { createMeshes } from './meshes.js';

class HoistingCraneWires extends THREE.Group {
  constructor() {
    super();

    this.meshes = createMeshes();

    this.add(
      this.meshes.wireSupport,
      this.meshes.hook,
    );
  }

  tick(delta) {

  }
}

export { HoistingCraneWires };