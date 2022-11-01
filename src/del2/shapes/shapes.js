import '../../style.css';
//Globale variabler:
import * as THREE from "three";
import {TrackballControls} from "three/examples/jsm/controls/TrackballControls";
import {addCoordSystem} from "../../../static/lib/wfa-coord.js";

//Globale variabler:
let g_scene, g_renderer, g_camera, g_clock, g_controls;
const SIZE = 200;

//STARTER!
await main();

export async function main() {
	const canvas = document.createElement('canvas');
	document.body.appendChild(canvas);

	// Renderer:
	g_renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true});
	g_renderer.setSize(window.innerWidth, window.innerHeight);

	// Scene
	g_scene = new THREE.Scene();
	g_scene.background = new THREE.Color( 0xdddddd );
	// Sceneobjekter
	await addSceneObjects();
	addLights();

	// Kamera:
	g_camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	g_camera.position.x = 10;
	g_camera.position.y = 40;
	g_camera.position.z = 60;

	// TrackballControls:
	g_controls = new TrackballControls(g_camera, g_renderer.domElement);
	g_controls.addEventListener( 'change', renderScene);

	// Klokke for animasjon
	g_clock = new THREE.Clock();

	//Håndterer endring av vindusstørrelse:
	window.addEventListener('resize', onWindowResize, false);

	// Start animasjonsløkka:
	animate(0);
}

async function addSceneObjects() {
	const loader = new THREE.TextureLoader();
	const textureObject = await loader.loadAsync('../../../assets/textures/bird1.png');
	//Definerer modeller:
	let gTorus = new THREE.TorusGeometry(10, 3, 16, 100);
	let mTorus = new THREE.MeshPhongMaterial({color : 0x90ff30});	//NB! MeshPhongMaterial
	let meshTorus = new THREE.Mesh(gTorus, mTorus);
	meshTorus.rotation.x = Math.PI / 2;
	g_scene.add(meshTorus);

	let gPlane = new THREE.PlaneGeometry( SIZE*2, SIZE*2 );
	let mPlane = new THREE.MeshPhongMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
	let meshPlane = new THREE.Mesh( gPlane, mPlane);
	meshPlane.rotation.x = Math.PI / 2;
	g_scene.add(meshPlane);

	let gOctahedron = new THREE.OctahedronGeometry( 15 );
	let mOctahedron = new THREE.MeshPhongMaterial( {map: textureObject, color: 0xF00579} );
	let meshOctahedron = new THREE.Mesh( gOctahedron, mOctahedron );
	meshOctahedron.animation = {    //Holder på animasjonsinfo:
		angle: 0,
	};

	meshOctahedron.position.set( -15, 5, -25 );
	g_scene.add( meshOctahedron );
	meshOctahedron.name = "myOctahedron";

	// Egegndefinert plan: Se også https://threejs.org/docs/index.html?q=Geometry#api/en/core/BufferGeometry
	// SE:  https://threejs.org/docs/#api/en/core/BufferGeometry.attributes
	//      https://threejs.org/docs/#api/en/core/BufferAttribute
	let gPlane1 = new THREE.BufferGeometry();
	const vertices = new Float32Array( [
		-20, 20, 0,
		-20, -20, 0,
		20, -20, 0,

		20, -20, 0,
		20, 20, 0,
		-20, 20, 0,
	] );
	// itemSize = 3 pga. 3 verdier per vertex:
	gPlane1.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
	let mPlane1 = new THREE.MeshBasicMaterial( { color: 0xccff00 } );
	mPlane1.side = THREE.DoubleSide;	//NB! CULLLING!!
	let meshPlane1 = new THREE.Mesh(gPlane1, mPlane1);

	//Rekkefølgen bestemmes av Euler-order;
	meshPlane1.position.y = 20;
	meshPlane1.position.y = 40;
	meshPlane1.position.z = 20;
	meshPlane1.rotateY(Math.PI/3);
	meshPlane1.rotateX(Math.PI/2);
	//NB! Geometrien skaleres.
	gPlane1.scale(0.5,0.5,0.5);

	meshPlane1.name = "myPlane1";
	g_scene.add(meshPlane1);

	// Egegndefinert kube:
	let geoCube = new THREE.BufferGeometry();
	const cubePositions = new Float32Array( [
		//Forsiden (pos):
		-1, 1, 1,
		-1,-1, 1,
		1,-1, 1,

		-1,1,1,
		1, -1, 1,
		1,1,1,

		//H�yre side:
		1,1,1,
		1,-1,1,
		1,-1,-1,

		1,1,1,
		1,-1,-1,
		1,1,-1,

		//Baksiden (pos):
		1,-1,-1,
		-1,-1,-1,
		1, 1,-1,

		-1,-1,-1,
		-1,1,-1,
		1,1,-1,

		//Venstre side:
		-1,-1,-1,
		-1,1,1,
		-1,1,-1,

		-1,-1,1,
		-1,1,1,
		-1,-1,-1,

		//Topp:
		-1,1,1,
		1,1,1,
		-1,1,-1,

		-1,1,-1,
		1,1,1,
		1,1,-1,

		//Bunn:
		-1, -1, -1,
		1, -1, 1,
		-1, -1, 1,

		-1, -1, -1,
		1, -1, -1,
		1, -1, 1
	] );
	const cubeColors = new Float32Array([//Forsiden:
		1.0, 0.0, 0.0, 0.3,
		1.0, 0.0, 0.0, 0.3,
		1.0, 0.0, 0.0, 0.3,

		1.0, 0.0, 0.0, 0.3,
		1.0, 0.0, 0.0, 0.3,
		1.0, 0.0, 0.0, 0.3,

		//H�yre side:
		0.0, 1.0, 0.0, 0.3,
		0.0, 1.0, 0.0, 0.3,
		0.0, 1.0, 0.0, 0.3,

		0.0, 1.0, 0.0, 0.3,
		0.0, 1.0, 0.0, 0.3,
		0.0, 1.0, 0.0, 0.3,

		//Baksiden:
		1.0, 0, 0.0, 0.3,
		1.0, 0, 0.0, 0.3,
		1.0, 0, 0.0, 0.3,

		1.0, 0, 0.0, 0.3,
		1.0, 0, 0.0, 0.3,
		1.0, 0, 0.0, 0.3,

		//Venstre side:
		0.0, 0.0, 1.0, 0.3,
		0.0, 0.0, 1.0, 0.3,
		0.0, 0.0, 1.0, 0.3,

		0.0, 0.0, 1.0, 0.3,
		0.0, 0.0, 1.0, 0.3,
		0.0, 0.0, 1.0, 0.3,

		//Topp
		0.0, 0.0, 1, 0.3,
		0.0, 0.0, 1, 0.3,
		0.0, 0.0, 1, 0.3,

		0.0, 0.0, 1, 0.3,
		0.0, 0.0, 1, 0.3,
		0.0, 0.0, 1, 0.3,

		//Bunn:
		0.5, 0.7, 0.3, 0.3,
		0.5, 0.7, 0.3, 0.3,
		0.5, 0.7, 0.3, 0.3,

		0.5, 0.7, 0.3, 0.3,
		0.5, 0.7, 0.3, 0.3,
		0.5, 0.7, 0.3, 0.3]);

	// itemSize = 3 pga. 3 verdier per posisjon:
	geoCube.setAttribute( 'position', new THREE.BufferAttribute( cubePositions, 3 ) );
	// itemSize = 4 pga. 4 verdier per farge:
	geoCube.setAttribute( 'color', new THREE.BufferAttribute( cubeColors, 4 ) );

	let matCube = new THREE.MeshBasicMaterial({vertexColors: true} );
	let meshCube = new THREE.Mesh(geoCube, matCube);
	meshCube.scale.x = 10;
	meshCube.scale.y = 10;
	meshCube.scale.z = 10;
	//ev. meshCube.scale.set(10,10,10);
	meshCube.position.x = -35;
	meshCube.name = "myCube";
	meshCube.animation = {    //Holder på animasjonsinfo:
		angle: 0,
	}

	g_scene.add(meshCube);

	// Alternativt eget koordinatsystem:
	addCoordSystem(g_scene);
}

function addLights() {
	let light1 = new THREE.DirectionalLight(0xffffff, 1.0); //farge, intensitet (1=default)
	light1.position.set(2, 1, 4);
	g_scene.add(light1);

	let light2 = new THREE.DirectionalLight(0xffffff, 1.0); //farge, intensitet (1=default)
	light2.position.set(-2, -1, -4);
	g_scene.add(light2);
}

function animate(currentTime) {
	window.requestAnimationFrame((currentTime) => {
		animate(currentTime);
	});

	let delta = g_clock.getDelta();

	//Roterer kuben:
	let meshCube = g_scene.getObjectByName("myCube");
	let rotationSpeed = (Math.PI / 3);
	meshCube.animation.angle = meshCube.animation.angle + (rotationSpeed * delta);
	meshCube.animation.angle %= (Math.PI * 2); // "Rull rundt" dersom angle >= 360 grader.

	meshCube.rotation.x = meshCube.animation.angle;
	meshCube.rotation.y = meshCube.animation.angle;

	let meshOctahedron = g_scene.getObjectByName("myOctahedron");
	meshOctahedron.rotation.y = meshOctahedron.animation.angle;
	meshOctahedron.animation.angle = meshOctahedron.animation.angle + (rotationSpeed * delta);
	meshOctahedron.animation.angle %= (Math.PI * 2); // "Rull rundt" dersom angle >= 360 grader.

	//Oppdater trackball-kontrollen:
	g_controls.update();

	//Tegner scenen med gitt kamera:
	renderScene();
}

function renderScene()
{
	g_renderer.render(g_scene, g_camera);
}


function onWindowResize() {

	g_camera.aspect = window.innerWidth / window.innerHeight;
	g_camera.updateProjectionMatrix();

	g_renderer.setSize(window.innerWidth, window.innerHeight);

	g_controls.handleResize();
	renderScene();
}
