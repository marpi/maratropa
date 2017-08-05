var globalSize;
var cloudsObject;
var groundObject;
var WIDTH = 32;
var sky, sunSphere;
var fakeScene;
var ui;
var uiLookAt = new THREE.Object3D();

var shaderTime = 0;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var BIRDS = WIDTH * WIDTH;
var PARTICLES = WIDTH * WIDTH;
var BOUNDS = 1600, BOUNDS_HALF = BOUNDS / 2;
var last = performance.now();
var simulator;
var skyBox;
var birdMesh
var titles

var Meth = {random: Math.random};
function staticObjects() {
    //Meth = {random:new Math.seedrandom('maratropa')};
    //if (fullMode)
        surroundings(scene);
    //initSky();
    fakeCells(scene)
    //birds(scene)
    clouds(scene);
    skies(scene);
    ground(scene)
    //intro(scene)
}

function build(root, anim) {
    if (!oldroot && outsideSurroundings)
        TweenMax.from(outsideSurroundings.scale, 1.5, {delay: delay + 5, x: 0.000001, y: 0.000001, z: 0.000001, ease: Power1.easeOut, onComplete: animationDone});
    if (!oldroot)
        TweenMax.from(fakeScene.scale, 1.5, {delay: delay + 5, x: 0.000001, y: 0.000001, z: 0.000001, ease: Power1.easeOut});

    Meth = {random: new Math.seedrandom(db.id)};

    interactiveObjects = []
    interactiveObjects.push(fakeScene)
    objects = []
    pyramids = []

    globalSize = db.followers_count / 2000000;
    globalSize = Math.min(globalSize, .65) //1 optimized

    bug(root, anim)
    front(root, anim);
    //banner(root, anim);
    //bg(root, anim);
    cubes(root, anim);
    glass(root, anim);
    //carbon(root, anim);
    shards(root, anim);

    vectorParticles(root, anim);
    //fakeCells(root, anim)
    console.log('done')
}

function intro(scene) {
    var strings = 'Maratropa is a personal journey|exploring real connections between people'.split('|')
    titles = new THREE.Group()
    for (var i = 0; i < strings.length; i++) {
        var string = strings[i];
        var geometry = new Text(string.toUpperCase());
        var material = new THREE.LineBasicMaterial({linecap: "square", linejoin: "miter", linewidth: 2, color: 0xffffff, opacity: 1, transparent: true});
        var title = new THREE.Line(geometry, material, THREE.LinePieces);
        title.position.x = -100
        title.position.y = -i * 15;
        title.position.z = 0
        titles.add(title)
    }
    titles.scale.set(0.0001, 0.0001, 0.0001);
    TweenMax.to(titles.scale, 3, {delay: 2, x: 10, y: 10, z: 10});
    TweenMax.to(titles.scale, 1, {delay: delay + 4, x: 200, y: 200, z: 200, onComplete: removeIntro, onCompleteParams: titles});
    scene.add(titles);
}
function removeIntro(root) {
    if (root)
        scene.remove(root)
    root = null;
}

function animationDone() {
    TweenMax.killDelayedCallsTo(screenshot);
    TweenMax.delayedCall(1, screenshot);
    $(".ui").fadeTo("slow", 1)
}

function animateObjects() {

}

function skies(root) {
    var cubeShader = THREE.ShaderLib['cube'];
    cubeShader.uniforms['tCube'].value = textureCube;

    var skyBoxMaterial = new THREE.ShaderMaterial({
        fragmentShader: cubeShader.fragmentShader,
        vertexShader: cubeShader.vertexShader,
        uniforms: cubeShader.uniforms,
        depthWrite: false,
        side: THREE.BackSide
    });

    skyBox = new THREE.Mesh(
            new THREE.BoxGeometry(10000000, 10000000, 10000000),
            skyBoxMaterial
            );

    root.add(skyBox);
}

/*function clouds(root, anim) {
 geometry = new THREE.Geometry();
 var texture = THREE.ImageUtils.loadTexture('_textures/cloud.png', null, animate);
 texture.magFilter = THREE.LinearMipMapLinearFilter;
 texture.minFilter = THREE.LinearMipMapLinearFilter;
 
 var fog = new THREE.Fog(0x4584b4, -100, 3000);
 
 material = new THREE.ShaderMaterial({
 uniforms: {
 "map": {type: "t", value: texture},
 "fogColor": {type: "c", value: fog.color},
 "fogNear": {type: "f", value: fog.near},
 "fogFar": {type: "f", value: fog.far},
 },
 vertexShader: document.getElementById('vs').textContent,
 fragmentShader: document.getElementById('fs').textContent,
 depthWrite: false,
 depthTest: false,
 transparent: true
 
 });
 
 var plane = new THREE.Mesh(new THREE.PlaneGeometry(64, 64));
 
 for (var i = 0; i < 8000; i++) {
 
 plane.position.x = Math.random() * 1000 - 500;
 plane.position.y = Math.random() * 1000 - 500;
 plane.position.z = i;
 plane.rotation.z = Math.random() * Math.PI;
 plane.scale.x = plane.scale.y = Math.random() * Math.random() * 1.5 + 0.5;
 
 THREE.GeometryUtils.merge(geometry, plane);
 
 }
 
 mesh = new THREE.Mesh(geometry, material);
 cloudsObject = mesh;
 root.add(mesh);
 }*/


function bug(root, anim) {
    var wireframe = false;
    var size = .2 + globalSize;

    var geom = new THREE.IcosahedronGeometry(100, Math.floor(Meth.random() * 3))
    for (var i = 0; i < geom.vertices.length; i++)
    {
        var v = geom.vertices[i]
        v.x *= 1 + (Meth.random() - .5) * 1
        v.y *= 1 + (Meth.random() - .5) * 1
        v.z *= 1 + (Meth.random() - .5) * 1
        //console.log(v)
    }
    for (var i = 0; i < geom.faces.length; i++)
    {
        var f = geom.faces[i]
        var rand = Math.floor((Math.sin(i) / 2 + .5) * 5)
        f.color.setRGB(db.colors[rand][0] / 255, db.colors[rand][1] / 255, db.colors[rand][2] / 255)
        //f.color.setRGB( Meth.random(),Meth.random(), Meth.random())
    }

    var mat = new THREE.MeshPhongMaterial({
        //side: THREE.DoubleSide,
        //shininess: .1,
        //color: rgbToHex(db.colors[1][0], db.colors[1][1], db.colors[1][2]), 
        vertexColors: THREE.FaceColors,
        shading: THREE.FlatShading,
        reflectivity: .3,
        envMap: textureCubeDark,
        wireframe: wireframe,
        wireframeLinewidth: 15
    })
    var sphere = new THREE.Mesh(geom, mat);
    sphere.scale.x = sphere.scale.y = sphere.scale.z = (.01 + (.2 + Meth.random()) * size * 1.5) * 3
    //sphere.position.y = 40;
    var sphereDelay = delay;
    if (oldroot)
        sphereDelay = 0;
    TweenMax.from(sphere.scale, 1.5, {delay: sphereDelay, x: 0.0001, y: 0.0001, z: 0.0001, ease: Power1.easeOut});
    root.add(sphere);

    var bugMaterials = []
    for (var i = 0; i < 5; i++) {
        var greymat = new THREE.MeshPhongMaterial({
            color: rgbToHex(db.colors[i][0], db.colors[i][1], db.colors[i][2]),
            //vertexColors: THREE.FaceColors,
            shading: THREE.FlatShading,
            reflectivity: .3,
            envMap: textureCubeDark,
            //wireframe: wireframe,
            //wireframeLinewidth: 15,
            //side: THREE.DoubleSide
        });
        bugMaterials.push(greymat)
    }

    for (var i = 0; i < 1; i++) {
        var geometry = new THREE.Geometry();

        for (var j = 0; j < size * 180; j++) {
            var pregeom;
            if (j % 2 == 0)
                pregeom = new THREE.CylinderGeometry(0, 6, 60, 5);//
            pregeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, length / 2, 0));
            pregeom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
            if (j % 2 == 1)
                pregeom = new THREE.TetrahedronGeometry(20, Math.floor(Meth.random() * 3));


            var rand = Math.floor((Math.sin(j) / 2 + .5) * 4)
            //change_uvs( pregeom, 1/zoom1, 1/zoom2, Math.floor(Meth.random()*zoom1), Math.floor(Meth.random()*zoom2) );
            var submesh = new THREE.Mesh(pregeom);
            submesh.scale.x = submesh.scale.y = submesh.scale.z = (.01 + Meth.random() * 3) * 5
            if (j % 2 == 1) {
                submesh.scale.x = submesh.scale.y = submesh.scale.z = (.01 + Meth.random() * 3) * 2
            }
            submesh.scale.x *= .3 + size;
            submesh.scale.y *= .3 + size;
            submesh.scale.z *= .3 + size;
            submesh.rotation.set(Meth.random() * 3, Meth.random() * 3, Meth.random() * 3)
            //while (submesh.position.distanceTo(scene.position) < 400) {
            submesh.position.x = (Meth.random() - .5) * 500;
            submesh.position.y = (Meth.random() - .5) * 500;
            submesh.position.z = (Meth.random() - .5) * 500;
            //}
            submesh.lookAt(scene.position)
            submesh.updateMatrix()
            geometry.merge(pregeom, submesh.matrix, rand);


        }



        /*var max = Math.floor(size * 10)
         var stepCube = 50;
         var pos={
         x:(Meth.random()-.5)*1000*size,
         z:(Meth.random()-.5)*1000*size,
         y:(Meth.random()-.5)*1000*size
         }
         for (var _x = -max / 2; _x < max / 2; _x++) {
         pregeom = new THREE.TetrahedronGeometry(20, Math.floor((Math.sin(_x)/2+.5)*3));
         for (var _y = -max / 2; _y < max / 2; _y++) {
         for (var _z = -max / 2; _z < max / 2; _z++) {
         var j=_y
         var pregeom;
         
         
         var rand = Math.floor((Math.sin(j) / 2 + .5) * 4)
         //change_uvs( pregeom, 1/zoom1, 1/zoom2, Math.floor(Meth.random()*zoom1), Math.floor(Meth.random()*zoom2) );
         var submesh = new THREE.Mesh(pregeom);
         //while (submesh.position.distanceTo(scene.position) < 400) {
         submesh.position.x = _x * stepCube+pos.x;
         submesh.position.y = _y * stepCube+pos.y;
         submesh.position.z = _z * stepCube+pos.z;
         //}
         submesh.updateMatrix()
         geometry.merge(pregeom, submesh.matrix, rand);
         
         
         }
         }
         }*/

        var max = Math.floor(10 + size * 20)
        var stepCube = 50;
        var pos = new THREE.Vector3(
                (Meth.random() - .5) * 30 * size,
                (Meth.random() - .5) * 30 * size,
                (Meth.random() - .5) * 30 * size
                )
        var pregeom = new THREE.TetrahedronGeometry(50, Math.floor(Meth.random() * 2));
        //if(Meth.random()<.5)pregeom = new THREE.PlaneGeometry(50,50)
        for (var j = 0; j < max; j++) {
            //var pregeom;


            var rand = Math.floor((Math.sin(j / 3) / 2 + .5) * 4)
            //change_uvs( pregeom, 1/zoom1, 1/zoom2, Math.floor(Meth.random()*zoom1), Math.floor(Meth.random()*zoom2) );
            var submesh = new THREE.Mesh(pregeom);
            //while (submesh.position.distanceTo(scene.position) < 400) {
            var scale = 2 - 1.5 * j / max
            submesh.scale.set(scale, scale, scale)
            submesh.position.x = pos.x
            submesh.position.y = pos.y
            submesh.position.z = pos.z
            while (submesh.position.distanceTo(pos) < 70 * submesh.scale.x) {
                submesh.position.x = pos.x + (Meth.random() - .5) * 100 * scale;
                submesh.position.y = pos.y + (Meth.random() - .5) * 100 * scale;
                submesh.position.z = pos.z + (Meth.random() - .5) * 100 * scale;
            }
            submesh.lookAt(pos)
            pos.x = submesh.position.x
            pos.y = submesh.position.y
            pos.z = submesh.position.z
            //}
            submesh.updateMatrix()
            geometry.merge(pregeom, submesh.matrix, rand);


        }

        var meshFaceMat = new THREE.MeshFaceMaterial(bugMaterials)

        var object = new THREE.Mesh(geometry, meshFaceMat);
        TweenMax.from(object.scale, 1.5, {delay: sphereDelay, x: 0.0001, y: 0.0001, z: 0.0001, ease: Power1.easeOut});
        root.add(object);

    }
}

function front(root, anim) {
    ui = new THREE.Group();
    var uiInside = new THREE.Group();
    var xoffset = globalSize * 200
    var string = [db.location, db.name]//,db.description
    for (var j = 0; j < 2; j++) {
        for (var i = 0; i < string.length; i++) {
            var geometry = new Text(string[i].toUpperCase());
            var material = new THREE.LineBasicMaterial({linecap: "square", linejoin: "miter", linewidth: 2 + j * 4, color: rgbToHex(db.colors[j][0], db.colors[j][1], db.colors[j][2]), opacity: 1, transparent: true});
            var title = new THREE.Line(geometry, material, THREE.LinePieces);
            title.position.x = xoffset + 50 + 280 - 10 * i// - (string[i].length * 3 * 4) / 2;
            title.position.y = -130 + 30 * i;
            title.position.z = 140 - j * 5 + 10 * i;
            title.scale.set(4 + 4 * i, 4 + 4 * i, 4 + 4 * i);
            if (anim)
                TweenMax.from(title.scale, .3, {delay: 2 - i / 2 + delay, x: 0.0001, y: 0.0001, z: 0.0001});
            uiInside.add(title);
        }
    }

    var geometry = new THREE.BoxGeometry(80, 80, 80);

    var texture = THREE.ImageUtils.loadTexture(db.profile_image_url)
    texture.minFilter = THREE.LinearFilter;
    var mat = new THREE.MeshPhongMaterial({
        map: texture,
        reflectivity: 1,
        envMap: textureCube,
        transparent: true,
        side: THREE.DoubleSide,
    })
    var object = new THREE.Mesh(geometry, mat);
    object.position.x = xoffset + 50 + 300;
    object.position.y = 0;
    object.position.z = 140;
    if (anim)
        TweenMax.from(object.scale, 1, {delay: delay + 3, x: 0.0001, y: 0.0001, z: 0.0001, ease: Power1.easeOut});
    logo = object;
    uiInside.add(object)
    uiInside.rotation.y = -.7;
    ui.add(uiInside)
    root.add(ui)
}

function banner(root, anim) {
    if (!db.bgImage)
        return;
    var geometry = new THREE.PlaneGeometry(800, 300)
    var texture = THREE.ImageUtils.loadTexture(db.bgImage)
    texture.minFilter = THREE.LinearFilter;
    var bannerMat = new THREE.MeshBasicMaterial({side: THREE.DoubleSide,
        map: texture
    });

    var object = new THREE.Mesh(geometry, bannerMat);
    if (anim)
        TweenMax.from(object.scale, 1, {delay: delay + 4.5, x: 0.01, y: 0.01, z: 0.01, ease: Power1.easeOut});

    object.position.z = -500;
    root.add(object);
}

function bg(root, anim) {
    var bgMat = new THREE.MeshBasicMaterial({wireframe: true, side: THREE.BackSide});
    var object = new THREE.Mesh(new THREE.IcosahedronGeometry(2000, 1), bgMat);
    //TweenMax.from(object.scale, 5, {delay: 1, x: 13, y: 13, z: 13});
    //TweenMax.from(object.rotation, 3, {delay: 1, x: (Meth.random()-.5)*3, y: (Meth.random()-.5)*3, z: (Meth.random()-.5)*3, ease: Power1.easeOut});

    root.add(object)
}

function surroundings(root, anim) {

    //for (var i = 0; i < 1; i++) {


    var geometry = new THREE.Geometry();
    var j = 0;
    var roz = 40
    for (var _x = -roz; _x <= roz; _x++) {
        for (var _z = -roz; _z <= roz; _z++) {
            var perc = 1 - Math.sqrt(_x * _x + _z * _z) / roz / 1.5
            //console.log(perc)
            var perc1 = 1//(Math.cos(_x*(Math.PI*2/globalBuildingLoopCount))+1)/2
            var perc2 = 1//(Math.cos(_z*(Math.PI*2/globalBuildingLoopCount))+1)/2
            var height = (.9 * Meth.random() + .1) * perc;//Meth.random()
            height *= height;
            height *= height;

            for (var _y = -roz; _y <= roz; _y++) {
                if (_y >= Math.round(-roz + roz * 2 * height))
                    continue;
                var submesh = singleBuilding(_x, _y, _z, j);
                geometry.merge(submesh.geometry, submesh.matrix);
                j++
            }
        }
    }
    if (fullMode) {
        var object = new THREE.Mesh(
                geometry,
                new THREE.MeshPhongMaterial({
                    shading: THREE.FlatShading,
                    //normalMap:THREE.ImageUtils.loadTexture( "_textures/building_normal.jpg" ), 
                    color: 0x666666,
                    //reflectivity: 1, 
                    //envMap: textureCube
                }));
    } else {
        var object = new THREE.Mesh(
                geometry,
                new THREE.MeshPhongMaterial({
                    shading: THREE.FlatShading,
                    //normalMap:THREE.ImageUtils.loadTexture( "_textures/building_normal.jpg" ), 
                    color: 0x666666,
                    //reflectivity: 1, 
                    //envMap: textureCube
                }));
    }

    root.add(object);

    outsideSurroundings = object;

    //}
}

function ground(root) {
    var wireframe = false;


    var geometry = new THREE.Geometry();
    var groundY = -33000

    var pregeom = new THREE.CylinderGeometry(0, 200000, 140000, 6);//
    pregeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 140000 / 2, 0));
    var submesh = new THREE.Mesh(pregeom);
    submesh.rotation.z = Math.PI
    submesh.position.y = groundY
    submesh.updateMatrix()
    geometry.merge(pregeom, submesh.matrix);

    for (var j = 0; j < 25; j++) {
        var pos = {x: (Meth.random() - .5) * 450000, z: (Meth.random() - .5) * 450000};
        var perc = 1 - Math.sqrt(pos.x * pos.x + pos.z * pos.z) / 450000

        //console.log(perc)
        perc *= perc;
        var height = perc * 140000
        var pregeom;
        pregeom = new THREE.CylinderGeometry(0, height, height, Math.round(4 + Meth.random() * 5));//

        pregeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, height / 2, 0));


        var rand = Math.floor((Math.sin(j) / 2 + .5) * 4)
        //change_uvs( pregeom, 1/zoom1, 1/zoom2, Math.floor(Meth.random()*zoom1), Math.floor(Meth.random()*zoom2) );

        var submesh = new THREE.Mesh(pregeom);
        submesh.rotation.z = Math.PI
        submesh.position.y = groundY - Meth.random() * 15000;
        submesh.position.x = pos.x;
        submesh.position.z = pos.z;

        submesh.updateMatrix()
        geometry.merge(pregeom, submesh.matrix);
    }
    var greymat = new THREE.MeshPhongMaterial({
        color: 0x333333,
        emissive: 0x666666,
        //vertexColors: THREE.FaceColors,
        shading: THREE.FlatShading,
        //wireframe: wireframe,
        //wireframeLinewidth: 15,
        //side: THREE.DoubleSide
    });

    var object = new THREE.Mesh(geometry, greymat);
    groundObject = object;
    root.add(object);
}

function singleBuilding(_x, _y, _z, j) {
    var pregeom;
    if (j % 2 == 0) {
        pregeom = new THREE.BoxGeometry(500 + 200 * Meth.random(), 500 + 200 * Meth.random(), 500 + 200 * Meth.random());//+ 200 * Meth.random()
        var submesh = new THREE.Mesh(pregeom);
        submesh.scale.x = submesh.scale.y = submesh.scale.z = 2 + Meth.random() * 2.5
        /*for(var i=0;i<5;i++){
         var smallCube = new THREE.BoxGeometry(10,10,10)
         var smallCubeMesh = new THREE.Mesh(smallCube);
         smallCubeMesh.position.x=-600/2;
         smallCubeMesh.updateMatrix();
         
         pregeom.merge(smallCubeMesh.geometry, smallCubeMesh.matrix);
         }*/
    }

    if (j % 2 == 1) {
        pregeom = new THREE.TetrahedronGeometry(600, 0);
        var submesh = new THREE.Mesh(pregeom);
        submesh.scale.x = submesh.scale.y = submesh.scale.z = 4 + Meth.random() * 1.5

        submesh.rotation.set(Meth.random() * 3, Meth.random() * 3, Meth.random() * 3)
    }

    var roz = globalDistance


    submesh.position.x = roz * (_x + .5);
    submesh.position.y = roz * (_y + .5);
    submesh.position.z = roz * (_z + .5);

    if (_y < 0) {
        var random = Meth.random()
        if (random < .33) {
            submesh.position.x += (Meth.random() - .5) * roz * 2;
        } else if (random < .66) {
            submesh.position.y += (Meth.random() - .5) * roz * 2;
        } else {
            submesh.position.z += (Meth.random() - .5) * roz * 2;
        }
    }

    submesh.position.y += roz * 40 * .8;

    submesh.updateMatrix();
    return submesh;
}

function fakeCells(root, anim) {
    for (var i = 0; i < 1; i++) {
        var geometry = new THREE.Geometry();

        var mult = 2;
        if (!fullMode)
            mult = 1;
        for (var _x = -mult; _x <= mult; _x++) {
            for (var _y = -mult; _y <= mult; _y++) {
                for (var _z = -mult; _z <= mult; _z++) {
                    if (_x == 0 && _y == 0 && _z == 0)
                        continue;
                    var pregeom;
                    pregeom = new THREE.TetrahedronGeometry(200, 3);//

                    for (var i = 0; i < pregeom.vertices.length; i++)
                    {
                        var v = pregeom.vertices[i]
                        v.x *= 1 + (Meth.random() - .5) * 1.5
                        v.y *= 1 + (Meth.random() - .5) * 1.5
                        v.z *= 1 + (Meth.random() - .5) * 1.5
                        //console.log(v)
                    }
                    var submesh = new THREE.Mesh(pregeom);
                    submesh.scale.x = submesh.scale.y = submesh.scale.z = 1//.2 + Meth.random() * 5.8

                    var roz = globalDistance


                    submesh.position.x = roz * _x;
                    submesh.position.y = roz * _y;
                    submesh.position.z = roz * _z;

                    submesh.updateMatrix();
                    geometry.merge(pregeom, submesh.matrix);




                    var perc = (Math.abs(_x) + Math.abs(_y) + Math.abs(_z)) / 6;
                    //console.log(perc)
                    var max = 500 * (1 - perc + .1);//600
                    if (!fullMode)
                        max /= 3;

                    var tgeometry = new THREE.BoxGeometry(10, 10, 10);

                    for (var j = 0; j < 1 + (1 - perc) * 3; j++) {
                        var pregeom = new THREE.BoxGeometry(10, 10, 10);
                        var submesh = new THREE.Mesh(pregeom);
                        submesh.position.x = (Meth.random() - .5) * 125;
                        submesh.position.y = (Meth.random() - .5) * 125;
                        submesh.position.z = (Meth.random() - .5) * 125;
                        submesh.updateMatrix()
                        tgeometry.merge(pregeom, submesh.matrix);
                    }



                    for (var i = 0; i < max; i++) {

                        var object = new THREE.Mesh(tgeometry);

                        object.position.x = roz * _x + Meth.random() * 400 - 200;
                        object.position.y = roz * _y + Meth.random() * 200 - 100;
                        object.position.z = roz * _z + Meth.random() * 300 - 150;

                        if (i % 3 === 0)
                            object.position.x -= Math.sin(i + count) * 2000;
                        if (i % 3 === 1)
                            object.position.y -= Math.cos(i + count) * 2000;
                        if (i % 3 === 2)
                            object.position.z -= Math.cos(3 * i + count) * 2000;

                        object.scale.x = Meth.random() * 1.5 + (perc) * 5 + .5;
                        object.scale.y = Meth.random() * 1.5 + (perc) * 5 + .5;
                        object.scale.z = Meth.random() * 1.5 + (perc) * 5 + .5;


                        object.updateMatrix();
                        geometry.merge(pregeom, object.matrix);

                    }


                }
            }
        }

        //var fog = new THREE.Fog(rgbToHex(db.colors[1][0], db.colors[1][1], db.colors[1][2]), 1000, 3000);
        //var texture=THREE.ImageUtils.loadTexture( "_textures/white.png" )
        var mat;
        /*material = new THREE.ShaderMaterial({
         uniforms: {
         "map": {type: "t", value: texture},
         "fogColor": {type: "c", value: fog.color},
         "fogNear": {type: "f", value: fog.near},
         "fogFar": {type: "f", value: fog.far},
         },
         vertexShader: document.getElementById('vs').textContent,
         fragmentShader: document.getElementById('fs').textContent,
         depthWrite: false,
         //depthTest: false,
         transparent: true
         
         });*/
        mat = new THREE.MeshPhongMaterial({
            shading: THREE.FlatShading,
            color: 0x666666,
            reflectivity: 0,
            envMap: textureCube,
        })
        mat.currentColor = [mat.color.r, mat.color.g, mat.color.b]
        var object = new THREE.Mesh(geometry, mat);

        //outsideFakeCells = object;
        root.add(object);
        interactiveObjects.push(object);
        fakeScene = object;

    }
}

function cubes(root, anim) {
    var geometry = new THREE.BoxGeometry(6, 6, 6);

    for (var j = 0; j < 7; j++) {
        var pregeom = new THREE.BoxGeometry(6, 6, 6);
        var submesh = new THREE.Mesh(pregeom);
        submesh.position.x = (Meth.random() - .5) * 125;
        submesh.position.y = (Meth.random() - .5) * 125;
        submesh.position.z = (Meth.random() - .5) * 125;
        submesh.updateMatrix()
        geometry.merge(pregeom, submesh.matrix);
    }

    var mats = [];
    for (var i = 0; i < 3; i++) {
        var mat = new THREE.MeshPhongMaterial({
            color: rgbToHex(db.colors[i][0], db.colors[i][1], db.colors[i][2]),
            reflectivity: 0,
            envMap: textureCube,
            //reflectivity: 1,
            //envMap: textureCube,
            //normalMap:THREE.ImageUtils.loadTexture( "_textures/building_normal.jpg" ), 
        })
        mat.currentColor = [mat.color.r, mat.color.g, mat.color.b]
        mats.push(mat)
    }

    var max = 500 + 3000 * globalSize;

    for (var i = 0; i < max; i++) {

        var object = new THREE.Mesh(geometry, mats[Math.floor(Meth.random() * mats.length)]);

        object.position.x = Meth.random() * 400 - 200;
        object.position.y = Meth.random() * 200 - 100;
        object.position.z = Meth.random() * 300 - 150;

        if (i % 3 === 0)
            object.position.x -= Math.sin(i + count) * 2000;
        if (i % 3 === 1)
            object.position.y -= Math.cos(i + count) * 2000;
        if (i % 3 === 2)
            object.position.z -= Math.cos(3 * i + count) * 2000;

        object.scale.x = Meth.random() * 1.5 + .5;
        object.scale.y = Meth.random() * 1.5 + .5;
        object.scale.z = Meth.random() * 1.5 + .5;


        if (anim)
            TweenMax.from(object.scale, 1, {delay: delay + 5 + i / 1000, x: 0.01, y: 0.01, z: 0.01, ease: Power1.easeOut});


        root.add(object);

        interactiveObjects.push(object);
        objects.push(object);

    }
}

function glass(root, anim) {

    var geometry = new THREE.Geometry();

    var glassMat = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
        refractionRatio: 1,
        reflectivity: 1, envMap: textureCubeDark,
        transparent: true, opacity: 1});

    for (var i = 0; i < 300; i++) {

        var object = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), glassMat);

        object.position.x = Meth.random() * 1500 - 750;
        object.position.y = Meth.random() * 1500 - 750;
        object.position.z = Meth.random() * 1500 - 750;

        object.lookAt(scene.position)

        object.scale.x = Meth.random() * 2 + .1;
        object.scale.y = Meth.random() * 2 + .1;
        object.scale.z = Meth.random() * 2 + .1;

        object.updateMatrix()
        geometry.merge(object.geometry, object.matrix);

    }
    var object = new THREE.Mesh(geometry, glassMat);
    root.add(object);
    if (anim)
        TweenMax.from(object.scale, 1, {delay: delay + 2 + 3, x: 0.01, y: 0.01, z: 0.01, ease: Power1.easeOut});

}

function carbon(root, anim) {

    var geometry = new THREE.Geometry();
    var glassMat = new THREE.MeshPhongMaterial({side: THREE.DoubleSide,
        //shininess: 1,
        refractionRatio: 1, color: rgbToHex(db.colors[1][0] / 4, db.colors[1][1] / 4, db.colors[1][2] / 4), //0x333333,
        //specularMap: THREE.ImageUtils.loadTexture("carbon_spec.jpg"),
        normalMap: THREE.ImageUtils.loadTexture("_textures/carbon.jpg"),
        //normalScale: new THREE.Vector2(1, 1)
    });

    for (var i = 0; i < 300; i++) {
        var subgeometry = new THREE.PlaneGeometry(60, 60)
        var object = new THREE.Mesh(subgeometry, glassMat);

        object.position.x = Meth.random() * 1500 - 750;
        object.position.y = Meth.random() * 600 - 300;
        object.position.z = -450 + Meth.random() * 400 - 200 - Math.cos(object.position.x / 500) * 400;

        object.lookAt(scene.position)

        object.rotation.x += (Meth.random() - .5) * .14 * Math.PI;
        object.rotation.y += (Meth.random() - .5) * .14 * Math.PI;
        object.rotation.z += (Meth.random() - .5) * .14 * Math.PI;

        object.scale.x = object.scale.y = object.scale.z = Meth.random() * 2 + .1;

        object.updateMatrix()
        geometry.merge(object.geometry, object.matrix);

    }

    var object = new THREE.Mesh(geometry, glassMat);
    root.add(object);
    if (anim)
        TweenMax.from(object.scale, 1, {delay: 3.7, x: 0.01, y: 0.01, z: 0.01, ease: Power1.easeOut});

}

function shards(root, anim) {

    //var geometry = new THREE.CubeGeometry( 4, 4, 4 );
    //var geometry = new THREE.IcosahedronGeometry( 10, 0 );
    //var geometry = new THREE.OctahedronGeometry( 10, 0 );
    var geometry = new THREE.Geometry();

    var mat = new THREE.MeshPhongMaterial({
        ambient: 0x030303,
        color: rgbToHex(db.colors[3][0], db.colors[3][1], db.colors[3][2]),
        specular: 0x333333,
        shininess: 10,
        shading: THREE.FlatShading,
        reflectivity: 1, envMap: textureCubeDark,
        opacity: 1,
        side: THREE.DoubleSide,
        transparent: true});
    for (var i = 0; i < 100 + 1000 * globalSize; i++) {
        var object = new THREE.Mesh(new THREE.TetrahedronGeometry(20, 0), mat);

        var roz = 1000

        object.position.x = Meth.random() * roz - roz / 2;
        object.position.y = Meth.random() * roz - roz / 2;
        object.position.z = Meth.random() * roz - roz / 2;

        object.rotation.x = Meth.random() * 2 * Math.PI;
        object.rotation.y = Meth.random() * 2 * Math.PI;
        object.rotation.z = Meth.random() * 2 * Math.PI;

        object.scale.x = Meth.random() + 0.1;
        object.scale.y = Meth.random() + 0.1;
        object.scale.z = Meth.random() + 0.1;

        object.updateMatrix()
        geometry.merge(object.geometry, object.matrix);

    }

    var object = new THREE.Mesh(geometry, mat);
    var randoms = [Meth.random(), Meth.random(), Meth.random()]
    if (anim)
        TweenMax.from(object.scale, 3, {delay: delay + 2, x: 0.01, y: 0.01, z: 0.01, ease: Power1.easeOut});
    if (anim)
        TweenMax.from(object.rotation, 3, {delay: delay + 2, x: (randoms[0] - .5) * 3, y: (randoms[1] - .5) * 3, z: (randoms[2] - .5) * 3, ease: Power1.easeOut});
    root.add(object)

}
function clouds(root, anim) {
    var dpr = 1;
    if (window.devicePixelRatio)
        dpr = window.devicePixelRatio
    var particleCount = 170,
            particles = new THREE.Geometry(),
            pMaterial = new THREE.PointCloudMaterial({
                color: 0xffffff, //rgbToHex(db.colors[3][0], db.colors[3][1], db.colors[3][2]),
                size: 1800000 * 1.6 * 2 / dpr,
                map: THREE.ImageUtils.loadTexture(
                        "_textures/cloud_bloom.png"
                        ),
                //blending: THREE.AdditiveBlending,
                depthWrite: false,
                //depthTest: false,
                transparent: true,
                fog: false
            });

    for (var p = 0; p < particleCount; p++) {
        var roz = 400000;
        var pX = 0, pY = 0, pZ = 0;
        while (Math.abs(pX) < roz * .25 && Math.abs(pY) < roz * .25 && Math.abs(pZ) < roz * .25) {
            pX = Meth.random() * roz - roz / 2;
            pY = -Meth.random() * roz / 2;
            pZ = Meth.random() * roz - roz / 2;
        }

        var particle = new THREE.Vector3(pX * 6, pY * 6, pZ * 6)
        particle.velocity = new THREE.Vector3(
                0,
                -Meth.random(),
                0);

        particles.vertices.push(particle);
    }

    var object = new THREE.PointCloud(
            particles,
            pMaterial);

    object.sortParticles = false;

    root.add(object);
    cloudsObject = object;

    //var randoms = [Meth.random(), Meth.random(), Meth.random()]
    //if (anim)
    //    TweenMax.from(object.scale, 5, {delay: 1, x: 0.0001, y: 0.0001, z: 0.0001, ease: Power1.easeOut});
    //if (anim)
    //    TweenMax.from(object.rotation, 5, {delay: 1, x: (randoms[0] - .5) * 3, y: (randoms[1] - .5) * 3, z: (randoms[2] - .5) * 3, ease: Power1.easeOut});


}
function vectorParticles(root, anim) {

    var particleID = Math.floor(Meth.random() * 3);
    var particleCount = 3000,
            particles = new THREE.Geometry(),
            pMaterial = new THREE.PointCloudMaterial({
                color: rgbToHex(db.colors[3][0], db.colors[3][1], db.colors[3][2]),
                size: 10,
                map: THREE.ImageUtils.loadTexture(
                        "_textures/particle" + particleID + ".png"
                        ),
                blending: THREE.AdditiveBlending,
                transparent: true
            });

    for (var p = 0; p < particleCount; p++) {
        var roz = 500;
        var pX = Meth.random() * roz - roz / 2,
                pY = Meth.random() * roz - roz / 2,
                pZ = Meth.random() * roz - roz / 2,
                particle = new THREE.Vector3(pX * 6, pY * 6, pZ * 6)
        particle.velocity = new THREE.Vector3(
                0,
                -Meth.random(),
                0);

        particles.vertices.push(particle);
    }

    var object = new THREE.PointCloud(
            particles,
            pMaterial);

    object.sortParticles = false;

    dustParticles = object;
    root.add(object);

    var randoms = [Meth.random(), Meth.random(), Meth.random()]
    if (anim)
        TweenMax.from(object.scale, 5, {delay: delay + 1, x: 0.0001, y: 0.0001, z: 0.0001, ease: Power1.easeOut});
    if (anim)
        TweenMax.from(object.rotation, 5, {delay: delay + 1, x: (randoms[0] - .5) * 3, y: (randoms[1] - .5) * 3, z: (randoms[2] - .5) * 3, ease: Power1.easeOut});

}

function initSky() {

    var helper = new THREE.GridHelper(5000, 5000);
    helper.color1.setHex(0xffffff);
    helper.color2.setHex(0xffffff);
    //scene.add(helper);

    // Add Sky Mesh
    sky = new THREE.Sky();
    scene.add(sky.mesh);


    // Add Sun Helper
    sunSphere = new THREE.Mesh(new THREE.SphereGeometry(20000, 30, 30),
            new THREE.MeshBasicMaterial({color: 0xffffff, wireframe: false}));
    sunSphere.position.y = -700000;
    sunSphere.visible = true;
    scene.add(sunSphere);

    /// GUI

    var effectController = {
        turbidity: 10,
        reileigh: 2,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.8,
        luminance: 0.13,
        inclination: 0.16, // elevation / inclination
        azimuth: 0.23, // Facing front,
        sun: !true
    }

    var distance = 400000;

    function guiChanged() {
        var uniforms = sky.uniforms;
        uniforms.turbidity.value = effectController.turbidity;
        uniforms.reileigh.value = effectController.reileigh;
        uniforms.luminance.value = effectController.luminance;
        uniforms.mieCoefficient.value = effectController.mieCoefficient;
        uniforms.mieDirectionalG.value = effectController.mieDirectionalG;

        var theta = Math.PI * (effectController.inclination - 0.5);
        var phi = 2 * Math.PI * (effectController.azimuth - 0.5);

        sunSphere.position.x = distance * Math.cos(phi);
        sunSphere.position.y = distance * Math.sin(phi) * Math.sin(theta);
        sunSphere.position.z = distance * Math.sin(phi) * Math.cos(theta);

        sunSphere.visible = effectController.sun;

        sky.uniforms.sunPosition.value.copy(sunSphere.position);

    }


    /*var gui = new dat.GUI();
     
     
     gui.add(effectController, "turbidity", 1.0, 20.0, 0.1).onChange(guiChanged);
     gui.add(effectController, "reileigh", 0.0, 4, 0.001).onChange(guiChanged);
     gui.add(effectController, "mieCoefficient", 0.0, 0.1, 0.001).onChange(guiChanged);
     gui.add(effectController, "mieDirectionalG", 0.0, 1, 0.001).onChange(guiChanged);
     gui.add(effectController, "luminance", 0.0, 2).onChange(guiChanged);
     ;
     gui.add(effectController, "inclination", 0, 1, 0.0001).onChange(guiChanged);
     gui.add(effectController, "azimuth", 0, 1, 0.0001).onChange(guiChanged);
     gui.add(effectController, "sun").onChange(guiChanged);*/


    guiChanged();


    camera.lookAt(sunSphere.position)


}


function Sound(source, volume, loop)
{
    this.source = source;
    this.volume = volume;
    this.loop = loop;
    var son;
    this.son = son;
    this.finish = false;
    this.stop = function ()
    {
        document.body.removeChild(this.son);
    }
    this.start = function ()
    {
        if (this.finish)
            return false;
        this.son = document.createElement("embed");
        this.son.setAttribute("src", this.source);
        this.son.setAttribute("hidden", "true");
        this.son.setAttribute("volume", this.volume);
        this.son.setAttribute("autostart", "true");
        this.son.setAttribute("loop", this.loop);
        document.body.appendChild(this.son);
    }
    this.remove = function ()
    {
        document.body.removeChild(this.son);
        this.finish = true;
    }
    this.init = function (volume, loop)
    {
        this.finish = false;
        this.volume = volume;
        this.loop = loop;
    }
}


            