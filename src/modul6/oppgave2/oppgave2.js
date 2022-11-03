import "../../style.css";
//Threejs-biblioteket (importert via package.json):
import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";
import { coffeeCup } from "./coffeeCupHelper.js";
//Globale variabler:
let g_scene, g_renderer, g_camera, g_clock, g_controls;

//STARTER!
await main();

export async function main() {
  const canvas = document.createElement("canvas");
  document.body.appendChild(canvas);

  // Renderer:
  g_renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  g_renderer.setSize(window.innerWidth, window.innerHeight);
  g_renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  g_renderer.setClearColor(0xbfd104, 0xff); //farge, alphaverdi.
  g_renderer.shadowMap.enabled = true; //NB!
  g_renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Scene
  g_scene = new THREE.Scene();
  g_scene.background = new THREE.Color(0x333333);

  // SCENEOBJEKTER
  await addSceneObjects();
  addLights();

  // Kamera:
  g_camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  g_camera.position.x = 130;
  g_camera.position.y = 180;
  g_camera.position.z = 250;
  g_camera.up = new THREE.Vector3(0, 1, 0);
  let target = new THREE.Vector3(0.0, 0.0, 0.0);
  g_camera.lookAt(target);

  // TrackballControls:
  g_controls = new TrackballControls(g_camera, g_renderer.domElement);
  g_controls.addEventListener("change", renderScene);

  // Klokke for animasjon
  g_clock = new THREE.Clock();

  // Start animasjonsløkka:
  animate(0);
}

async function addSceneObjects() {
  // Plan:
  let gPlane = new THREE.PlaneGeometry(600, 600, 10, 10);
  let mPlane = new THREE.MeshLambertMaterial({
    color: 0x91aff11,
    side: THREE.DoubleSide,
    wireframe: true,
  });
  let meshPlane = new THREE.Mesh(gPlane, mPlane);
  meshPlane.receiveShadow = true;
  meshPlane.rotation.x = Math.PI / 2;
  meshPlane.receiveShadow = true; //NB!
  g_scene.add(meshPlane);

  //
  let cup = await coffeeCup();
  cup.castShadow = true;
  cup.name = "cup";
  g_scene.add(cup);
}

function addLights() {
  // Ambient:
  let ambientLight1 = new THREE.AmbientLight(0xffffff, 0.5);
  ambientLight1.visible = true;
  g_scene.add(ambientLight1);

  //** SPOTLIGHT (penumbra = skarpe kanter dersom 0, mer diffus ved økende verdi):
  const spotLight = new THREE.SpotLight(
    0xffffff,
    0.5,
    250,
    Math.PI * 0.3,
    0,
    0
  );
  spotLight.visible = true;
  spotLight.castShadow = true;
  spotLight.shadow.camera.near = -210;
  spotLight.shadow.camera.far = 230;
  spotLight.position.set(40, 250, 200);
  g_scene.add(spotLight.target);
  g_scene.add(spotLight);
}

function animate(currentTime, camera) {
  window.requestAnimationFrame((currentTime) => {
    animate(currentTime, camera);
  });
  let delta = g_clock.getDelta();
  g_controls.update();
  renderScene();
}

function renderScene() {
  g_renderer.render(g_scene, g_camera);
}
