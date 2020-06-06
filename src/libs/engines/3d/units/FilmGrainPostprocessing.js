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
  uniform float amount;
  uniform sampler2D tDiffuse;
  varying vec2 vUv;

  float random( vec2 p )
  {
    vec2 K1 = vec2(
      23.14069263277926,
      2.665144142690225
    );
    return fract( cos( dot(p,K1) ) * 12345.6789 );
  }

  void main() {

    vec4 color = texture2D( tDiffuse, vUv );
    vec2 uvRandom = vUv;
    uvRandom.y *= random(vec2(uvRandom.y,amount));
    color.rgb += random(uvRandom) * 0.1;
    gl_FragColor = vec4( color );
  }
`


export default class FilmGrainPostprocessing extends Unit {
  constructor(props) {
    super(props)

    const filmGrainEffect = {
      uniforms: {
        "tDiffuse": { value: null },
        "amount": { value: 1 }
      },
      vertexShader: vertShader,
      fragmentShader: fragShader,
    }
    
    this.filmGrainShader = new ShaderPass(filmGrainEffect)
    props.composer.addPass(this.filmGrainShader)
  }

  animate = props =>
    this.filmGrainShader.uniforms && (this.filmGrainShader.uniforms["amount"].value = props.frameNumber)

  dispose = () => {}
}
