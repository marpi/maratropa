/**
 * @author richt / http://richt.me
 * @author WestLangley / http://github.com/WestLangley
 *
 * W3C Device Orientation control (http://w3c.github.io/deviceorientation/spec-source-orientation.html)
 */

THREE.DeviceOrientationControls = function (object) {

    var STATE = {NONE: -1, ROTATE: 0, DOLLY: 1, PAN: 2, TOUCH_ROTATE: 3, TOUCH_DOLLY: 4, TOUCH_PAN: 5};
    var scope = this;

    this.object = object;
    this.object.rotation.reorder("YXZ");

    this.noZoom = false

    this.enabled = true;
    this.state = STATE.NONE;

    var dollyStart = new THREE.Vector2();
    var dollyEnd = new THREE.Vector2();
    var dollyDelta = new THREE.Vector2();

    var cameraDistance = 1000;

    this.deviceOrientation = {};
    this.screenOrientation = 0;

    var onDeviceOrientationChangeEvent = function (event) {

        scope.deviceOrientation = event;

    };

    var onScreenOrientationChangeEvent = function () {

        scope.screenOrientation = window.orientation || 0;

    };

    // The angles alpha, beta and gamma form a set of intrinsic Tait-Bryan angles of type Z-X'-Y''

    var setObjectQuaternion = function () {

        var zee = new THREE.Vector3(0, 0, 1);

        var euler = new THREE.Euler();

        var q0 = new THREE.Quaternion();

        var q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

        return function (quaternion, alpha, beta, gamma, orient) {

            euler.set(beta, alpha, -gamma, 'YXZ');                       // 'ZXY' for the device, but 'YXZ' for us

            quaternion.setFromEuler(euler);                               // orient the device

            quaternion.multiply(q1);                                      // camera looks out the back of the device, not the top

            quaternion.multiply(q0.setFromAxisAngle(zee, -orient));    // adjust for screen orientation

        }

    }();

    this.connect = function () {

        onScreenOrientationChangeEvent(); // run once on load

        window.addEventListener('orientationchange', onScreenOrientationChangeEvent, false);
        window.addEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);

        window.addEventListener('touchstart', touchstart, false);
        window.addEventListener('touchend', touchend, false);
        window.addEventListener('touchmove', touchmove, false);

        scope.enabled = true;

    };

    var touchstart = function (event) {



        if (scope.enabled === false)
            return;
        switch (event.touches.length) {

            case 1:	// one-fingered touch: rotate
                break;

            case 2:	// two-fingered touch: dolly

                if (scope.noZoom === true)
                    return;

                state = STATE.TOUCH_DOLLY;

                var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
                var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
                var distance = Math.sqrt(dx * dx + dy * dy);
                dollyStart.set(0, distance);
                break;

            default:

                state = STATE.NONE;

        }

        if (state !== STATE.NONE)
            scope.dispatchEvent(startEvent);

    }

    var touchmove = function (event) {

        if (scope.enabled === false)
            return;

        event.preventDefault();
        event.stopPropagation();

        //var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

        switch (event.touches.length) {

            case 1: // one-fingered touch: rotate

                break;

            case 2: // two-fingered touch: dolly

                if (scope.noZoom === true)
                    return;
                if (state !== STATE.TOUCH_DOLLY)
                    return;

                var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
                var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
                var distance = Math.sqrt(dx * dx + dy * dy);

                dollyEnd.set(0, distance);
                dollyDelta.subVectors(dollyEnd, dollyStart);


                if (dollyDelta.y > 0) {

                    //scope.dollyOut();
                    //alert('in')
                    cameraDistance -= dollyDelta.y * cameraDistance / 100;

                } else if (dollyDelta.y < 0) {

                    //scope.dollyIn();
                    //alert('out')
                    cameraDistance -= dollyDelta.y * cameraDistance / 100;

                }

                if (cameraDistance < 500)
                    cameraDistance = 500;
                if (cameraDistance > 2000)
                    cameraDistance = 2000;

                dollyStart.copy(dollyEnd);

                //scope.update();
                break;

            case 3: // three-fingered touch: pan

                break;

            default:

                state = STATE.NONE;

        }

    }

    var touchend = function ( /* event */ ) {

        if (scope.enabled === false)
            return;

        scope.dispatchEvent(endEvent);
        state = STATE.NONE;

    }

    this.disconnect = function () {

        window.removeEventListener('orientationchange', onScreenOrientationChangeEvent, false);
        window.removeEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);

        scope.enabled = false;

    };

    this.update = function () {

        if (scope.enabled === false)
            return;

        var alpha = scope.deviceOrientation.alpha ? THREE.Math.degToRad(scope.deviceOrientation.alpha) : 0; // Z
        var beta = scope.deviceOrientation.beta ? THREE.Math.degToRad(scope.deviceOrientation.beta) : 0; // X'
        var gamma = scope.deviceOrientation.gamma ? THREE.Math.degToRad(scope.deviceOrientation.gamma) : 0; // Y''
        var orient = scope.screenOrientation ? THREE.Math.degToRad(scope.screenOrientation) : 0; // O

        setObjectQuaternion(scope.object.quaternion, alpha, beta, gamma, orient);

        scope.object.position.set(0, 0, 0)
        scope.object.translateZ(cameraDistance);

    };

    this.connect();

};
