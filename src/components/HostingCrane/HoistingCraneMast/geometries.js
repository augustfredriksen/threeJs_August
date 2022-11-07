import * as THREE from "three";
import { PlaneGeometry } from "three";
import { Reflector } from "three/examples/jsm/objects/Reflector";

function createGeometries() {
	const mastSphere = new THREE.SphereGeometry(0.3, 300, 300);
	const bottomPillar = new THREE.CylinderGeometry(0.06, 0.06, 2, 10);
	const middlePillar = new THREE.CylinderGeometry(0.06, 0.06, 6, 10);
	const topOfMast = new THREE.CylinderGeometry(0.2, 0.2, 0.3, 5);
	const mastDetailPillar = new THREE.CylinderGeometry(.06, .06, 1, 10);
	const mastDetailSphere = new THREE.SphereGeometry(0.1, 10, 10);
	const mastSupport = new THREE.CylinderGeometry(.06, .06, 5, 4);

	return {
		mastSphere,
		bottomPillar,
		middlePillar,
		topOfMast,
		mastDetailPillar,
		mastDetailSphere,
		mastSupport,
	};
}

export { createGeometries };
