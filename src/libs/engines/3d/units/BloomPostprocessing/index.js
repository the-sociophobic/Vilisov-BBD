import { UnrealBloomPass } from './customUnrealBloomPass'
import Unit from 'libs/engines/3d/Unit'


export default class BloomPostprocessing extends Unit {
  constructor(props) {
    super(props)

    const {
      renderer,
      composer,
      THREE,
    } = props

    this.params = [
      1.5,
      1.6,
      0.01,
    ]
    this.pass = new UnrealBloomPass(
      new THREE.Vector2(renderer.getSize(new THREE.Vector2()).x, renderer.getSize(new THREE.Vector2()).y),
      ...this.params
    )
    composer.addPass(this.pass)
    console.log(this.pass)
  }

  animate = props => {
    this.pass.strength = this.params[0]
    this.pass.radius = this.params[1]
    this.pass.threshold = this.params[2]
  }
  dispose = () => {}
}
