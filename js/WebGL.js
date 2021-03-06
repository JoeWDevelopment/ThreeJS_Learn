//const { AddOperation } = require("./three");

var projVersion = "0.5.1";
console.log("%c Project Version: "+projVersion, "background: #222; color: #bada55");

//VARS------------------------------
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 50 , window.innerWidth / window.innerHeight, 0.1, 3000 );
var sphere;
var house;
var furn1;
var furn2;
var furn3;
var cove;
var exrCubeRenderTarget;
var particle;
var orbitcontrols
var directionalLight;

var discMap;
var floorDisc;

var ShowModelledInfinityCove = false;
var ShowFloorDisc = false;
var ShowParticles = false;

var ObjsToLoad = 4;
var ObjsLoaded = 0;

var load1Percent = 0, load2Percent = 0, load3Percent = 0,load4Percent = 0;
var loadPercent =0;
var lastLoadPercent = -1;
var loadCompleted = false;
//------------------------------

//createButtons();

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
camera.position.z = -6;
camera.position.y = 9;
camera.position.x = 20;
//------------------------------


//var geometry = new THREE.SphereGeometry( 5, 32, 32 );
//var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
//sphere = new THREE.Mesh( geometry, material );
//scene.add( sphere );

setupOrbitControls();

createEnvironmentMapTexture();

addLights();
//loadModel();
loadFurniture();
if (ShowModelledInfinityCove) {loadCove((1));}
if (ShowParticles) {addParticles();}
loadFloorDisc();

animate();


//FUNCTIONS------------------------------//FUNCTIONS------------------------------//FUNCTIONS------------------------------

function animate() 
{
if (ObjsLoaded >= ObjsToLoad && loadCompleted == false)
{
    //console.log("Loading Complete");
    loadCompleted = true;
      // hide the loading bar
    //const loadingElem = document.querySelector('#loading');
    //loadingElem.style.display = 'none';
    //document.body.appendChild( renderer.domElement );
}
if (!loadCompleted)
{
    loadPercent = (load1Percent+load2Percent+load3Percent+load4Percent) / 4;
    if (loadPercent > lastLoadPercent)
    {
    lastLoadPercent = loadPercent;
    //console.log("Loading... "+loadPercent+"%");  
    //const loadingElem = document.querySelector('#loading').innerHTML = "...loading..."+loadPercent+"%";
    }
}
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
    if (cove != undefined){if (cove.visible != ShowModelledInfinityCove){cove.visible = ShowModelledInfinityCove;}}

    if (floorDisc != undefined){if (floorDisc.visible != ShowFloorDisc){ floorDisc.visible = ShowFloorDisc;}}

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
    .load( 'tex/GSG_PRO_STUDIOS_METAL_002_sm.exr', function ( texture ) //GSG_PRO_STUDIOS_METAL_043_sm.exr//GSG_PRO_STUDIOS_METAL_002_sm.exr//tex/colourfull homes_15.00.exr
    {
        
        exrCubeRenderTarget = pmremGenerator.fromEquirectangular( texture );
        exrBackground = exrCubeRenderTarget.texture;

        texture.dispose();
        loadModel();
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
    //var loadUrl = 'model/Baked/townhouse01.gltf';
    var loadUrl = 'model/House.glb';

    var dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath( 'js/three/examples/libs/draco/' );
    loader.setDRACOLoader( dracoLoader )

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
                //console.log(child.name+" : "+child.material.name);
                switch (child.material.name.toLowerCase())
                {
                    case "floor":
                        child.material.metalness = 0;
                        child.material.roughness = .2;
                        child.material.envMap = exrCubeRenderTarget.texture;
                        child.material.envMapIntensity = .4;
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
        ObjsLoaded+=1;
    },
    // called while loading is progressing
    function ( xhr ) {
        //console.log("TownHouse "+  ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        load1Percent = xhr.loaded / xhr.total * 100;
    }, undefined, function ( error ) {
        console.error( error );
    } );
}


function loadFurniture()
{
    var loader = new THREE.GLTFLoader();
    //var loadUrl = 'model/townhouse01.gltf';
    //var loadUrl = 'model/Baked/townhouse01.gltf';
    var loadUrl = 'model/FurnGround.glb';

    var dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath( 'js/three/examples/libs/draco/' );
    loader.setDRACOLoader( dracoLoader )
    
    loader.load(loadUrl , function ( gltf ) {

        furn1 = gltf.scene;
        scene.add( furn1 );

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


            furn1.traverse( function ( child ) 
        {
            if ( child.isMesh ) 
            {
                //console.log(child.name+" : "+child.material.name);
                switch (child.material.name.toLowerCase())
                {
                    case "floor":
                        child.material.metalness = 0;
                        child.material.roughness = .2;
                        child.material.envMap = exrCubeRenderTarget.texture;
                        child.material.envMapIntensity = .4;
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

                if (child.material.name.toLowerCase() == "glass" || child.name.toLowerCase()== "glass")
                {
                    child.material = GlassMaterial;
                    child.material.envMap = exrCubeRenderTarget.texture;
                }

            }
        });

        furn1.position.set(0,0,0);
        ObjsLoaded+=1;
    },
    // called while loading is progressing
    function ( xhr ) {
        //console.log("Furniture "+  ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        load4Percent = xhr.loaded / xhr.total * 100;
    }, undefined, function ( error ) {
        console.error( error );
    } );

    
    
    
    
    
    
    
    
    
    
    
    var loader2 = new THREE.GLTFLoader();
    //var loadUrl = 'model/townhouse01.gltf';
    //var loadUrl = 'model/Baked/townhouse01.gltf';
    var loadUrl2 = 'model/FurnMid.glb';

    var dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath( 'js/three/examples/libs/draco/' );
    loader2.setDRACOLoader( dracoLoader )

    
    loader2.load(loadUrl2 , function ( gltf ) {

        furn2 = gltf.scene;
        scene.add( furn2 );

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


            furn2.traverse( function ( child ) 
        {
            if ( child.isMesh ) 
            {
                //console.log(child.name+" : "+child.material.name);
                switch (child.material.name.toLowerCase())
                {
                    case "floor":
                        child.material.metalness = 0;
                        child.material.roughness = .2;
                        child.material.envMap = exrCubeRenderTarget.texture;
                        child.material.envMapIntensity = .4;
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

                if (child.material.name.toLowerCase() == "glass" || child.name.toLowerCase()== "glass")
                {
                    child.material = GlassMaterial;
                    child.material.envMap = exrCubeRenderTarget.texture;
                }

            }
        });

        furn2.position.set(0,0,0);
        ObjsLoaded+=1;
    },
    // called while loading is progressing
    function ( xhr ) {
        //console.log("Furniture "+  ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        load4Percent = xhr.loaded / xhr.total * 100;
    }, undefined, function ( error ) {
        console.error( error );
    } );









    var loader3 = new THREE.GLTFLoader();
    //var loadUrl = 'model/townhouse01.gltf';
    //var loadUrl = 'model/Baked/townhouse01.gltf';
    var loadUrl3 = 'model/FurnUpper.glb';

    var dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath( 'js/three/examples/libs/draco/' );
    loader3.setDRACOLoader( dracoLoader )

    loader3.load(loadUrl3 , function ( gltf ) {

        furn3 = gltf.scene;
        scene.add( furn3 );

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


            furn3.traverse( function ( child ) 
        {
            if ( child.isMesh ) 
            {
                //console.log(child.name+" : "+child.material.name);
                switch (child.material.name.toLowerCase())
                {
                    case "floor":
                        child.material.metalness = 0;
                        child.material.roughness = .2;
                        child.material.envMap = exrCubeRenderTarget.texture;
                        child.material.envMapIntensity = .4;
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

                if (child.material.name.toLowerCase() == "glass" || child.name.toLowerCase()== "glass")
                {
                    child.material = GlassMaterial;
                    child.material.envMap = exrCubeRenderTarget.texture;
                }

            }
        });

        furn3.position.set(0,0,0);
        ObjsLoaded+=1;
    },
    // called while loading is progressing
    function ( xhr ) {
        //console.log("Furniture "+  ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        load4Percent = xhr.loaded / xhr.total * 100;
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

    var dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath( 'js/three/examples/libs/draco/' );
    loader.setDRACOLoader( dracoLoader )

loader.load( coveAddress, function ( gltf ) {

    var coveMap = new THREE.TextureLoader().load( 'model/tex/GreyGradient.jpg' );

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
            //console.log(child.material);
            //child.material.roughness = 0;
        }
    });

        cove.position.set(0,-.3,0);
        ObjsLoaded+=1;
    },
    // called while loading is progressing
    function ( xhr ) {
        //console.log(xhr);
        //console.log("Cove "+ ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        load2Percent = xhr.loaded / xhr.total * 100;
    }, undefined, function ( error ) {
        console.error( error );
    } );
}


function loadFloorDisc()
{
    var discMap = new THREE.TextureLoader().load( 'model/tex/CirclePlaneBW.png' );//'model/CirclePlaneBWInvert.png'//'model/CirclePlane.png'

       var discAddress = 'model/FloorDisc.gltf';
    var loader = new THREE.GLTFLoader();
    var dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath( 'js/three/examples/libs/draco/' );
    loader.setDRACOLoader( dracoLoader )

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
    ObjsLoaded+=1;
    //disc.scale.set(5,5,5);
    },
    // called while loading is progressing
    function ( xhr ) {
        //console.log("floorDisc "+ ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        load3Percent = xhr.loaded / xhr.total * 100;
    }, undefined, function ( error ) {
        console.error( error );
    } );
}





function loadCoveOld()
{
var loader = new THREE.GLTFLoader();
var dracoLoader = new THREE.DRACOLoader();
    dracoLoader.setDecoderPath( 'js/three/examples/libs/draco/' );
    loader.setDRACOLoader( dracoLoader )

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
    ObjsLoaded+=1;
},
// called while loading is progressing
function ( xhr ) {
    //console.log("Cove "+ ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    load3Percent = xhr.loaded / xhr.total * 100;
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