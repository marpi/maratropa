var mouseIsDown = false;

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    moveButtons()
    TweenMax.delayedCall(1, moveButtons)
    TweenMax.delayedCall(2, moveButtons)
    TweenMax.delayedCall(3, moveButtons)
}
function moveButtons() {
    $(".about").css("left", window.innerWidth - 38 - 80 - 10);
    $(".fullscreen").css("left", window.innerWidth - 10 - 32);
}

function resetMat() {
    if (intersected)
        if (intersected.material.color.r != intersected.material.currentColor[0])
            TweenMax.to(intersected.material.color, .3, {r: intersected.material.currentColor[0], g: intersected.material.currentColor[1], b: intersected.material.currentColor[2]})//intersected.currentReflectivity
    //intersected.material.reflectivity=intersected.currentReflectivity;
}
function setMat() {
    //intersected.currentHex = [intersected.material.color.r,intersected.material.color.g,intersected.material.color.b]
    //console.log(intersected.material.color.getHSL())
    //intersected.currentReflectivity = intersected.material.reflectivity;
    //intersected.material.reflectivity=1;
    TweenMax.to(intersected.material.color, .3, {r: .7, g: .7, b: .7})
}

function onDocumentMouseMove(event) {
    
    if(!newFrame)return;
    newFrame=false;

    event.preventDefault();

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;

    raycaster.setFromCamera(mouse, camera);

    if (selected || mouseIsDown) {
        //var intersects = raycaster.intersectObject(plane);
        //if (!intersects[ 0 ])
        //    return;
        //selected.position.copy(intersects[ 0 ].point.sub(offset));
        resetMat()
        return;
    }

    var intersects = raycaster.intersectObjects(interactiveObjects);
    if (intersects.length > 0) {
        if (intersected != intersects[ 0 ].object) {
            resetMat()
            intersected = intersects[ 0 ].object;
            //intersected.currentHex = 0xffffff//intersected.material.color.getHex();
            setMat()
            //intersected.material.color.setHex(0xffffff);
            plane.position.copy(intersected.position);
            plane.lookAt(camera.position);
        } else {

        }
        container.style.cursor = 'pointer';
        if (clickAudio) {
            clickAudio.volume = 1;
            clickAudio.play();
        }
    } else {
        resetMat()

        intersected = null;
        container.style.cursor = 'move';
        container.style.cursor = '-webkit-grab';
        container.style.cursor = '-moz-grab';
        container.style.cursor = 'grab';
    }
}

function onDocumentMouseDown(event) {

    //window.open( renderer.domElement.toDataURL( 'image/png' ), 'screenshot' );
    mouseIsDown = true;

    event.preventDefault();
    var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);
    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
    var intersects = raycaster.intersectObjects(interactiveObjects);
    if (intersects.length > 0) {
        controls.enabled = false;
        selected = intersects[ 0 ].object;
        //var intersects = raycaster.intersectObject(plane);
        // offset.copy(intersects[ 0 ].point).sub(plane.position);
        //container.style.cursor = 'move';
    } else {
        container.style.cursor = 'move';
        container.style.cursor = '-webkit-grabbing';
        container.style.cursor = '-moz-grabbing';
        container.style.cursor = 'grabbing';
    }
}

function onDocumentMouseUp(event) {
    mouseIsDown = false;

    event.preventDefault();

    controls.enabled = true;
    if (intersected) {
        var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);
        var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());
        var intersects = raycaster.intersectObjects(interactiveObjects);
        if (intersects.length > 0) {
            resetMat()
            //intersected.material.color.setHex(intersected.currentHex);
            if (selected)
                selected.clickPoint = intersects[0].point
            if (selected == intersects[ 0 ].object)
                gotoRandom()
        }

        plane.position.copy(intersected.position);
        selected = null;
        intersected = null;
    }

    selected = null;

    container.style.cursor = 'move';
    container.style.cursor = '-webkit-grab';
    container.style.cursor = '-moz-grab';
    container.style.cursor = 'grab';

}