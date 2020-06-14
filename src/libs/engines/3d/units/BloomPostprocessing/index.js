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
    this.pass = new EffectPass(camera, this.bloom)
    composer.addPass(this.pass)
  }

  animate = props => {
    // this.pass.strength = this.params[0]
    // this.pass.radius = this.params[1]
    // this.pass.threshold = this.params[2]
  }
  dispose = () => {}
}
