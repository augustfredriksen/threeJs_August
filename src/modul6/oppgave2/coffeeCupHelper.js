import * as THREE from "three";

export async function coffeeCup() {
    const loader = new THREE.TextureLoader();
    const cupTexture = await loader.loadAsync('../../../assets/textures/metal_tread_plate1.jpg');
    let cupMaterial = new THREE.MeshPhongMaterial({ map : cupTexture, side: THREE.DoubleSide });

    // Container for hele koppen
    const cup = new THREE.Group();
    

    // BUNNEN - CYLINDER
    let bottomGeometry = new THREE.CylinderGeometry( 32, 32, 2, 32 );
    let bottomMesh = new THREE.Mesh(bottomGeometry, cupMaterial);
    bottomMesh.name = 'bottom';
    bottomMesh.position.x = 0;
    bottomMesh.position.y = 0;
    bottomMesh.position.z = 0;
    cup.add(bottomMesh);

    // KOPPEN - LATHE
    let points = [];
    for (let x = 0; x < 1; x = x + 0.1) {
        let y = Math.pow(x, 5)*2;
        points.push(new THREE.Vector2(x * 70, y * 53));
    }
    let latheGeometry = new THREE.LatheGeometry(points, 128, 0, 10 * Math.PI);
    let latheMesh = new THREE.Mesh(latheGeometry, cupMaterial);
    latheMesh.name = 'bottom';
    latheMesh.position.x = 0;
    latheMesh.position.y = 0;
    latheMesh.position.z = 0;
    cup.add(latheMesh);

    // HANKEN - TORUS
    let TorusGeometry = new THREE.TorusGeometry(32, 4, 16, 100, Math.PI);
    let torusMesh = new THREE.Mesh(TorusGeometry, cupMaterial);
    torusMesh.name = 'handle'
    torusMesh.rotation.z = -Math.PI/2 - Math.PI/12;
    torusMesh.position.x = 57;
    torusMesh.position.y = 50;
    torusMesh.position.z = 0;
    cup.add(torusMesh);

    // KAFFEN - SYLINDER
    let coffeeTexture = new THREE.TextureLoader().load('../assets/images/tile2.png');
	let coffeeGeometry = new THREE.CylinderGeometry( 64, 64, 0.2, 32 );
	let coffeeMaterial = new THREE.MeshPhongMaterial({color:0x7F4600, map : coffeeTexture});
	let coffeeMesh = new THREE.Mesh( coffeeGeometry, coffeeMaterial );
	coffeeMesh.position.x = 0;
	coffeeMesh.position.y = 80;
	coffeeMesh.position.z = 0;
    coffeeMesh.receiveShadow = true;
	cup.add( coffeeMesh );

    // RETURN GROUP
    return cup;
}