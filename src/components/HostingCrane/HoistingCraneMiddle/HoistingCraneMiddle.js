import * as THREE from "three";

import { createMeshes } from './meshes.js';

class HoistingCraneMiddle extends THREE.Group {
  constructor() {
    super();

    this.meshes = createMeshes();


    this.add(
      this.meshes.rotationBase,
      this.meshes.cranePlatform,
      this.meshes.cranePlatformDetailBottom,
      this.meshes.cranePlatformDetail,
      this.meshes.cranePlatformDetail2,
      this.meshes.cranePlatformDetail3,
      this.meshes.cranePlatformDetail4,
      this.meshes.cranePlatformDetail5,
      this.meshes.cranePlatformDetail6,
      this.meshes.cranePlatformDetail7,
      this.meshes.cranePlatformDetail8,
      this.meshes.cranePlatformDetail9,
      this.meshes.cranePlatformBack,
      this.meshes.craneWinchPillar,
      this.meshes.craneWinchPillar2,
      this.meshes.cranePlatFormPillarDetail,
      this.meshes.pillarCylinder,
      this.meshes.wireDisc,
      this.meshes.craneHouse,
      this.meshes.mirror,
      this.meshes.frontMirror,
      this.meshes.halfMirror,
      this.meshes.mastSphere,
    );
    
  }

  tick(delta) {

  }
}

export { HoistingCraneMiddle };