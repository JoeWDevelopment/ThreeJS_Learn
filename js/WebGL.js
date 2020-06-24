var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 3000 );
var cube;
var house;
var exrCubeRenderTarget;

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
camera.position.y = 8;

controls.target = new THREE.Vector3( 0, 6, 0 );
//controls.update();

var amblight = new THREE.AmbientLight( 0x404040 ); // soft white light
scene.add( amblight );

var directionalLight = new THREE.DirectionalLight( 0xffffff, 1,100 );
directionalLight.position.set(3,3,1)
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 512;  // default
directionalLight.shadow.mapSize.height = 512; // default
directionalLight.shadow.camera = new THREE.OrthographicCamera( -20, 20, 20, -20, 0.001, 60);
scene.add( directionalLight );


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

        var GlassMaterial = new THREE.MeshPhysicalMaterial( {
            map: null,
            color: 0x0000ff,
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
                child.castShadow = true;
                child.receiveShadow = true;
            //    //child.material.envMap = exrCubeRenderTarget.texture;
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

function addLight()
{
    var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    scene.add( directionalLight );
}