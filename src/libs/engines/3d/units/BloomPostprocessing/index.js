// import { UnrealBloomPass } from './customUnrealBloomPass'
import { BloomEffect, EffectPass } from 'postprocessing'
import Unit from 'libs/engines/3d/Unit'


export default class BloomPostprocessing extends Unit {
  constructor(props) {
    super(props)

    const {
      camera,
      composer,
    } = props

    this.bloom = new BloomEffect()
    //ВОТ ТУТ РЕДАКТИРОВАТЬ БЛУМ
    this.bloom.intensity = 1

    this.pass = new EffectPass(camera, this.bloom)
    composer.addPass(this.pass)
  }

  animate = props => {}
  dispose = () => {}
}
