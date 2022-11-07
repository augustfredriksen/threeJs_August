import * as THREE from "three";
import { Color } from "three";

function createMaterials() {
	const textureLoader = new THREE.TextureLoader();
	const tireTexture = textureLoader.load("../../../assets/textures/tire.jpg");
	const tireTexture2 = textureLoader.load("../../../assets/textures/tire.jpg");
	const metalTexture = textureLoader.load("../../../assets/textures/chocchip.png")
	const metalTexture2 = textureLoader.load("../../../assets/textures/blackmetal.jpg")
	const metalTexture3 = textureLoader.load("../../../assets/textures/black_concrete.jpg")
	const orangeMetalTexture = textureLoader.load("../../../assets/textures/orange_metal.jpg")
	const tile = textureLoader.load("../../../assets/textures/tile2.png")
	tireTexture.wrapS = THREE.RepeatWrapping;
	tireTexture.wrapT = THREE.MirroredRepeatWrapping;
	tireTexture2.wrapS = THREE.RepeatWrapping;
	tireTexture2.wrapT = THREE.MirroredRepeatWrapping;

	const cubeTextureLoader = new THREE.CubeTextureLoader();
	const environmentMapTexture = cubeTextureLoader.load([
		"../../../assets/cubemaps/GardenNook/px.png",
		"../../../assets/cubemaps/GardenNook/nx.png",
		"../../../assets/cubemaps/GardenNook/py.png",
		"../../../assets/cubemaps/GardenNook/ny.png",
		"../../../assets/cubemaps/GardenNook/pz.png",
		"../../../assets/cubemaps/GardenNook/nz.png",
	])

	const standardMaterial = new THREE.MeshStandardMaterial({
		metalness: 0.4,
		roughness: 0.0,
		envMap: environmentMapTexture,
		displacementScale: 0.5,
	});

	const standardMaterial2 = new THREE.MeshStandardMaterial({
		metalness: .4,
		roughness: 0.2,
		envMap: environmentMapTexture,
		color: "lightgrey"
	});

	const standardMaterial3 = new THREE.MeshStandardMaterial({
		metalness: .9,
		roughness: 0.2,
		envMap: environmentMapTexture,
		color: "firebrick"
	});

	const bodyMaterial = new THREE.MeshStandardMaterial({
		color: "ghostwhite",
		side: THREE.DoubleSide,
		flatShading: true,
	})

	const beltRight = new THREE.MeshPhongMaterial({
		flatShading: true,
		side: THREE.DoubleSide,
		map: tireTexture,
		side: THREE.DoubleSide,
	});

	const beltLeft = new THREE.MeshPhongMaterial({
		flatShading: true,
		side: THREE.DoubleSide,
		map: tireTexture2,
	});

	const metalBody = new THREE.MeshPhongMaterial({
		flatShading: true,
		side: THREE.DoubleSide,
		map: metalTexture,
	});

	const metal2 = new THREE.MeshPhongMaterial({
		flatShading: true,
		side: THREE.DoubleSide,
		map: metalTexture2,
	});

	const metal3 = new THREE.MeshStandardMaterial({
		flatShading: true,
		metalness: 0.9,
		roughness: 0.1,
		envMap: environmentMapTexture,
		side: THREE.DoubleSide,
		map: metalTexture3,
	});

	const tileBody = new THREE.MeshPhongMaterial({
		flatShading: true,
		side: THREE.DoubleSide,
		map: tile,
	});

	return { beltRight, beltLeft, metalBody, environmentMapTexture, standardMaterial, standardMaterial2, standardMaterial3, metal2, metal3, tileBody, bodyMaterial };
}

export { createMaterials };
