var db = {};
var proxy = '_server/server.php/?path=';
var API = "_api/";
var followersAPI = API + "followers.php";
var followingAPI = API + "following.php";
var i = 0;
var transferring = false;

var root = new THREE.Object3D();
function create(anim) {
    transferring = true;
    var dx = 0
    var dy = 0
    var dz = 0
    var size = globalDistance;
    if (selected) {

        var pos = selected.position.clone().normalize()
        if (selected == fakeScene && selected.clickPoint) {
            pos = selected.clickPoint.clone().normalize()
            dx = -Math.round(pos.x) * size
            dy = -Math.round(pos.y) * size
            dz = -Math.round(pos.z) * size
        } else {
            if (Math.abs(pos.x) > Math.abs(pos.y) && Math.abs(pos.x) > Math.abs(pos.z))
                dx = -Math.round(pos.x) * size
            if (Math.abs(pos.y) > Math.abs(pos.z) && Math.abs(pos.y) > Math.abs(pos.x))
                dy = -Math.round(pos.y) * size
            if (Math.abs(pos.z) > Math.abs(pos.x) && Math.abs(pos.z) > Math.abs(pos.y))
                dz = -Math.round(pos.z) * size
        }
        selected = null;
        //console.log(pos)

    } else {
        var r = Math.random() * 3

        if (r < 1) {
            dx = size
            if (Math.random() < .5)
                dx = -dx;
        } else if (r < 2) {
            dy = size
            if (Math.random() < .5)
                dy = -dy;
        } else if (r < 3) {
            dz = size
            if (Math.random() < .5)
                dz = -dz;
        }
    }
    $.getJSON(API, {
        user: user,
        id: id
    }).done(function (data) {
        if (!data || !data[0]) {
            console.log('no results');
            $('.inputBox input').val("")
            $('.inputBox input').attr("placeholder", 'no results')
            $('#input').animate({color: 'red'}, 100).animate({color: 'white'}, 1000);
            if (fullMode)
                $("#input").focus();
            transferring = false;
            return;
        }

        data = data[0];

        root = new THREE.Object3D();

        db = {};

        db.id = data.id;

        if (data.profile_banner_url)
            db.bgImage = proxy + data.profile_banner_url;
        db.name = data.name;
        db.description = data.description;
        db.location = data.location;
        db.profile_image_url = proxy + data.profile_image_url.split("_normal").join("_bigger");
        db.followers_count = data.followers_count;
        db.friends_count = data.friends_count;

        var img = $('<img id="profile">');
        img.attr('src', proxy + data.profile_image_url);
        img.load(function () {
            var colorThief = new ColorThief();
            db.colors = colorThief.getPalette(img[0], 5);
            var i = 0;
            scene.add(root);
            build(root, anim);

            if (oldroot) {
                TweenMax.to(fakeScene.position, 1.5, {ease: Quart.easeIn, delay: 0.1, x: dx / 2, y: dy / 2, z: dz / 2});
                TweenMax.to(fakeScene.position, 0.0, {ease: Quart.easeIn, delay: 1.6, x: -dx / 2, y: -dy / 2, z: -dz / 2});
                TweenMax.to(fakeScene.position, 1.5, {ease: Quart.easeOut, delay: 1.6, x: 0, y: 0, z: 0});
                if (birdMesh)
                    TweenMax.to(birdMesh.scale, 1.5, {ease: Quart.easeIn, delay: 0.1, x: 0.01, y: 0.01, z: 0.01});
                if (birdMesh)
                    TweenMax.to(birdMesh.scale, 1.5, {ease: Quart.easeOut, delay: 1.6, x: 1, y: 1, z: 1});
                TweenMax.to(oldroot.position, 3, {ease: Quart.easeInOut, delay: 0.1, x: dx, y: dy, z: dz});
                TweenMax.to(oldroot.scale, 1, {ease: Quart.easeInOut, delay: 1.4, x: 0.01, y: 0.01, z: 0.01, onComplete: removeRoot, onCompleteParams: [oldroot]});
                TweenMax.from(root.position, 3, {ease: Quart.easeInOut, delay: 0.1, x: -dx, y: -dy, z: -dz});
                if (outsideSurroundings) {
                    TweenMax.to(outsideSurroundings.position, 3, {ease: Quart.easeInOut, delay: 0.1, x: outsideSurroundings.position.x + dx, y: outsideSurroundings.position.y + dy, z: outsideSurroundings.position.z + dz});
                }
                if (outsideFakeCells) {
                    TweenMax.to(outsideFakeCells.position, 3, {ease: Quart.easeInOut, delay: 0.1, x: outsideFakeCells.position.x + dx, y: outsideFakeCells.position.y + dy, z: outsideFakeCells.position.z + dz});
                }

                TweenMax.killDelayedCallsTo(screenshot);
                TweenMax.delayedCall(4, screenshot);
                if (fullMode && camDist < 4000) {

                    TweenMax.delayedCall(.35, playSwoosh)

                    TweenMax.to(rgbPass.uniforms[ "amount" ], 1.5, {ease: Quad.easeIn, delay: 0.1, value: .05});
                    TweenMax.to(rgbPass.uniforms[ "amount" ], 1.5, {ease: Quad.easeOut, delay: 1.6, value: .000});

                    if (dx != 0)
                        rgbPass.uniforms[ "angle" ].value = 0;
                    if (dy != 0)
                        rgbPass.uniforms[ "angle" ].value = Math.PI / 2;
                    if (dz != 0)
                        rgbPass.uniforms[ "angle" ].value = Math.PI / 4;

                    TweenMax.to(badTVPass.uniforms.distortion, .1, {value: 3});
                    TweenMax.to(badTVPass.uniforms.distortion2, .1, {value: 4});
                    TweenMax.to(badTVPass.uniforms.distortion, 1, {delay: .1, value: 0.01});
                    TweenMax.to(badTVPass.uniforms.distortion2, 1, {delay: .1, value: 0});
                }
            } else {
                animate();
                if (soundEnabled)
                    TweenMax.delayedCall(delay * 0, playMusic)

            }

            TweenMax.to(sceneFogColor, 1, {delay: 1, r: db.colors[1][0] / 255, g: db.colors[1][1] / 255, b: db.colors[1][2] / 255});

            TweenMax.killDelayedCallsTo(gotoRandom);
            TweenMax.delayedCall(randomJump, gotoRandom);

        });
        if (data.screen_name.toLowerCase() != 'maratropa') {
            window.history.pushState(data.screen_name, data.screen_name, '' + data.screen_name.toLowerCase());
            document.title = "Maratropa: " + data.screen_name.toLowerCase();
        }
        user = data.screen_name.toLowerCase()
        $('.inputBox input').val("")
        $('.inputBox input').attr("placeholder", "@" + user)
        if (fullMode)
            $("#input").focus();

        $.getJSON(followingAPI, {
            user: user,
            id: id
        }).done(function (data) {
            data = data;

            followingDB = data.ids;
            if (!data) {
                alert('no following');
                return;
            }
        });
    });

    i++;
}

function playSwoosh() {
    if (swooshAudio) {
        swooshAudio.volume = 1;
        swooshAudio.play();
    }
}

function playMusic() {
    backgroundAudio.play();
    backgroundAudio2.play();
}
function gotoRandom() {
    if (!followingDB || followingDB.length == 0) {
        //alert('no one')
        if (Math.random() < .3) {
            followingDB = sampleFollowingDB.slice(0);
            goto(followingDB[Math.floor(Math.random() * followingDB.length)])
        } else {
            followingDB = sampleFollowingDBIDs.slice(0);
            goto(null, followingDB[Math.floor(Math.random() * followingDB.length)])
        }
    } else {
        goto(null, followingDB[Math.floor(Math.random() * followingDB.length)])
    }


}
function goto(whouser, whoid) {
    console.log(whouser, whoid)
    if ((whouser && whouser == user) || (whoid && whoid == user) || transferring) {
        $('#input').animate({color: 'gray'}, 100).animate({color: 'white'}, 1000);
        return;
    }
    //alert(who)
    user = whouser;//who;
    id = whoid;//null;

    oldroot = root;

    create(false)
}

$('#input').on('keypress', function (event) {
    if (event.which === 13) {
        //console.log($('#input').val())
        //Disable textbox to prevent multiple submit
        //$(this).attr("disabled", "disabled");
        goto($('#input').val())

        //Do Stuff, submit, etc..
    }
});

function removeRoot(root) {
    transferring = false;
    if (root)
        scene.remove(root)
    root = null;
    oldroot = null;
}