
import * as THREE from "three";

function createLights() {
	const ambientLight = new THREE.HemisphereLight("white", "darkslategray", 1);

	const mainLight = new THREE.DirectionalLight("white", 1, 20);
	mainLight.visible = true;
	mainLight.castShadow = true;
	mainLight.position.set(-10, 20, 10);
	//Set up shadow properties for the light
	mainLight.shadow.mapSize = new THREE.Vector2(1024, 1024);
  mainLight.shadow.camera.left = -30;
  mainLight.shadow.camera.right = 30;
  mainLight.shadow.camera.top = 35;
  mainLight.shadow.camera.bottom = -30;

	mainLight.shadow.camera.near = 0.01; // default
	mainLight.shadow.camera.far = 1000; // default
	const mainLightHelper = new THREE.DirectionalLightHelper(mainLight, 5, 0xff0000);
	const mainLightCameraHelper = new THREE.CameraHelper(mainLight.shadow.camera);


	return { ambientLight, mainLight, mainLightHelper, mainLightCameraHelper };
}

export { createLights };
