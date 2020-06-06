import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import Unit from '~/src/libs/engines/3d/Unit'


const vertShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`
const fragShader = `
  uniform sampler2D tDiffuse;
  uniform vec2 u_resolution;
  varying vec2 vUv;

  void main() {
    vec2 pos = gl_FragCoord.xy / u_resolution.xy - 1.0;
    float alpha = clamp(pow(abs(pos.x) * pos.x * pos.x + abs(pos.y) * pos.y * pos.y, 0.5), 0.0, 1.0);

    vec4 color = texture2D( tDiffuse, vUv );
    vec3 backgroundColor = vec3(0.5, 0.5, 0.5);
    color.rgb = color.rgb * (1.0 - alpha) + backgroundColor * alpha;
    color.rgb = color.rgb * color.a + backgroundColor * (1.0 - color.a);
    gl_FragColor = vec4(color.rgb, 1.0);
  }
`


export default class VignettePostprocessing extends Unit {
  constructor(props) {
    super(props)

    this.uselessVec2 = new props.THREE.Vector2()

    const vignetteEffect = {
      uniforms: {
        "tDiffuse": { value: null },
        "u_resolution": {type: "v2", value: props.renderer.getSize(this.uselessVec2)}
      },
      vertexShader: vertShader,
      fragmentShader: fragShader,
    }
    
    this.vignetteShader = new ShaderPass(vignetteEffect)
    props.composer.addPass(this.vignetteShader)
  }

  animate = props =>
    this.vignetteShader.uniforms &&
      (this.vignetteShader.uniforms["u_resolution"].value =
        (this.props.renderer.getSize(this.uselessVec2)))

  dispose = () => {}
}
