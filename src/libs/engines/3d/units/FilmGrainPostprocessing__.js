import { EffectPass, VignetteEffect } from 'postprocessing'
import Unit from '~/src/libs/engines/3d/Unit'


export default class FilmGrainPostprocessing extends Unit {
  constructor(props) {
    super(props)
    
    var a = new VignetteEffect()
    a.darkness = 1
    props.composer.addPass(new EffectPass(props.camera, a))
  }

  animate = props => {}
  dispose = () => {}
}
