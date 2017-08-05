/**
 * @author felixturner / http://airtight.cc/
 *
 * Bad TV Shader
 * Simulates a bad TV via horizontal distortion and vertical roll
 * Uses Ashima WebGl Noise: https://github.com/ashima/webgl-noise
 *
 * time: steadily increasing float passed in
 * distortion: amount of thick distortion
 * distortion2: amount of fine grain distortion
 * speed: distortion vertical travel speed
 * rollSpeed: vertical roll speed
 */

THREE.DustShader = {
    uniforms: {
        "overlayResolution": {type: "v2", value: new THREE.Vector2()},
        "resolution": {type: "v2", value: new THREE.Vector2()},
        "tick": {type: "f", value: 0.0},
        "intensity": {type: "f", value: 1.0},
        "tDiffuse": {type: "t", value: null},
        "tLookup": {type: "t", value: null},
        "tOverlay": {type: "t", value: null},
    },
    vertexShader: "uniform vec2 overlayResolution;\n" +
            "uniform vec2 resolution;\n" +
            "varying vec2 vUv;\n" +
            "varying vec2 overlayUV;\n" +
            "void main() {\n" +
            "  vUv = uv;\n" +
            "  float aspect = overlayResolution.x / overlayResolution.y;\n" +
            "  float ratio = resolution.x / resolution.y;\n" +
            "  overlayUV = uv;\n" +
            "  float tAspect = overlayResolution.x / overlayResolution.y;\n" +
            "  float pAspect = resolution.x / resolution.y;\n" +
            "  overlayUV = uv;\n" +
            "  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);\n" +
            "}",
    fragmentShader: "uniform float tick;\n" +
            "uniform float intensity;\n" +
            "uniform sampler2D tDiffuse;\n" +
            "uniform sampler2D tLookup;\n" +
            "uniform sampler2D tOverlay;\n" +
            "varying vec2 vUv;\n" +
            "varying vec2 overlayUV;\n" +
            "highp float a_x_random(vec2 co) {\n" +
            "  highp float a = 12.9898;\n" +
            "  highp float b = 78.233;\n" +
            "  highp float c = 43758.5453;\n" +
            "  highp float dt = dot(co.xy, vec2(a, b));\n" +
            "  highp float sn = mod(dt, 3.14);\n" +
            "  return fract(sin(sn) * c);\n" +
            "}\n" +
            "vec3 b_x_blendOverlay(vec3 base, vec3 blend) {\n" +
            "  return vec3(base.r < 0.5 ? (2.0 * base.r * blend.r) : (1.0 - 2.0 * (1.0 - base.r) * (1.0 - blend.r)), base.g < 0.5 ? (2.0 * base.g * blend.g) : (1.0 - 2.0 * (1.0 - base.g) * (1.0 - blend.g)), base.b < 0.5 ? (2.0 * base.b * blend.b) : (1.0 - 2.0 * (1.0 - base.b) * (1.0 - blend.b)));\n" +
            "}\n" +
            "float c_x_luma(vec3 color) {\n" +
            "  return dot(color, vec3(0.299, 0.587, 0.114));\n" + 
            //"  return dot(color, vec3(0.1, 0.1, 0.1));\n" +
            "}\n" +
            "float c_x_luma(vec4 color) {\n" +
            "  return dot(color.rgb, vec3(0.299, 0.587, 0.114));\n" +
            "}\n" +
            "#define LUT_FLIP_Y\n" +
            "\n" +
            "vec4 e_x_lookup(in vec4 textureColor, in sampler2D lookupTable) {\n" +
            "  \n" +
            "  #ifndef LUT_NO_CLAMP\n" +
            "  textureColor = clamp(textureColor, 0.0, 1.0);\n" +
            "  #endif\n" +
            "  mediump float blueColor = textureColor.b * 63.0;\n" +
            "  mediump vec2 quad1;\n" +
            "  quad1.y = floor(floor(blueColor) / 8.0);\n" +
            "  quad1.x = floor(blueColor) - (quad1.y * 8.0);\n" +
            "  mediump vec2 quad2;\n" +
            "  quad2.y = floor(ceil(blueColor) / 8.0);\n" +
            "  quad2.x = ceil(blueColor) - (quad2.y * 8.0);\n" +
            "  highp vec2 texPos1;\n" +
            "  texPos1.x = (quad1.x * 0.125) + 0.5 / 512.0 + ((0.125 - 1.0 / 512.0) * textureColor.r);\n" +
            "  texPos1.y = (quad1.y * 0.125) + 0.5 / 512.0 + ((0.125 - 1.0 / 512.0) * textureColor.g);\n" +
            "  #ifdef LUT_FLIP_Y\n" +
            "  texPos1.y = 1.0 - texPos1.y;\n" +
            "  #endif\n" +
            "  highp vec2 texPos2;\n" +
            "  texPos2.x = (quad2.x * 0.125) + 0.5 / 512.0 + ((0.125 - 1.0 / 512.0) * textureColor.r);\n" +
            "  texPos2.y = (quad2.y * 0.125) + 0.5 / 512.0 + ((0.125 - 1.0 / 512.0) * textureColor.g);\n" +
            "  #ifdef LUT_FLIP_Y\n" +
            "  texPos2.y = 1.0 - texPos2.y;\n" +
            "  #endif\n" +
            "  lowp vec4 newColor1 = texture2D(lookupTable, texPos1);\n" +
            "  lowp vec4 newColor2 = texture2D(lookupTable, texPos2);\n" +
            "  lowp vec4 newColor = mix(newColor1, newColor2, fract(blueColor));\n" +
            "  return newColor;\n" +
            "}\n" +
            "void main() {\n" +
            "  vec3 texColor = texture2D(tDiffuse, vUv).rgb;\n" +
            "  float luminance = c_x_luma(texColor);\n" +
            "  float noiseMap = smoothstep(luminance, 0.5, 0.0);\n" +
            "  vec2 tUv = vUv + tick;\n" +
            "  vec3 noise = vec3(a_x_random(tUv), a_x_random(tUv * 1.5), a_x_random(tUv * 0.5));\n" +
            "  vec3 noiseColor = mix(noise, vec3(0.5), noiseMap);\n" +
            "  vec3 color = mix(texColor, b_x_blendOverlay(texColor, noise), 0.1);\n" +
            //"  vec3 color = texColor;\n" +
            "  vec3 corrected = e_x_lookup(vec4(color, 1.0), tLookup).rgb;\n" +
            //"  color = mix(color, corrected, 0.9);\n" +
            "  gl_FragColor = vec4(color, 1.0);\n" +
            "  vec4 scratches = texture2D(tOverlay, overlayUV);\n" +
            "  vec3 scratchBlend = gl_FragColor.rgb + intensity*scratches.rgb;\n" +
            //"  float center = smoothstep(0.0, 0.6, length(vUv - 0.5));\n" +
            "  float center = smoothstep(0.0, 0.6, length(vUv - 1.0));\n" +
            "  float dirtMap = smoothstep(0.0, 0.4, luminance * center);\n" +
            "  gl_FragColor.rgb = mix(gl_FragColor.rgb, scratchBlend, dirtMap);}"



};
