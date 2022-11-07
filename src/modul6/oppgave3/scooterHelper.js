import * as THREE from "three";

/*
 Liste over nødvendige deler til sparkesykkel:
 1 Base -- 1 rektangel til å stå på, 2 rektangel til felg bak, og 1 rektangel til felg foran.
 2 Hjul -- 1 sylinder som kan brukes foran og bak. -- Rotasjon
 1 Stang -- 1 sylinder som kan dupliseres og skaleres. -- Rotasjon med håndtak
 1 Håndtak -- 1 sylinder som kan dupliseres og skaleres. -- Rotasjon med stang
*/

export async function createScooterMesh() {
	const loader = new THREE.TextureLoader();
	const textureObject = await loader.loadAsync("../../../assets/textures/plastic.jpg");

	let mat = new THREE.MeshPhongMaterial({ map: textureObject });

	// Størrelser:
	const baseWidth = 25,
		baseHeight = 1,
		baseDepth = 5;

	const spoilerWidth = 5,
		spoilerHeight = 1,
		spoilerDepth = 5,
		frontSpoilerWidth = 8;

	const wheelRadius = baseDepth / 2,
		wheelHeight = baseDepth;

	const bottomStickRadius = baseHeight;
	const longStickRadius = baseHeight / 2;

	// Geometriske objekter:
	const geoBase = new THREE.BoxGeometry(baseWidth, baseHeight, baseDepth);
	const geoSpoiler = new THREE.BoxGeometry(spoilerWidth, spoilerHeight, spoilerDepth);
	const geoFrontSpoiler = new THREE.BoxGeometry(frontSpoilerWidth, spoilerHeight, spoilerDepth);
	const geoWheel = new THREE.CylinderGeometry(wheelRadius, wheelRadius, wheelHeight, 50);
	const geoBottomStick = new THREE.CylinderGeometry(bottomStickRadius, bottomStickRadius, baseWidth / 4, 50);
	const geoLongStick = new THREE.CylinderGeometry(longStickRadius, longStickRadius, baseWidth, 50);
	const geoHandleBar = new THREE.CylinderGeometry(bottomStickRadius, bottomStickRadius, baseHeight, 50);
	const geoHandleRubber = new THREE.CylinderGeometry();

	// ROOT MESH:
	const meshBase = new THREE.Mesh(geoBase, mat);
	meshBase.name = "base";

	// SPOILER:
	const meshSpoiler = new THREE.Mesh(geoSpoiler, mat);
	meshSpoiler.name = "backSpoiler";
	meshSpoiler.translateX(baseWidth / 2);
	meshSpoiler.rotateZ(Math.PI / 4);
	meshSpoiler.translateY(baseHeight * 2.4);
	meshBase.add(meshSpoiler);

	// SPOILER 2:
	const meshSpoiler2 = new THREE.Mesh(geoSpoiler, mat);
	meshSpoiler2.name = "backSpoiler2";
	meshSpoiler2.rotateZ(-Math.PI / 4);
	meshSpoiler2.translateX(baseWidth / 6);
	meshSpoiler2.translateY(baseHeight * 1.6);
	meshSpoiler.add(meshSpoiler2);

	// FRONTSPOILER:
	const meshFrontSpoiler = new THREE.Mesh(geoFrontSpoiler, mat);
	meshFrontSpoiler.name = "backSpoiler";
	meshFrontSpoiler.translateX(-(frontSpoilerWidth / 4 + baseWidth / 2));
	meshFrontSpoiler.translateY(baseHeight * 3);
	meshFrontSpoiler.rotateZ(-Math.PI / 4);
	meshBase.add(meshFrontSpoiler);

	// BAKHJUL:
	const meshBackWheel = new THREE.Mesh(geoWheel, mat);
	meshBackWheel.name = "backWheel";
	meshBackWheel.translateX(wheelRadius + baseWidth / 2);
	meshBackWheel.rotateX(Math.PI / 2);
	meshBase.add(meshBackWheel);

	// FRAMHJUL:
	const meshFrontWheel = new THREE.Mesh(geoWheel, mat);
	meshFrontWheel.name = "frontWheel";
    meshFrontWheel.animation = { angle: 0, scale: 0};
	meshFrontWheel.translateX(-(wheelRadius * 2 + baseWidth / 2));
	meshFrontWheel.rotateX(Math.PI / 2);
    meshFrontWheel.rotateY(-Math.PI/16);
	meshBase.add(meshFrontWheel);

	// HJULSTANG
	const meshWheelStick = new THREE.Mesh(geoBottomStick, mat);
	meshWheelStick.name = "bottomStick";
    meshWheelStick.animation = {angle: 0};
	meshWheelStick.translateZ(-wheelRadius - bottomStickRadius);
	//meshWheelStick.translateX(1);
	meshWheelStick.rotateX(Math.PI / 2);
	//meshWheelStick.rotateZ(Math.PI / 8);
	meshFrontWheel.add(meshWheelStick);

	// LANGSTANG
	const meshLongStick = new THREE.Mesh(geoLongStick, mat);
	meshLongStick.name = "longStick";
	//meshLongStick.translateZ(-wheelRadius - bottomStickRadius);
	meshLongStick.translateY(-10);
	meshWheelStick.add(meshLongStick);

	// HANDLEBAR
	const meshHandleBar = new THREE.Mesh(geoHandleBar, mat);
	meshHandleBar.name = "handlebar";
	meshHandleBar.translateY(-baseWidth / 2);
	meshHandleBar.rotateX(Math.PI / 2);
	meshLongStick.add(meshHandleBar);

	// HANDLEBARSTICK
	const meshHandleBarStick = new THREE.Mesh(geoHandleBar, mat);
	meshHandleBarStick.name = "handlebarStick";
	meshHandleBarStick.scale.y = baseWidth / 2;
	meshHandleBarStick.scale.x = 0.5;
	meshHandleBarStick.scale.z = 0.5;
	meshHandleBar.add(meshHandleBarStick);

	// HANDLEBARRUBBER
	const meshHandleBarRubber = new THREE.Mesh(geoHandleBar, mat);
	meshHandleBarRubber.name = "handlebarRubber";
	meshHandleBarRubber.translateY(0.4);
	meshHandleBarRubber.scale.y = 0.4;
	meshHandleBarRubber.scale.x = 2;
	meshHandleBarRubber.scale.z = 2;
	meshHandleBarStick.add(meshHandleBarRubber);

	// HANDLEBARRUBBER2
	const meshHandleBarRubber2 = new THREE.Mesh(geoHandleBar, mat);
	meshHandleBarRubber2.name = "handlebarRubber2";
	meshHandleBarRubber2.translateY(-0.4);
	meshHandleBarRubber2.scale.y = 0.4;
	meshHandleBarRubber2.scale.x = 2;
	meshHandleBarRubber2.scale.z = 2;
	meshHandleBarStick.add(meshHandleBarRubber2);

	return meshBase;
}
