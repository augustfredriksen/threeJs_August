import * as THREE from "three";

import { createMeshes } from './meshes.js';

const wheelSpeed = THREE.MathUtils.degToRad(60);

class Train2 extends THREE.Group {
  constructor() {
    super();

    this.meshes = createMeshes();

    this.add(
      this.meshes.nose,
      this.meshes.cabin,
      this.meshes.chimney,
      this.meshes.smallWheelRear,
      this.meshes.smallWheelCenter,
      this.meshes.smallWheelFront,
      this.meshes.bigWheel,
    );
  }

  tick(delta) {

  }
}

export { Train2 };
