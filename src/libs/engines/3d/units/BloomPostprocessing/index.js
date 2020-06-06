import { UnrealBloomPass } from './customUnrealBloomPass'
import Unit from '~/src/libs/engines/3d/Unit'


export default class BloomPostprocessing extends Unit {
  constructor(props) {
    super(props)

    const {
      renderer,
      composer
    } = props

    composer.addPass(
      new UnrealBloomPass(
        new THREE.Vector2(renderer.getSize().x, renderer.getSize().y),
        .5,
        .1,
        .85
      ))
  }

  animate = props => {}
  dispose = () => {}
}
