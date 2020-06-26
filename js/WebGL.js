//const { AddOperation } = require("./three");

//VARS------------------------------
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 50 , window.innerWidth / window.innerHeight, 0.1, 3000 );
var sphere;
var house;
var cove;
var exrCubeRenderTarget;
var particle;
var orbitcontrols
var directionalLight;

var discMap;
var floorDisc;

var ShowModelledInfinityCove = true;
var ShowFloorDisc = true;
var ShowParticles = false;
//------------------------------

createButtons();

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
document.body.appendChild( renderer.domElement );

/*/SHADOWS------------------------------
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
renderer.setClearColor(0x000000, 0);
*///------------------------------


//CAMERA------------------------------
camera.position.z = -5;
camera.position.y = 8;
camera.position.x = 18;
//------------------------------


//var geometry = new THREE.SphereGeometry( 5, 32, 32 );
//var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
//sphere = new THREE.Mesh( geometry, material );
//scene.add( sphere );

setupOrbitControls();

createEnvironmentMapTexture();

addLights();
loadModel();
if (ShowModelledInfinityCove) {loadCove((0));}
if (ShowParticles) {addParticles();}
loadFloorDisc();

animate();



//FUNCTIONS------------------------------//FUNCTIONS------------------------------//FUNCTIONS------------------------------

function animate() 
{
    requestAnimationFrame( animate );
    orbitcontrols.update(); 

    animateOptionals();

    renderer.render( scene, camera );
}

var xSpeed = 0.5;
var ySpeed = 0.5;

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
    var keyCode = event.which;
    if (keyCode == 87) {//W
        directionalLight.position.y += ySpeed;
    } else if (keyCode == 83) {//S
        directionalLight.position.y -= ySpeed;
    } else if (keyCode == 65) {//A
        directionalLight.position.x -= xSpeed;
    } else if (keyCode == 68) {//D
        directionalLight.position.x += xSpeed;
    } else if (keyCode == 81) {//Q
        directionalLight.position.z -= xSpeed;
    } else if (keyCode == 69) {//E
        directionalLight.position.z += xSpeed;
    } else if (keyCode == 32) {//Space
        directionalLight.position.set(0, 0, 0);
    }

    //console.log(directionalLight.position);
    renderer.render( scene, camera );
};

function createButtons()
{
var Covebutton = document.createElement("button");
Covebutton.innerHTML = "Toggle Cove";
var body = document.getElementsByTagName("body")[0];
body.appendChild(Covebutton);

Covebutton.addEventListener ("click", function() {
    ShowModelledInfinityCove = !ShowModelledInfinityCove;
});

var FloorDiscbutton = document.createElement("button");
FloorDiscbutton.innerHTML = "Toggle FloorDisc";
var body = document.getElementsByTagName("body")[0];
body.appendChild(FloorDiscbutton);

FloorDiscbutton.addEventListener ("click", function() {
    ShowFloorDisc = !ShowFloorDisc;
});

var Covebutton1 = document.createElement("button");
Covebutton1.innerHTML = "Cove 1";
var body = document.getElementsByTagName("body")[0];
body.appendChild(Covebutton1);

Covebutton1.addEventListener ("click", function() {
    loadCove(0);
});

var Covebutton2 = document.createElement("button");
Covebutton2.innerHTML = "Cove 2";
var body = document.getElementsByTagName("body")[0];
body.appendChild(Covebutton2);

Covebutton2.addEventListener ("click", function() {
    loadCove(1);
});

var Covebutton3 = document.createElement("button");
Covebutton3.innerHTML = "Cove 3";
var body = document.getElementsByTagName("body")[0];
body.appendChild(Covebutton3);

Covebutton3.addEventListener ("click", function() {
    loadCove(2);
});

}

function setupOrbitControls()
{
    orbitcontrols = new THREE.OrbitControls( camera, renderer.domElement );
    orbitcontrols.enableDamping = true;
    orbitcontrols.dampingFactor = 0.1;
    orbitcontrols.enablePan = false;
    orbitcontrols.enableRotate = true;
    orbitcontrols.enableZoom = false
    var piAngle = (Math.PI/180);
    orbitcontrols.maxAzimuthAngle = piAngle*180;//Azimuth angle is measured from 0 to pi (for some reason)
    orbitcontrols.minAzimuthAngle = piAngle*0;
    orbitcontrols.maxPolarAngle = piAngle*100;

    orbitcontrols.target = new THREE.Vector3( 0, 5, 0 );
}

function animateOptionals()
{
    if (cove != undefined){cove.visible = ShowModelledInfinityCove;}

    if (floorDisc != undefined){floorDisc.visible = ShowFloorDisc;}

    //if (house != undefined){house.rotation.y += 0.01;}

    if (ShowParticles){particle.rotation.y -= 0.0040;}
}

function createEnvironmentMapTexture()
{
//ENV------------------------------
THREE.DefaultLoadingManager.onLoad = function ( ) 
{
    pmremGenerator.dispose();
};
new THREE.EXRLoader()
    .setDataType( THREE.FloatType )
    .load( 'tex/colourfull homes_15.00.exr', function ( texture ) //GSG_PRO_STUDIOS_METAL_043_sm.exr
    {
        
        exrCubeRenderTarget = pmremGenerator.fromEquirectangular( texture );
        exrBackground = exrCubeRenderTarget.texture;

        texture.dispose();
    });

var pmremGenerator = new THREE.PMREMGenerator( renderer );
pmremGenerator.compileEquirectangularShader();
////------------------------------
}

function addLights()
{
var amblight = new THREE.AmbientLight( 0x404040 ); // soft white light
//scene.add( amblight );

//Vector3 {x: 3.3000000000000003, y: 3.500000000000003, z: -2.900000000000001}
directionalLight = new THREE.DirectionalLight( 0xffffff, 1,100 );
directionalLight.position.set(3.3,3.5,-2.9)
//directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 512;  // default
directionalLight.shadow.mapSize.height = 512; // default
directionalLight.shadow.camera = new THREE.OrthographicCamera( -20, 20, 20, -20, 0.001, 60);
//scene.add( directionalLight );
}

function loadModel()
{
    var loader = new THREE.GLTFLoader();
    //var loadUrl = 'model/townhouse01.gltf';
    var loadUrl = 'model/Baked/townhouse01.gltf';

    loader.load(loadUrl , function ( gltf ) {

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
            if (child.name.toLowerCase() == "sun")
            {
                directionalLight.position.copy(child.position);
                child.visible = false;
                house.remove(child);
            }

            if ( child.isMesh ) 
            {
                console.log(child.name+" : "+child.material.name);
                switch (child.material.name.toLowerCase())
                {
                    case "floor":
                        child.material.metalness = 0;
                        child.material.roughness = .3;
                        child.material.envMap = exrCubeRenderTarget.texture;
                        child.material.envMapIntensity = .3;
                    break;
                    case "darkmetal":
                        child.material.metalness = 1;
                        child.material.roughness = .25;
                        child.material.envMap = exrCubeRenderTarget.texture;
                        child.material.envMapIntensity = 1;
                    break;
                    case "kitchencolour":
                        child.material.metalness = 1;
                        child.material.roughness = 0.35;
                        child.material.envMap = exrCubeRenderTarget.texture;
                        child.material.envMapIntensity = 1;
                    break;
                    case "chrome":
                        child.material.metalness = 1;
                        child.material.roughness = 0;
                        child.material.envMap = exrCubeRenderTarget.texture;
                        child.material.envMapIntensity = 1;
                    break;
                    case "roof":
                        child.material.metalness = 1;
                        child.material.roughness = .25;
                        child.material.envMap = exrCubeRenderTarget.texture;
                        child.material.envMapIntensity = 1;
                    break;
                    case "ceramic":
                        child.material.metalness = 1;
                        child.material.roughness = .1;
                        child.material.envMap = exrCubeRenderTarget.texture;
                        child.material.envMapIntensity = 1;
                    break;
                    default:

                    break;
                }

                //child.material = newmaterial;
                if (child.material.name.toLowerCase() == "glass" || child.name.toLowerCase()== "glass")
                {
                    child.material = GlassMaterial;
                    child.material.envMap = exrCubeRenderTarget.texture;
                }

                //child.castShadow = true;
                //child.receiveShadow = true;
                //child.material.envMap = exrCubeRenderTarget.texture;
                //child.material.roughness = 0;
            }
        });

        house.position.set(0,0,0);
    },
    // called while loading is progressing
    function ( xhr ) {
        console.log("TownHouse "+  ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    }, undefined, function ( error ) {
        console.error( error );
    } );
}


function loadCove(coveToLoad)
{
    if (cove != undefined)
    {
        cove.traverse( function ( child ) 
        {
            if ( child.isMesh ) 
            {
                cove.remove(child);// child.remove();
            }
        });
    }

    var coveAddress = 'model/Cove.gltf';
    switch(coveToLoad)
    {
        case 0:
            coveAddress= 'model/Cove.gltf';
        break;
        case 1:
            coveAddress= 'model/Cove2.gltf';
        break
        case 2:
            coveAddress= 'model/Cove3.gltf';
        break;
    }

    var loader = new THREE.GLTFLoader();

loader.load( coveAddress, function ( gltf ) {

    var coveMap = new THREE.TextureLoader().load( 'model/GreyGradient.jpg' );

    cove = gltf.scene;
    scene.add( cove );

    cove.traverse( function ( child ) 
    {
        if ( child.isMesh ) 
        {
            child.castShadow = false;
            child.receiveShadow = true;
            child.material.map = coveMap;
            child.material.emissiveMap = coveMap;
            child.material.emissive.setRGB(1,1,1); 
            console.log(child.material);
            //child.material.roughness = 0;
        }
    });

        cove.position.set(0,0,0);
    },
    // called while loading is progressing
    function ( xhr ) {
        console.log("Cove "+ ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    }, undefined, function ( error ) {
        console.error( error );
    } );
}


function loadFloorDisc()
{
    var discMap = new THREE.TextureLoader().load( 'model/CirclePlaneBW.png' );//'model/CirclePlaneBWInvert.png'//'model/CirclePlane.png'

       var discAddress = 'model/Baked/FloorDisc.gltf';
    var loader = new THREE.GLTFLoader();

loader.load( discAddress, function ( gltf ) {

    floorDisc = gltf.scene;
    scene.add( floorDisc );

    floorDisc.traverse( function ( child ) 
    {
        if ( child.isMesh ) 
        {
           // console.log(child.material);
            child.castShadow = false;
            child.material.transparent = true;
            //child.material.alphaTest = 0.5;

            //var discMap = new THREE.TextureLoader().load( 'model/CirclePlaneBW.png' );//'model/CirclePlaneBWInvert.png'//'model/CirclePlane.png'

            child.material.alphaMap = discMap;
            
            //child.material.map.format = 1023;  // was reporting as 1022 (no alpha)
			//child.material.needsUpdate=true;
            //child.material.alphaMap = child.material.colorMap;//'model/CirclePlaneBW.png'
            //child.material.colorMap = null;
            child.material.needsUpdate =  true;
            //child.material.roughness = 0;
            //console.log(child.material);
        }
    });

    floorDisc.position.set(0,.001,0);
    //disc.scale.set(5,5,5);
    },
    // called while loading is progressing
    function ( xhr ) {
        console.log("floorDisc "+ ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    }, undefined, function ( error ) {
        console.error( error );
    } );
}





function loadCoveOld()
{
var loader = new THREE.GLTFLoader();

loader.load( 'model/Cove3.gltf', function ( gltf ) {

    cove = gltf.scene;
    scene.add( cove );

    cove.traverse( function ( child ) 
    {
        if ( child.isMesh ) 
        {
            child.castShadow = false;
            child.receiveShadow = true;
            //child.material.roughness = 0;
        }
    });

    cove.position.set(0,0,0);
},
// called while loading is progressing
function ( xhr ) {
    console.log("Cove "+ ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
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

//---------------------------------------//--------------------------------------//-------------------------------------