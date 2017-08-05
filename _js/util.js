function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(Math.floor(r)) + componentToHex(Math.floor(g)) + componentToHex(Math.floor(b));
}

function change_uvs(geometry, unitx, unity, offsetx, offsety) {
    var faceVertexUvs = geometry.faceVertexUvs[ 0 ];
    for (var i = 0; i < faceVertexUvs.length; i++) {
        var uvs = faceVertexUvs[ i ];
        for (var j = 0; j < uvs.length; j++) {
            var uv = uvs[ j ];
            uv.x = (uv.x + offsetx) * unitx;
            uv.y = (uv.y + offsety) * unity;
        }
    }
}

function screenshot() {
    if (!root.visible)
        return;
    if (!fullMode)
        return;
    if(effect)
        return;
    
    var cameraPrePosition = camera.position.clone();
    camera.position.x= 244.3526467388843
    camera.position.y= 137.86812678599478
    camera.position.z= 891.7680964660263
    camera.lookAt(scene.position)
    
    var targetPrePosition = orbitControlsTarget.clone();
    orbitControlsTarget.set(0,0,0)
    
    var uiLookAtOld=uiLookAt.position.clone()
    uiLookAt.position.x=camera.position.x
    uiLookAt.position.y=camera.position.y
    uiLookAt.position.z=camera.position.z
    
    ui.lookAt(uiLookAt.position)

    var w = 768;
    var h = 432;
    var dpr = 1;
    if (window.devicePixelRatio !== undefined) {
        dpr = window.devicePixelRatio;
    }
    w /= dpr;
    h /= dpr;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    renderer.setSize(w, h);

    //renderComposer.render()
    renderer.render(scene,camera)

    var data = renderer.domElement.toDataURL('image/jpg');
    var output = data.replace(/^data:image\/(png|jpg);base64,/, "");
    $.post("_screen/savedata.php", {screen: output, user: user}, function (data) {
        //alert("---"+data);
        console.log(data);
        //window.location.reload(true);
    });

    onWindowResize();
    
    camera.position.set(cameraPrePosition.x,cameraPrePosition.y,cameraPrePosition.z)
    orbitControlsTarget.set(targetPrePosition.x,targetPrePosition.y,targetPrePosition.z)
    uiLookAt.position.set(uiLookAtOld.x,uiLookAtOld.y,uiLookAtOld.z)
    camera.lookAt(scene.position)
    

    renderer.render(scene,camera)
    
}



var sampleFollowingDB = ['beastwarsband', 'fusetools', 'thespite,stevielaux', 'xymatic', 'JulienPellet', 'Shadertoy', 'glitchr_', 'variable_io', 'michaeltheory', 'cocacola', 'teslamotors', 'ford', 'muldernskully', 'hypercubeio', 'stephcd', 'GVCdesign', 'madworldtv', 'huncwotdigital', 'refikanadol', 'marpi_', 'gsp', 'seagate', 'chevrolet', 'dodge', 'pepsi', 'korn', 'minecraft', 'microsoft', 'mrdoob', 'cartelle', 'cupe_cupe', 'albertomoss', 'gmunk', 'ashthorp']
var sampleFollowingDBIDs = [3124080193, 3124301865, 26615361, 17617356, 3059080738, 14604320, 47730273, 2971974719, 2937070168, 2932500586, 2449356254, 2901022812, 2302814179, 2898764707, 123551633, 91560759, 54489059, 45994908, 901831686, 2417290891, 888889368, 51521334, 547903742, 113103755, 62534231, 397176688, 375715598, 2430003924, 2307230400, 754498, 2154042884, 832899872, 1097883312, 1355601482, 1621377211, 16793718, 1371140762, 3382271, 1276127618, 28098699, 1317403476, 992301409, 1234523942, 418533353, 14289958, 33114793, 104459499, 86587748, 132666906, 144593338, 514330587, 950331332, 343665712, 487946770, 927778460, 393684110, 637275084, 25669284, 15728834, 473555593, 199184028, 55603875, 21745662, 212728732, 14408265, 197476075, 317149513, 19475408, 615458269, 362763078, 15644505, 48755852, 16437000, 52390632, 225041828, 564127315, 442335724, 14112776, 16968123, 66963886, 399731454, 297239016, 369156856, 7583752, 40743, 132150759, 154166590, 291822060, 18760850, 221164494, 114606696, 344963463, 16532045, 22072519, 228512767, 40971896, 21660082, 106984736, 21390252];





// Custom Geometry - using 3 triangles each. No UVs, no normals currently.

THREE.BirdGeometry = function () {

    var triangles = BIRDS * 3;
    var points = triangles * 3;

    THREE.BufferGeometry.call(this);

    var vertices = new THREE.BufferAttribute(new Float32Array(points * 3), 3);
    var birdColors = new THREE.BufferAttribute(new Float32Array(points * 3), 3);
    var references = new THREE.BufferAttribute(new Float32Array(points * 2), 2);
    var birdVertex = new THREE.BufferAttribute(new Float32Array(points), 1);

    this.addAttribute('position', vertices);
    this.addAttribute('birdColor', birdColors);
    this.addAttribute('reference', references);
    this.addAttribute('birdVertex', birdVertex);

    // this.addAttribute( 'normal', new Float32Array( points * 3 ), 3 );


    var v = 0;

    function verts_push() {
        for (var i = 0; i < arguments.length; i++) {
            vertices.array[v++] = arguments[i];
        }
    }

    var wingsSpan = 20;

    for (var f = 0; f < BIRDS; f++) {

        // Body
        verts_push(
                0, -0, -20,
                0, 4, -20,
                0, 0, 30
                );

        // Left Wing
        verts_push(
                0, 0, -15,
                -wingsSpan, 0, 0,
                0, 0, 15
                );

        // Right Wing
        verts_push(
                0, 0, 15,
                wingsSpan, 0, 0,
                0, 0, -15
                );

    }

    for (var v = 0; v < triangles * 3; v++) {

        var i = ~~(v / 3);
        var x = (i % WIDTH) / WIDTH;
        var y = ~~(i / WIDTH) / WIDTH;

        var c = new THREE.Color(
                0x444444 +
                ~~(v / 9) / BIRDS * 0x666666
                );

        birdColors.array[ v * 3 + 0 ] = c.r;
        birdColors.array[ v * 3 + 1 ] = c.g;
        birdColors.array[ v * 3 + 2 ] = c.b;

        references.array[ v * 2     ] = x;
        references.array[ v * 2 + 1 ] = y;

        birdVertex.array[ v         ] = v % 9;

    }

    this.applyMatrix(new THREE.Matrix4().makeScale(0.2, 0.2, 0.2));

}

THREE.BirdGeometry.prototype = Object.create(THREE.BufferGeometry.prototype);