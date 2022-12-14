import * as THREE from "three";

import { createMeshes } from './meshes.js';

class HoistingCraneMast extends THREE.Group {
  constructor() {
    super();

    this.meshes = createMeshes();

    this.add(
      this.meshes.mastSphere,
      this.meshes.bottomMast,
      this.meshes.middleMast,
      this.meshes.topMast,
      this.meshes.topOfMast,
      this.meshes.mastDetailGroup,
      this.meshes.hook,
      this.meshes.line,
      this.meshes.line2,
    );
  }

  tick(delta) {

  }
}

export { HoistingCraneMast };