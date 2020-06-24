//const { AddOperation } = require("./three");

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 50 , window.innerWidth / window.innerHeight, 0.1, 3000 );
//var cube;
var house;
var exrCubeRenderTarget;
var particle;

var ShowModelledInfinityCove = true;
var ShowParticles = false;

var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true});
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.gammaOutput = true;
renderer.gammaFactor = 2.2;


window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){

camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();

renderer.setSize( window.innerWidth, window.innerHeight );
}


//shadows
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
renderer.setClearColor(0x000000, 0);
//
document.body.appendChild( renderer.domElement );

var controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.enablePan = false;
controls.enableRotate = true;
controls.enableZoom = false
var piAngle = (Math.PI/180);
controls.maxAzimuthAngle = piAngle*180;//Azimuth angle is measured from 0 to pi (for some reason)
controls.minAzimuthAngle = piAngle*0;
controls.maxPolarAngle = piAngle*100;


createbaseScene();

camera.position.z = -5;
camera.position.y = 8;
camera.position.x = 18;

controls.target = new THREE.Vector3( 0, 5, 0 );
//controls.update();

createEnvironmentMapTexture();

addLights();
loadModel();
if (ShowModelledInfinityCove) {loadCove();}
if (ShowParticles) {addParticles();}

animate();

function animate() 
{
    requestAnimationFrame( animate );


    controls.update(); 
    
    if (house != undefined)
    {
    //house.rotation.y += 0.01;
    }

    if (ShowParticles)
    {
    particle.rotation.y -= 0.0040;
    }
    renderer.render( scene, camera );
}

function createbaseScene()
{
    /*
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
    */
}

function createEnvironmentMapTexture()
{
//ENV
THREE.DefaultLoadingManager.onLoad = function ( ) {
    pmremGenerator.dispose();
};
new THREE.EXRLoader()
    .setDataType( THREE.FloatType )
    .load( 'tex/GSG_PRO_STUDIOS_METAL_043_sm.exr', function ( texture ) {

        exrCubeRenderTarget = pmremGenerator.fromEquirectangular( texture );
        exrBackground = exrCubeRenderTarget.texture;

        texture.dispose();
    } );

var pmremGenerator = new THREE.PMREMGenerator( renderer );
pmremGenerator.compileEquirectangularShader();
//ENV
}

function addLights()
{
var amblight = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( amblight );

var directionalLight = new THREE.DirectionalLight( 0xffffff, 1,100 );
directionalLight.position.set(3,3,1)
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 512;  // default
directionalLight.shadow.mapSize.height = 512; // default
directionalLight.shadow.camera = new THREE.OrthographicCamera( -20, 20, 20, -20, 0.001, 60);
scene.add( directionalLight );
}

function loadModel()
{
    var loader = new THREE.GLTFLoader();

    loader.load( 'model/townhouse01.gltf', function ( gltf ) {

        house = gltf.scene;
        scene.add( house );

        var GlassMaterial = new THREE.MeshPhysicalMaterial( {
            map: null,
            color: 0x1A1A1A,
            metalness: 0,
            roughness: 0,
            opacity: 0.25,
            side: THREE.FrontSide,
            transparent: true,
            envMapIntensity: 10,
            premultipliedAlpha: true
            } );

        house.traverse( function ( child ) 
        {
            if ( child.isMesh ) 
            {
                //child.material = newmaterial;
                if (child.material.name.toLowerCase() == "glass")
                {
                    child.material = GlassMaterial;
                    child.material.envMap = exrCubeRenderTarget.texture;
                }
                if (child.material.name.toLowerCase() == "chrome")
                {
                    child.material.envMap = exrCubeRenderTarget.texture;
                    child.material.envMapIntensity = 1;
                }
                child.castShadow = true;
                child.receiveShadow = true;
                child.material.envMap = exrCubeRenderTarget.texture;
                //child.material.roughness = 0;
            }
        });

        house.position.set(0,0,0);
    },
    // called while loading is progressing
    function ( xhr ) {
        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    }, undefined, function ( error ) {
        console.error( error );
    } );
}


function loadCove()
{
var loader = new THREE.GLTFLoader();

loader.load( 'model/Cove.gltf', function ( gltf ) {

    var cove = gltf.scene;
    scene.add( cove );

    cove.traverse( function ( child ) 
    {
        if ( child.isMesh ) 
        {
            //child.castShadow = true;
            child.receiveShadow = true;
            //child.material.roughness = 0;
        }
    });

    cove.position.set(0,0,0);
},
// called while loading is progressing
function ( xhr ) {
    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
}, undefined, function ( error ) {
    console.error( error );
} );
}

function addParticles()
{
particle = new THREE.Object3D();
scene.add(particle);
var geometry = new THREE.TetrahedronGeometry(.1, 0);
var material = new THREE.MeshPhongMaterial({
    color: 0x4DAEC2,
    shading: THREE.FlatShading
  });

for (var i = 0; i < 400; i++) {
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
    mesh.position.multiplyScalar(5 + (Math.random() * 50));
    mesh.rotation.set(Math.random() * 2, Math.random() * 2, Math.random() * 2);
    particle.add(mesh);
  }
}