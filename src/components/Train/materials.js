import * as THREE from "three";

function createMaterials() {
	const textureLoader = new THREE.TextureLoader();
	const texture = textureLoader.load("../../../assets/textures/plastic.jpg");
	const texture2 = textureLoader.load("../../../assets/textures/metal1.jpg");

	const body = [
		new THREE.MeshStandardMaterial({
			color: "firebrick",
			flatShading: true,
			map: texture,
		}),
	  new THREE.MeshPhongMaterial({flatShading: true, map: texture2 }),
    new THREE.MeshStandardMaterial({flatShading: true, map: texture2 }),
    new THREE.MeshStandardMaterial({flatShading: true, map: texture2 }),
    new THREE.MeshStandardMaterial({flatShading: true, map: texture2 }),
    new THREE.MeshStandardMaterial({flatShading: true, map: texture2 }),
    new THREE.MeshStandardMaterial({flatShading: true, map: texture2 }),
    new THREE.MeshStandardMaterial({flatShading: true, map: texture2 }),

  ];

	const detail = new THREE.MeshStandardMaterial({
		color: "darkslategray",
		flatShading: true,
	});

	return { body, detail };
}

export { createMaterials };
