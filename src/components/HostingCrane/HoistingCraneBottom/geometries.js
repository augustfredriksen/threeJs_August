import * as THREE from "three";

function createGeometries() {
	let path = new THREE.Path();
	path.absarc(5, 0, 1, Math.PI * 0.5, Math.PI * 1.5, true);
	path.absarc(-5, 0, 1, Math.PI * 1.5, Math.PI * 0.5, true);
	path.closePath();
	let basePts = path.getSpacedPoints(200).reverse();

	const belt = new THREE.PlaneGeometry(1, 1, 200, 1);
	basePts.forEach((p, idx) => {
		belt.attributes.position.setXYZ(idx, p.x, p.y, -2);
		belt.attributes.position.setXYZ(idx + 201, p.x, p.y, 2);
	});

  const beltInside = new THREE.BoxGeometry(4.8, 1.19, 0.8);

  const halfCylinder = new THREE.CylinderGeometry(.59, .59, 0.8, 30, 1, false, 0, Math.PI);

  const bottomBase = new THREE.BoxGeometry(2, .5, 3);



	return { belt, beltInside, halfCylinder, bottomBase };
}

export { createGeometries };
