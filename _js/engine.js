var container, stats;
var camera, controls, orbitControls, controlsVR, scene, renderer;
var logo, light, dustParticles, textureCube, textureCubeDark, oldroot, outsideSurroundings, outsideFakeCells;
var renderComposer
var objects = [], plane;
var width = window.innerWidth;
var height = window.innerHeight;
var camDist = 0, camDistPerc = 0, camDistPercFar = 0;

var backgroundAudio, backgroundAudio2, clickAudio, swooshAudio

var orbitControlsTarget = new THREE.Vector3(0, 0, 0)

var sceneFogColor = {r: 0, g: 0, b: 0};
var renderTarget, depthTarget, depthMaterial;
var composer, blendComposer, glowComposer, effect, badTVPass, rgbPass, lensPass, bokehPass;
var enabledVR = false;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(),
        offset = new THREE.Vector3(),
        intersected, selected;

var count = 2.2, countTarget = 2.2, controlling = false;
var pyramids = [], interactiveObjects = [], followersDB = [], followingDB = [];

var newFrame = true;

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    var bgColor = 0xffffff;

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 100, 55000);
    scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0x505050));
    //if (fullMode)
    scene.fog = new THREE.Fog(bgColor, 1500, 20000);

    light = new THREE.DirectionalLight(0xFFFFFF, 1)
    light.position.set(0, .25, 1);

    scene.add(light);

    textureCube = new THREE.CubeTexture([]);
    textureCube.format = THREE.RGBFormat;
    textureCube.flipY = false;

    var loader = new THREE.ImageLoader();
    loader.load('_textures/skyboxsun25degtest_org.png', function (image) {

        var getSide = function (x, y) {

            var size = 1024;

            var canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;

            var context = canvas.getContext('2d');
            context.drawImage(image, -x * size, -y * size);

            return canvas;

        };

        textureCube.images[ 0 ] = getSide(2, 1); // px
        textureCube.images[ 1 ] = getSide(0, 1); // nx
        textureCube.images[ 2 ] = getSide(1, 0); // py
        textureCube.images[ 3 ] = getSide(1, 2); // ny
        textureCube.images[ 4 ] = getSide(1, 1); // pz
        textureCube.images[ 5 ] = getSide(3, 1); // nz
        textureCube.needsUpdate = true;

    });

    textureCubeDark = new THREE.CubeTexture([]);
    textureCubeDark.format = THREE.RGBFormat;
    textureCubeDark.flipY = false;

    var loader = new THREE.ImageLoader();
    loader.load('_textures/inside.jpg', function (image) {

        var getSide = function (x, y) {

            var size = 1024;

            var canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;

            var context = canvas.getContext('2d');
            context.drawImage(image, -x * size, -y * size);

            return canvas;

        };

        textureCubeDark.images[ 0 ] = getSide(2, 1); // px
        textureCubeDark.images[ 1 ] = getSide(0, 1); // nx
        textureCubeDark.images[ 2 ] = getSide(1, 0); // py
        textureCubeDark.images[ 3 ] = getSide(1, 2); // ny
        textureCubeDark.images[ 4 ] = getSide(1, 1); // pz
        textureCubeDark.images[ 5 ] = getSide(3, 1); // nz
        textureCubeDark.needsUpdate = true;

    });


    plane = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(2000, 2000, 8, 8),
            new THREE.MeshBasicMaterial({color: 0x000000, opacity: 0.25, transparent: true})
            );
    plane.visible = false;
    scene.add(plane);

    renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer: true});
    renderer.setClearColor(bgColor)//0xdcdcd0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.sortObjects = false;

    if (fullMode) {
        var blurriness = 2;
        var screenW = 2048//window.innerWidth;
        var screenH = 1024//window.innerHeight;
        //renderer = new THREE.WebGLRenderer({clearColor: 0x000000, clearAlpha: 0, antialias: false});
        var renderTargetParameters = {minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBufer: false};

        // depth

        renderTarget = new THREE.WebGLRenderTarget(screenW, screenH, renderTargetParameters);
        renderComposer = new THREE.EffectComposer(renderer, renderTarget);
        renderPass = new THREE.RenderPass(scene, camera);
        //copyPass = new THREE.ShaderPass(THREE.CopyShader);
        //bloomPass = new THREE.BloomPass(3, 12, 3.0, 64);

        var width = 1280//window.innerWidth;
        var height = 720//window.innerHeight;

        scene.matrixAutoUpdate = false;

        badTVPass = new THREE.ShaderPass(THREE.BadTVShader);
        badTVPass.uniforms[ "rollSpeed" ].value = 0;
        badTVPass.uniforms[ "distortion" ].value = 0.01;
        badTVPass.uniforms[ "distortion2" ].value = 0;

        rgbPass = new THREE.ShaderPass(THREE.RGBShiftShader);
        rgbPass.uniforms[ "amount" ].value = 0;

        renderComposer.addPass(renderPass);
        renderComposer.addPass(badTVPass)
        renderComposer.addPass(rgbPass)

        if (highQuality)
            bokehPass.renderToScreen = true;
        if (!highQuality)
            rgbPass.renderToScreen = true;
    }
    container.appendChild(renderer.domElement);

    controls = new THREE.DeviceOrientationControls(camera, true);

    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControls.rotateSpeed = 1.0;
    orbitControls.zoomSpeed = 1;
    orbitControls.panSpeed = 0.8;
    orbitControls.noZoom = false;
    orbitControls.noPan = true;
    orbitControls.autoRotate = true;
    orbitControls.autoRotateSpeed = Math.sin(Math.random() * Math.PI * 2) * .5;
    orbitControls.staticMoving = true;
    orbitControls.dynamicDampingFactor = 0.3;
    orbitControls.minDistance = 500.0;
    orbitControls.maxDistance = 450000.0;

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    //container.appendChild(stats.domElement);

    while (camera.position.distanceTo(scene.position) < 700) {
        camera.position.z = 1000 * (Math.random());
        camera.position.y = 100 + 200 * (Math.random());
        camera.position.x = 800 * (Math.random() - .5);
    }
    TweenMax.from(camera.position, 10, {delay: delay + 0.1, x: 5000 * (Math.random() - .5), y: 3000 * (Math.random() - .5), z: 9000 * (Math.random() - .5), ease: Power1.easeInOut, onComplete: cameraAnimationDone});

    renderer.domElement.addEventListener('mousemove', onDocumentMouseMove, false);
    renderer.domElement.addEventListener('mousedown', onDocumentMouseDown, false);
    renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);

    window.addEventListener('resize', onWindowResize, false);
    if (enableGyro)
        window.addEventListener('deviceorientation', initControls, false);

    $('.fullscreen').click(function () {
        goFullscreen();
    })
    $('.about').click(function () {
        $('.info').fadeIn("slow")
        $('.ui').fadeOut("slow")
    })
    $('.info').click(function () {
        $('.info').fadeOut("slow")
        $('.ui').fadeIn("slow")
        if (fullMode)
            setTimeout($('#input').focus(), 1500);
    })
    $('.intro').delay(3000).fadeIn("slow")
    $('.intro').delay(9000).fadeOut("slow")

    effect = new THREE.VREffect(renderer);

    controlsVR = new THREE.VRControls(camera);
    controlsVR.standing = true;
    controlsVR.scale = 1//250

    if (WEBVR.isAvailable() === true) {

        var button = document.createElement('button');
        button.style.position = 'absolute';
        button.style.left = 'calc(50% - 50px)';
        button.style.bottom = '20px';
        button.style.width = '100px';
        button.style.border = '0';
        button.style.margin = '5px';
        button.style.padding = '10px';
        button.style.cursor = 'pointer';
        button.style.backgroundColor = '#000';
        button.style.color = '#fff';
        button.style.fontSize = '12px';
        button.style.textAlign = 'center';
        button.style.fontFamily = "'Andale Mono', AndaleMono, monospace"
        button.id = 'vr'

        button.style.zIndex = '999';
        button.textContent = 'enter vr';
        button.onclick = function () {

            orbitControls.enabled = false
            effect.requestPresent();

            enabledVR = true;
            effect.requestAnimationFrame(effectUpdate);

            button.style.display = 'none';

        };
        document.getElementsByClassName("ui")[0].appendChild(button);

    }
}

function initAudio() {
    backgroundAudio = document.getElementById("bgAudio");
    backgroundAudio.pause();
    //backgroundAudio.currentTime = 0;
    backgroundAudio.volume = 0;
    backgroundAudio2 = document.getElementById("bgAudio2");
    backgroundAudio2.pause();
    //backgroundAudio2.currentTime = 0;
    backgroundAudio2.volume = 0;
    clickAudio = document.getElementById("clickAudio");
    clickAudio.pause();
    //clickAudio.currentTime = 0;
    clickAudio.volume = 0;
    swooshAudio = document.getElementById("swooshAudio");
    swooshAudio.pause();
    //swooshAudio.currentTime = 0;
    swooshAudio.volume = 0
}

function myKeyPress(e) {

    var keynum;

    if (window.event) { // IE					
        keynum = e.keyCode;
    } else
    if (e.which) { // Netscape/Firefox/Opera					
        keynum = e.which;
    }
    var k = String.fromCharCode(keynum);
    if (k == "/") {
        goFullscreen();
    }
}

function goFullscreen() {
    var elem = document.body;
    if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
        if (elem.requestFullScreen) {
            elem.requestFullScreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullScreen) {
            elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
    TweenMax.delayedCall(.1, onWindowResize);
}

function initControls(event) {
    if (event.alpha) {
        //TweenMax.killTweensOf(camera.position)
        window.removeEventListener('deviceorientation', initControls, false);

        orbitControls.enabled = false;

        controls.connect();
    }
}

function cameraAnimationDone() {
    controlling = true;
    transferring = false;
}

function animate() {

    requestAnimationFrame(animate);

    tween();
    render();
    stats.update();

}

function tween() {
    if (titles)
        titles.lookAt(camera.position)
    if (!logo)
        return;
    count += .001;

    if (outsideSurroundings) {
        if (outsideSurroundings.position.x <= -globalBuildingLoopCount * globalDistance / 2)
            outsideSurroundings.position.x += globalBuildingLoopCount * globalDistance;
        if (outsideSurroundings.position.y <= -globalBuildingLoopCount * globalDistance / 2)
            outsideSurroundings.position.y += globalBuildingLoopCount * globalDistance;
        if (outsideSurroundings.position.z <= -globalBuildingLoopCount * globalDistance / 2)
            outsideSurroundings.position.z += globalBuildingLoopCount * globalDistance;
        if (outsideSurroundings.position.x >= globalBuildingLoopCount * globalDistance / 2)
            outsideSurroundings.position.x -= globalBuildingLoopCount * globalDistance;
        if (outsideSurroundings.position.y >= globalBuildingLoopCount * globalDistance / 2)
            outsideSurroundings.position.y -= globalBuildingLoopCount * globalDistance;
        if (outsideSurroundings.position.z >= globalBuildingLoopCount * globalDistance / 2)
            outsideSurroundings.position.z -= globalBuildingLoopCount * globalDistance;
    }
    camDistPerc = (camDist - 20000) / (50000 - 20000);
    if (camDistPerc > 1)
        camDistPerc = 1;
    if (camDistPerc < 0)
        camDistPerc = 0;
    camDistPercFar = (camDist - 10000) / (200000 - 10000);
    if (camDistPercFar > 1)
        camDistPercFar = 1;
    if (camDistPercFar < 0)
        camDistPercFar = 0;
    if (soundEnabled && backgroundAudio) {
        backgroundAudio.volume = 1 - camDistPercFar
        backgroundAudio2.volume = camDistPercFar;
    }

    for (var i = 0; i < objects.length; i++) {
        var o = objects[i]
        if (o == intersected)
            continue;
        if (i % 3 == 0)
            o.position.x += Math.sin(i + count) / 2
        if (i % 3 == 1)
            o.position.y += Math.cos(i + count) / 2
        if (i % 3 == 2)
            o.position.z += Math.cos(3 * i + count) / 2
    }
    if (!intersected) {
        countTarget += .001;
        orbitControlsTarget.x -= (orbitControlsTarget.x - (Math.sin(1 + countTarget) * (100 + 30000 * camDistPercFar))) / 1;
        orbitControlsTarget.y -= (orbitControlsTarget.y - (Math.cos(1 + countTarget) * (100 + 30000 * camDistPercFar))) / 1;
        orbitControlsTarget.z -= (orbitControlsTarget.z - (Math.cos(3 * 1 + countTarget) * (100 + 30000 * camDistPercFar))) / 1;
    }

    //uiLookAt.lookAt(camera.position)

    TweenMax.to(uiLookAt.position, 1, {x: camera.position.x, y: camera.position.y, z: camera.position.z})

    ui.lookAt(uiLookAt.position)

    //orbitControlsTarget.set(100,0,0)
    //console.log(camDistPercFar)

    for (var i = 0; i < pyramids.length; i++) {
        var o = pyramids[i]
        o.rotation.x += Math.sin(i + count) * .01
        o.rotation.y += Math.cos(i + count) * .01
    }
    logo.rotation.x += .005;
    logo.rotation.y += .005;
    if (dustParticles) {
        dustParticles.rotation.x += .0001;
        dustParticles.rotation.y += .0001;
    }
}

function effectUpdate() {

    camDist = 25000

    skyBox.visible = cloudsObject.visible = groundObject.visible = (camDist > 50000)
    root.visible = fakeScene.visible = !skyBox.visible;
    //if (fullMode) {
    scene.fog.near = (camDist * 1.5 + 9000) / 3
    scene.fog.far = (camDist * 1.5 + 9000)
    //}
    camera.near = 10
    camera.far = (camDistPerc * 10000000 + 55000)


    controlsVR.update()
    camera.position.z += 350;
    //effect.requestAnimationFrame( render );
    effect.render(scene, camera);
    camera.position.z -= 350;

    effect.requestAnimationFrame(effectUpdate);
}

function render() {

    newFrame = true;

    if (enabledVR)
        return

    if (controlling) {
        camera.updateProjectionMatrix();
        if (!orbitControls.enabled) {
            controls.update();
        } else {
            orbitControls.update();
            //camera.lookAt(orbitControlsTarget)
        }
    } else {
        camera.lookAt(orbitControls.target);
        //camera.lookAt(orbitControlsTarget)
    }
    camDist = orbitControls.radius;

    skyBox.visible = cloudsObject.visible = groundObject.visible = (camDist > 50000)
    root.visible = fakeScene.visible = !skyBox.visible;
    //if (fullMode) {
    scene.fog.near = (camDist * 1.5 + 9000) / 3
    scene.fog.far = (camDist * 1.5 + 9000)
    //}
    camera.near = (camDistPerc * 10000 + 100)
    camera.far = (camDistPerc * 10000000 + 55000)

    //var color=[0x45/0xff,0x84/0xff,0xb4/0xff]
    var color = [1, 1, 1]

    //if (fullMode) {
    scene.fog.color.r = sceneFogColor.r + (color[0] - sceneFogColor.r) * camDistPerc;
    scene.fog.color.g = sceneFogColor.g + (color[1] - sceneFogColor.g) * camDistPerc;
    scene.fog.color.b = sceneFogColor.b + (color[2] - sceneFogColor.b) * camDistPerc;
    renderer.setClearColor(scene.fog.color);
    //}

    light.position.x = camera.position.x;
    light.position.y = camera.position.y;
    light.position.z = camera.position.z;
    if (intersected) {
        orbitControls.autoRotateSpeed -= (orbitControls.autoRotateSpeed - 0) / 5;
    } else {
        //controls.autoRotateSpeed = Math.sin(count * 2) * .5;
        var perc = 1 - .6 * camDist / orbitControls.maxDistance
        orbitControls.autoRotateSpeed -= (orbitControls.autoRotateSpeed - (perc * Math.sin(count * 2) * .5)) / 5;
    }
    if (fullMode) {
        if ((rgbPass.uniforms[ "amount" ].value != 0 || badTVPass.uniforms[ "distortion" ].value > 0.01)) {
            // && (rgbPass.uniforms[ "amount" ].value != 0 || badTVPass.uniforms[ "distortion" ].value != 0)
            badTVPass.uniforms[ 'time' ].value = shaderTime;
            //lensPass.uniforms[ 'intensity' ].value = .1 - .15 * camDistPerc;
            //console.log(camDistPerc)
            /*.if(camDist>120000){
             rgbPass.uniforms[ "amount" ].value=.004*(camDist-120000)/(450000-120000)
             }*/

            //rgbPass.uniforms[ "angle" ].value = Math.sin(shaderTime/100)*Math.PI;
            //rgbPass.uniforms[ "amount" ].value -= (rgbPass.uniforms[ "amount" ].value-.002)/255
            //renderer.clear();
            renderComposer.render()

            //glowComposer.render()
            //blendComposer.render();

        } else {
            renderer.render(scene, camera);
        }
        shaderTime += .1;
    } else {
        renderer.render(scene, camera);
    }

}