import { UnrealBloomPass } from './customUnrealBloomPass'
import Unit from '~/src/libs/engines/3d/Unit'


export default class BloomPostprocessing extends Unit {
  constructor(props) {
    super(props)

    const {
      renderer,
      composer,
      THREE,
    } = props

    this.pass = new UnrealBloomPass(
      new THREE.Vector2(renderer.getSize(new THREE.Vector2()).x, renderer.getSize(new THREE.Vector2()).y),
      1.5,
      1.5,
      0.01,
    )
    composer.addPass(this.pass)
  }

  animate = props => {}
  dispose = () => {}
}
