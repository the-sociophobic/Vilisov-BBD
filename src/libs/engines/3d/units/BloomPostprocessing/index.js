// import { UnrealBloomPass } from './customUnrealBloomPass'
import { BloomEffect, EffectComposer, EffectPass, RenderPass } from 'postprocessing'
import Unit from 'libs/engines/3d/Unit'


export default class BloomPostprocessing extends Unit {
  constructor(props) {
    super(props)

    const {
      renderer,
      camera,
      composer,
      THREE,
    } = props

    // this.params = [
    //   .5,
    //   1,
    //   1,
    // ]
    // this.pass = new UnrealBloomPass(
    //   new THREE.Vector2(renderer.getSize(new THREE.Vector2()).x, renderer.getSize(new THREE.Vector2()).y),
    //   ...this.params
    // )
    this.pass = new EffectPass(camera, new BloomEffect())
    composer.addPass(this.pass)
  }

  animate = props => {
    // this.pass.strength = this.params[0]
    // this.pass.radius = this.params[1]
    // this.pass.threshold = this.params[2]
  }
  dispose = () => {}
}
