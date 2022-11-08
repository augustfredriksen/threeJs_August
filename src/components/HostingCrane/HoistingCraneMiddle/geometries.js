import * as THREE from "three";
import { PlaneGeometry } from "three";
import { Reflector } from "three/examples/jsm/objects/Reflector";

function createGeometries() {
	const rotationBase = new THREE.CylinderGeometry(1, 0.8, 0.6, 20);
	const cranePlatform = new THREE.BoxGeometry(6, 1, 2);
	const cranePlatformDetail = new THREE.BoxGeometry(0.2, 0.6, 2.1);
	const cranePlatformDetailBottom = new THREE.BoxGeometry(5.8, 0.2, 2.1);
	const cranePlatformBack = new THREE.BoxGeometry(0.5, 1.5, 2.25);
	const cranePlatFormPillarDetail = new THREE.BoxGeometry(0.35, 0.1, 1.5);
  const pillarCylinder = new THREE.CylinderGeometry(.07, .07 ,1 , 10);
  const wireDisc = new THREE.CylinderGeometry(.2, .2, .3, 10);
	const craneWinchPillar = new THREE.BoxGeometry(0.2, 1, 0.1);
	const craneHouse = new THREE.BoxGeometry(1.5, 2, 1.25);
	const mirror = new PlaneGeometry(1.25, 1.8);
	const frontMirror = new PlaneGeometry(1, 1.8);
	const halfMirror = new PlaneGeometry(1.25, 0.725);
	const mastSphere = new THREE.SphereGeometry(0.3, 300, 300);
  const lightBulb = new THREE.CylinderGeometry(.1, .1, .1, 10);
  const lightBulbTarget = new THREE.BoxGeometry(1, 1, 1);
  const wireSupport = new THREE.BoxGeometry(5, .2, .1);
  const topLine = new THREE.BufferGeometry();


	return {
		rotationBase,
		cranePlatform,
		cranePlatformDetail,
		cranePlatFormPillarDetail,
    pillarCylinder,
    wireDisc,
		cranePlatformDetailBottom,
		cranePlatformBack,
		craneWinchPillar,
		craneHouse,
		mirror,
		frontMirror,
		halfMirror,
    mastSphere,
    lightBulb,
    lightBulbTarget,
    wireSupport,
    topLine,
	};
}

export { createGeometries };
