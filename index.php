<?php
$user = null;
$id = null;
$title = 'Maratropa';
if (isset($_GET['user']) && $_GET['user'] != "") {
    $user = strtolower(htmlspecialchars($_GET['user']));
    $user = preg_replace("/[^A-Za-z0-9_]/", "", $user);
    if (strlen($user) > 30)
        $user = substr($user, 0, 30);
    $title = 'Maratropa: ' . $user;
}else if (isset($_GET['id']) && $_GET['id'] != "") {
    $id = $_GET['id'];
    $id = preg_replace("/[^0-9]/", "", $id);
} else {
    $user = 'maratropa';
    $title = 'Maratropa';
}
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <title><?php echo $title; ?></title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0">
        <meta name="description" content="An endless personal landscape" />
        <meta name="author" content="marpi" />
        <meta itemprop="name" content="<?php echo $title; ?>">
        <meta itemprop="description" content="An endless personal landscape">
        <meta itemprop="image" content="https://maratropa.com/_screen/user/<?php echo $user; ?>.jpg">
        <meta name="twitter:card" content="photo" />
        <meta name="twitter:site" content="@maratropa" />
        <meta name="twitter:title" content="<?php echo $title; ?>" />
        <meta name="twitter:image" content="https://maratropa.com/_screen/user/<?php echo $user; ?>.jpg" />
        <meta name="twitter:url" content="https://maratropa.com/<?php echo $user; ?>" />
        <meta property="og:title" content="<?php echo $title; ?>" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://maratropa.com/<?php
        if ($user != 'maratropa') {
            echo $user;
        }
        ?>" />
        <meta property="og:image" content="https://maratropa.com/_screen/user/<?php echo $user; ?>.jpg" />
        <meta property="og:description" content="An endless personal landscape" />
        
        <!-- Origin Trial Token, feature = WebVR, origin = https://maratropa.com, expires = 2017-05-23 -->
        <meta http-equiv="origin-trial" data-feature="WebVR" data-expires="2017-05-23" content="AllsQZNXgW+RjrpTaqPOOEGVewmQ5BY0GWmq07aFrOF/uE160DXT/fVpK2nyVxeNedNR1tDzXQQmsYQb3iS+kQwAAABfeyJvcmlnaW4iOiJodHRwczovL21hcmF0cm9wYS5jb206NDQzIiwiZmVhdHVyZSI6IldlYlZSIiwiZXhwaXJ5IjoxNDk1NTY4Njg4LCJpc1N1YmRvbWFpbiI6dHJ1ZX0=">
        
        <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-57x57.png">
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png">
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png">
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png">
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon-60x60.png">
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png">
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76x76.png">
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png">
        <link rel="icon" type="image/png" href="/favicon-192x192.png" sizes="192x192">
        <link rel="icon" type="image/png" href="/favicon-160x160.png" sizes="160x160">
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96">
        <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16">
        <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32">

        <link href='https://fonts.googleapis.com/css?family=Jaldi' rel='stylesheet' type='text/css'>

        <style>
            body {
                margin: 0px;
                overflow: hidden;
                font-family: 'Andale Mono', AndaleMono, monospace;
                color: #fff
            }
            .fullscreen {
                position: absolute;
                bottom:10px;
                right:10px;
                cursor: pointer;
            }
            .fullscreen:hover{
                -webkit-filter: invert(100%) !important;
            }
            #vr:hover{
                -webkit-filter: invert(100%) !important;
            }
            .marpi {
                position: absolute;
                bottom:10px;
                left:10px;
            }
            .logo {
                position: absolute;
                left:10px;
                bottom:10px;
            }
            .grabbable {
                cursor: move; /* fallback if grab cursor is unsupported */
                cursor: grab;
                cursor: -moz-grab;
                cursor: -webkit-grab;
            }

            /* (Optional) Apply a "closed-hand" cursor during drag operation. */
            .grabbable:active { 
                cursor: grabbing;
                cursor: -moz-grabbing;
                cursor: -webkit-grabbing;
            }

            .about {
                margin: 5px;
                background-color: #000;
                position: absolute;
                /* left: 38px; */
                font-size: 12px;
                width: 130px;
                line-height: 32px;
                text-align: center;
                width: 80px;
                right: 38px;
                bottom: 5px;
            }
            .about{
                color:#fff
            }
            .about:visited{
                color:#fff
            }
            .about:hover{
                color:#000;
                background-color: #fff;
            }

            .inputBox {
                margin:  5px;
                background-color: #000;
                position:absolute;
                left:38px;
                bottom:5px;
                width: 160px;
                /*width:107px;*/
            }
            .inputBox:hover{
                -webkit-filter: invert(100%) !important;
            }
            .inputBox input {
                outline: 0;
                width: 120px;
                height: 30px;
                font-family: 'Andale Mono', AndaleMono, monospace;
                background-color: #000;
                font-size: 12px;
                border: 0;
                color: #fff;
                margin-left: 8px;
                line-height: 32px;
            }
            .search{
                padding: 4px;
                /* display: inline; */
                position: absolute;
                top: 4px;
                left: 130px;
                text-decoration: none;
                color: #fff;
            }
            .search a{
                text-decoration:none;
                color: #fff;
            }
            .search a:hover{
                text-decoration:none;
                color: #fff;
            }
            .overlay{
                position:fixed; top:0; left:0; background:rgba(0,0,0,0.6); z-index:5; width:100%; height:100%;
            }
            .info a{
                color:#fff
            }
            .info a:hover{
                text-decoration: none;
            }
            .popup{
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translateX(-50%) translateY(-50%);
            }
        </style>
    </head>
    <body onkeypress="return myKeyPress(event)">

        <script src="https://demo.marpi.pl/_/scripts/demo-ui.js"></script>
        <script type="text/javascript">
            MarpiDemoUI.init( "maratropa" );
        </script>
        
        <audio id="bgAudio" style="display:none;" autoplay="false" loop="loop" src="_music/inside.mp3"></audio>
        <audio id="bgAudio2" style="display:none;" autoplay="false" loop="loop" src="_music/outside.mp3"></audio>
        <audio id="clickAudio" style="display:none;" autoplay="false" src="_music/click.mp3"></audio>
        <audio id="swooshAudio" style="display:none;" autoplay="false" src="_music/swoosh.mp3"></audio>
        <!--display:none;-->
        <div class="intro" style="display:none;"><div class="overlay"><div class="popup">
                    <h1>This is Maratropa</h1>
                    Visualize your Twitter account into
                    an abstract living and breathing city.
                    <br>
                </div></div></div>
        <div class="info" style="display:none;"><div class="overlay"><div class="popup">
                    <h1>This is Maratropa</h1>
                    An endless personal landscape of tweets.
                    Visualize and explore any Twitter account - and 
                    all their connections - as an abstract living
                    and breathing city.<br><br>

                    Maratropa was created by <a href="http://marpi.pl">Marpi</a> with design by <a href="http://ahering.com">Angelique Hering</a>.
                    <br>
                </div></div></div>
        <div class="ui" style="display:none;">
            <img src="_textures/logo.png" width="32" height="32" class="logo">
            <div class="inputBox">
                <input spellcheck="false" type="text" id="input" placeholder="@<?php echo $user; ?>" /><div class="search"><a href="javascript:goto($('#input').val())"><img src="_textures/search.png" width="16" height="16"></a></div>
            </div>
            <a href="#"><div class="about">about</div></a>
            <img src="_textures/fullscreen.png" width="32" height="32" class="fullscreen">
            <!--<a href="http://marpi.pl/">
                <img src="_textures/marpi.png" width="32" height="31" class="marpi">
            </a>-->
        </div>

        <script src="_js/libs/three.js"></script>
        <script src="_js/libs/jquery-2.1.3.js"></script>
        <script src="_js/libs/jquery-ui.js"></script>
        <script src="_js/libs/stats.min.js"></script>
        <script src="_js/libs/color-thief.min.js"></script>
        <script src="_js/libs/text.js"></script>
        <script src="_js/libs/TweenMax.min.js"></script>
        <script src="_js/libs/dat.gui.js"></script>
        <script src="_js/libs/seedrandom.js"></script>
        <script src="_js/libs/SimulationRenderer.js"></script>

        <script src="_js/controls/OrbitControls.js"></script>
        <script src="_js/controls/DeviceOrientationControls.js"></script>
        <script src="_js/libs/VRControls.js"></script>
        <script src="_js/libs/VREffect.js"></script>
        <script src="_js/libs/WebVR.js"></script>

        <script src="_js/shaders/CopyShader.js"></script>
        <script src="_js/shaders/ConvolutionShader.js"></script>
        <script src="_js/shaders/RGBShiftShader.js"></script>
        <script src="_js/shaders/BadTVShader.js"></script>
        <script src="_js/shaders/SSAOShader.js"></script>
        <script src="_js/shaders/HorizontalBlurShader.js"></script>
        <script src="_js/shaders/VerticalBlurShader.js"></script>
        <script src="_js/shaders/DustShader.js"></script>
        <script src="_js/shaders/AdditiveBlendShader.js"></script>

        <script src="_js/postprocessing/EffectComposer.js"></script>
        <script src="_js/postprocessing/RenderPass.js"></script>
        <script src="_js/postprocessing/ShaderPass.js"></script>
        <script src="_js/postprocessing/MaskPass.js"></script>
        <script src="_js/postprocessing/BloomPass.js"></script>

        <script src="_js/postprocessing/EffectComposer.js"></script>
        <script src="_js/postprocessing/RenderPass.js"></script>
        <script src="_js/postprocessing/MaskPass.js"></script>

        <script src="_js/objects.js"></script>
        <script src="_js/events.js"></script>
        <script src="_js/util.js"></script>
        <script src="_js/mobile.js"></script>
        <script src="_js/api.js"></script>
        <script src="_js/engine.js"></script>
        <script src="_js/config.js"></script>

        <!-- pass through vertex shader -->
        <script id="vertexShader" type="x-shader/x-vertex">

            void main()	{

            gl_Position = vec4( position, 1.0 );

            }

        </script>

        <!-- pass through fragment shader -->
        <script id="fragmentShader" type="x-shader/x-fragment">

            uniform vec2 resolution;
            uniform float time;
            uniform sampler2D texture;

            void main()	{

            vec2 uv = gl_FragCoord.xy / resolution.xy;

            vec3 color = texture2D( texture, uv ).xyz;

            gl_FragColor = vec4( color, 1.0 );

            }

        </script>
        <!-- end pass through shaders -->

        <!-- shader for bird's position -->
        <script id="fragmentShaderPosition" type="x-shader/x-fragment">

            uniform vec2 resolution;
            uniform float time;
            uniform float delta;
            uniform sampler2D textureVelocity;
            uniform sampler2D texturePosition;

            void main()	{

            vec2 uv = gl_FragCoord.xy / resolution.xy;
            vec4 tmpPos = texture2D( texturePosition, uv );
            vec3 position = tmpPos.xyz;
            vec3 velocity = texture2D( textureVelocity, uv ).xyz;

            float phase = tmpPos.w;

            phase = mod( ( phase + delta +
            length( velocity.xz ) * delta * 3. +
            max( velocity.y, 0.0 ) * delta * 6. ), 62.83 );

            gl_FragColor = vec4( position + velocity * delta * 15. , phase );

            }

        </script>

        <!-- shader for bird's velocity -->
        <script id="fragmentShaderVelocity" type="x-shader/x-fragment">

            uniform vec2 resolution;
            uniform float time;
            uniform float testing;
            uniform float delta; // about 0.016
            uniform float seperationDistance; // 20
            uniform float alignmentDistance; // 40
            uniform float cohesionDistance; //
            uniform float freedomFactor;
            uniform vec3 predator;


            uniform sampler2D textureVelocity;
            uniform sampler2D texturePosition;

            const float width = WIDTH;
            const float height = WIDTH;

            const float PI = 3.141592653589793;
            const float PI_2 = PI * 2.0;
            // const float VISION = PI * 0.55;

            float zoneRadius = 40.0;
            float zoneRadiusSquared = zoneRadius * zoneRadius;

            float separationThresh = 0.45;
            float alignmentThresh = 0.65;

            const float UPPER_BOUNDS = 400.0;
            const float LOWER_BOUNDS = -UPPER_BOUNDS;

            const float SPEED_LIMIT = 9.0;

            float rand(vec2 co){
            return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
            }

            void main()	{

            zoneRadius = seperationDistance + alignmentDistance + cohesionDistance;
            separationThresh = seperationDistance / zoneRadius;
            alignmentThresh = ( seperationDistance + alignmentDistance ) / zoneRadius;
            zoneRadiusSquared = zoneRadius * zoneRadius;


            vec2 uv = gl_FragCoord.xy / resolution.xy;
            vec3 birdPosition, birdVelocity;

            vec3 selfPosition = texture2D( texturePosition, uv ).xyz;
            vec3 selfVelocity = texture2D( textureVelocity, uv ).xyz;

            float dist;
            vec3 dir; // direction
            float distSquared;

            float seperationSquared = seperationDistance * seperationDistance;
            float cohesionSquared = cohesionDistance * cohesionDistance;

            float f;
            float percent;

            vec3 velocity = selfVelocity;

            float limit = SPEED_LIMIT;

            dir = predator * UPPER_BOUNDS - selfPosition;
            dir.z = 0.;
            // dir.z *= 0.6;
            dist = length( dir );
            distSquared = dist * dist;

            float preyRadius = 150.0;
            float preyRadiusSq = preyRadius * preyRadius;


            // move birds away from predator
            if (dist < preyRadius) {

            f = ( distSquared / preyRadiusSq - 1.0 ) * delta * 100.;
            velocity += normalize( dir ) * f;
            limit += 5.0;
            }


            // if (testing == 0.0) {}
            // if ( rand( uv + time ) < freedomFactor ) {}


            // Attract flocks to the center
            vec3 central = vec3( 0., 0., 0. );
            dir = selfPosition - central;
            dist = length( dir );

            dir.y *= 2.5;
            velocity -= normalize( dir ) * delta * 5.;

            for (float y=0.0;y<height;y++) {
            for (float x=0.0;x<width;x++) {

            vec2 ref = vec2( x + 0.5, y + 0.5 ) / resolution.xy;
            birdPosition = texture2D( texturePosition, ref ).xyz;

            dir = birdPosition - selfPosition;
            dist = length(dir);

            if (dist < 0.0001) continue;

            distSquared = dist * dist;

            if (distSquared > zoneRadiusSquared ) continue;

            percent = distSquared / zoneRadiusSquared;

            if ( percent < separationThresh ) { // low

            // Separation - Move apart for comfort
            f = (separationThresh / percent - 1.0) * delta;
            velocity -= normalize(dir) * f;

            } else if ( percent < alignmentThresh ) { // high

            // Alignment - fly the same direction
            float threshDelta = alignmentThresh - separationThresh;
            float adjustedPercent = ( percent - separationThresh ) / threshDelta;

            birdVelocity = texture2D( textureVelocity, ref ).xyz;

            f = ( 0.5 - cos( adjustedPercent * PI_2 ) * 0.5 + 0.5 ) * delta;
            velocity += normalize(birdVelocity) * f;

            } else {

            // Attraction / Cohesion - move closer
            float threshDelta = 1.0 - alignmentThresh;
            float adjustedPercent = ( percent - alignmentThresh ) / threshDelta;

            f = ( 0.5 - ( cos( adjustedPercent * PI_2 ) * -0.5 + 0.5 ) ) * delta;

            velocity += normalize(dir) * f;

            }

            }

            }



            // this make tends to fly around than down or up
            // if (velocity.y > 0.) velocity.y *= (1. - 0.2 * delta);

            // Speed Limits
            if ( length( velocity ) > limit ) {
            velocity = normalize( velocity ) * limit;
            }

            gl_FragColor = vec4( velocity, 1.0 );

            }

        </script>

        <script type="x-shader/x-vertex" id="birdVS">

            attribute vec2 reference;
            attribute float birdVertex;

            attribute vec3 birdColor;

            uniform sampler2D texturePosition;
            uniform sampler2D textureVelocity;

            varying vec4 vColor;
            varying float z;

            uniform float time;

            void main() {

            vec4 tmpPos = texture2D( texturePosition, reference );
            vec3 pos = tmpPos.xyz;
            vec3 velocity = normalize(texture2D( textureVelocity, reference ).xyz);

            vec3 newPosition = position;

            if ( birdVertex == 4.0 || birdVertex == 7.0 ) {
            // flap wings
            newPosition.y = sin( tmpPos.w ) * 5.;
            }

            newPosition = mat3( modelMatrix ) * newPosition;


            velocity.z *= -1.;
            float xz = length( velocity.xz );
            float xyz = 1.;
            float x = sqrt( 1. - velocity.y * velocity.y );

            float cosry = velocity.x / xz;
            float sinry = velocity.z / xz;

            float cosrz = x / xyz;
            float sinrz = velocity.y / xyz;

            mat3 maty =  mat3(
            cosry, 0, -sinry,
            0    , 1, 0     ,
            sinry, 0, cosry

            );

            mat3 matz =  mat3(
            cosrz , sinrz, 0,
            -sinrz, cosrz, 0,
            0     , 0    , 1
            );

            newPosition =  maty * matz * newPosition;
            newPosition += pos;

            z = newPosition.z;

            vColor = vec4( birdColor, 1.0 );
            gl_Position = projectionMatrix *  viewMatrix  * vec4( newPosition, 1.0 );
            }

        </script>

        <!-- bird geometry shader -->
        <script type="x-shader/x-fragment" id="birdFS">

            varying vec4 vColor;
            varying float z;

            uniform vec3 color;

            void main() {
            // Fake colors for now
            float z2 = 0.2 + ( 1000. - z ) / 1000. * vColor.x;
            gl_FragColor = vec4( z2, z2, z2, 1. );

            }

        </script>

        <script id="vs" type="x-shader/x-vertex">

            varying vec2 vUv;

            void main() {

            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

            }

        </script>

        <script id="fs" type="x-shader/x-fragment">

            uniform sampler2D map;

            uniform vec3 fogColor;
            uniform float fogNear;
            uniform float fogFar;

            varying vec2 vUv;

            void main() {

            float depth = gl_FragCoord.z / gl_FragCoord.w;
            float fogFactor = smoothstep( fogNear, fogFar, depth );

            gl_FragColor = texture2D( map, vUv );
            gl_FragColor.w *= pow( gl_FragCoord.z, 20.0 );
            gl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );

            }

        </script>


        <script>
        var user = "<?php echo $user; ?>";
        var id = "<?php echo $id; ?>";

        if (soundEnabled)
            initAudio()
        $(document).ready(function () {
            init();
            staticObjects()
            //fakeCells(scene)
            create(root, true)
        });


        </script>

        <script>
            (function (i, s, o, g, r, a, m) {
                i['GoogleAnalyticsObject'] = r;
                i[r] = i[r] || function () {
                    (i[r].q = i[r].q || []).push(arguments)
                }, i[r].l = 1 * new Date();
                a = s.createElement(o),
                        m = s.getElementsByTagName(o)[0];
                a.async = 1;
                a.src = g;
                m.parentNode.insertBefore(a, m)
            })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

            ga('create', 'UA-873340-24', 'auto');
            ga('send', 'pageview');

        </script>

    </body>
</html>
