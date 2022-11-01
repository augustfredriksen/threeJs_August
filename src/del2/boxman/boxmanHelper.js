/**
 * Funksjoner som lager meshobjekter til dronen.
 */
import * as THREE from "three";

export async function createBoxmanMesh() {

	const loader = new THREE.TextureLoader();
	const textureObject = await loader.loadAsync('../../../assets/textures/metal1.jpg');

	let mat = new THREE.MeshPhongMaterial({ map: textureObject });

	//Størrelser:
	const tW = 10, tH=20, tD=5; 				//torso-Width, Height, Depth
	const raW=tW*1.2, raH=tH/10.0, raD=raH;	//righttarm
	const laW = tW * 1.2, laH = tH / 10.0, laD = laH;	//righttarm

	//Geometri-objekter:
	const geoTorso = new THREE.BoxGeometry(tW, tH, tD);
	const geoRUA = new THREE.BoxGeometry(raW, raH, raD);
	const geoRLA = new THREE.BoxGeometry(raW, raH, raD);
	const geoLUA = new THREE.BoxGeometry(laW, laH, laD);
	const geoLLA = new THREE.BoxGeometry(laW, laH, laD);

	const axisHelper1 = new THREE.AxesHelper(50);

	//Rotmesh:
	const meshTorso = new THREE.Mesh(geoTorso, mat);
	meshTorso.add(axisHelper1);
	meshTorso.position.x = 24;
	meshTorso.position.z = -24;
	meshTorso.name = 'torso';

	//Right Upper Arm:
	const meshRUA = new THREE.Mesh(geoRUA, mat);
	const axisHelper2 = new THREE.AxesHelper(30);
	meshRUA.add(axisHelper2);
	meshRUA.name = 'rightUpperArm';
	meshRUA.animation = { angle: 0 };
	meshRUA.translateY(tH / 2);	          //Flytter OPP i forhold til torsoen.
	meshRUA.translateX(tW / 2 + raW / 2);    //Flytter til HØYRE i forhold til torsoen.
	meshTorso.add(meshRUA);
	//Right Lower Arm:
	const meshRLA = new THREE.Mesh(geoRLA, mat);
	const axisHelper3 = new THREE.AxesHelper(30);
	meshRLA.add(axisHelper3);
	meshRLA.name = 'rightLowerArm';
	meshRLA.animation = { angle: 0 };
	meshRLA.translateX(raW/2+raW/2);     //Flytter til HØYRE i forhold til RA.
	meshRUA.add(meshRLA);        //Legges til overarmen.

	//Left Upper Arm:
	const meshLUA = new THREE.Mesh(geoLUA, mat);
	const axisHelper4 = new THREE.AxesHelper(30);
	meshLUA.add(axisHelper4);
	meshLUA.name = 'leftUpperArm';
	meshLUA.animation = { angle: 0 };
	meshLUA.translateY(tH / 2);	          //Flytter OPP i forhold til torsoen.
	meshLUA.translateX(-tW / 2 - raW / 2);   //Flytter til VENSTRE i forhold til torsoen.
	meshTorso.add(meshLUA);
	//Left Lower Arm:
	const meshLLA = new THREE.Mesh(geoLLA, mat);
	const axisHelper5 = new THREE.AxesHelper(30);
	meshLLA.add(axisHelper5);
	meshLLA.name = 'leftLowerArm';
	meshLLA.animation = { angle: 0 };
	meshLLA.translateX(-raW/2-raW/2);   //Flytter til VENSTRE i forhold til LA.
	meshLUA.add(meshLLA);        //Legges til overarmen.

	return meshTorso;
}
