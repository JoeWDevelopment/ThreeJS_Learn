var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 3000 );
var cube;
var house;

var renderer = new THREE.WebGLRenderer({ antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.gammaOutput = true;
renderer.gammaFactor = 2.2;
//shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
//
document.body.appendChild( renderer.domElement );

var controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.dampingFactor = 0.1;

createbaseScene();

camera.position.z = 13;
camera.position.y = 5;
//controls.update();

var amblight = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( amblight );


var directionalLight = new THREE.DirectionalLight( 0xffffff, 1,100 );
directionalLight.position.set(3,3,1)
directionalLight.castShadow = true;
//directionalLight.shadowCameraVisible = true;
scene.add( directionalLight );

/*
directionalLight.shadow.mapSize.width = 512;  // default
directionalLight.shadow.mapSize.height = 512; // default
directionalLight.shadow.camera.near = 0.5;    // default
directionalLight.shadow.camera.far = 500;     // default
*/

directionalLight.shadow.camera = new THREE.OrthographicCamera( -40, 40, 40, -40, 0.001, 3000);

loadModel();
//addLight();
animate();

function animate() 
{
    requestAnimationFrame( animate );

    controls.update(); 
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    if (house != undefined)
    {
    house.rotation.y += 0.01;
    }
    renderer.render( scene, camera );
}

function createbaseScene()
{
    var geometry = new THREE.PlaneGeometry(50,50);
    var material = new THREE.MeshPhongMaterial( { color: 0xf3c9ff } );
    var plane = new THREE.Mesh( geometry, material );
    plane.rotation.set(Math.PI / -2, 0, 0)
    scene.add( plane );
    plane.castShadow = false;
    plane.receiveShadow = true;

    var geometry = new THREE.BoxGeometry();
    var material = new THREE.MeshPhongMaterial( { color: 0x00DDFF } );
    cube = new THREE.Mesh( geometry, material );
    cube.position.set(0,2,0);
    scene.add( cube );
    cube.castShadow = true;
    cube.receiveShadow = true;
}

function loadModel()
{
    var loader = new THREE.GLTFLoader();

    loader.load( 'model/townhouse01.gltf', function ( gltf ) {

        house = gltf.scene;
        scene.add( house );
        var newmaterial = new THREE.MeshPhongMaterial( { color: 0xffaa00 } );
        house.material = newmaterial;
        house.castShadow = true;
        house.receiveShadow = true;
        house.position.set(0,0,0);
    },
    // called while loading is progressing
    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    }, undefined, function ( error ) {
        console.error( error );
    } );
}

function addLight()
{
    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    scene.add( directionalLight );
}