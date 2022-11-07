import * as THREE from "three";

import { createMeshes } from './meshes.js';


class Plane extends THREE.Group {
  constructor() {
    super();

    this.meshes = createMeshes();

    this.add(
      this.meshes.plane
    );
  }

  tick(delta) {
    
  }
}

export { Plane };