import * as THREE from "three";

function createLights() {
	const ambientLight = new THREE.HemisphereLight("white", "darkslategray", 1);

	const mainLight = new THREE.SpotLight("white", 2, 150, Math.PI*0.3, 0, 0);
	mainLight.visible = true;
	mainLight.castShadow = true;
	mainLight.position.set(-65, 60, 80);
	//Set up shadow properties for the light
	mainLight.shadow.mapSize = new THREE.Vector2(1024, 1024);

	mainLight.shadow.camera.near = 0.01; // default
	mainLight.shadow.camera.far = 1000; // default
	const mainLightHelper = new THREE.SpotLightHelper(mainLight, 5, 0xff0000);
	const mainLightCameraHelper = new THREE.CameraHelper(mainLight.shadow.camera);

	return { ambientLight, mainLight, mainLightHelper, mainLightCameraHelper };
}

export { createLights };
