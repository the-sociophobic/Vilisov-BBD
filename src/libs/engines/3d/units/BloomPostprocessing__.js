import { EffectPass, BloomEffect } from 'postprocessing'
import Unit from '~/src/libs/engines/3d/Unit'


export default class BloomPostprocessing extends Unit {
  constructor(props) {
    super(props)

    const {
      camera,
      composer
    } = props

    composer.addPass(new EffectPass(camera, new BloomEffect()))
  }

  animate = props => {}
  dispose = () => {}
}
