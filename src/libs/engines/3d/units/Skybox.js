import Unit from '../Unit'

export default class Skybox extends Unit {
  constructor(props) {
    super(props)
    const { THREE, scene } = props

    //COMMENT: Задний фон
    scene.background = new THREE.Color( 0x666671 )
  }
  animate() {}
  dispose() {}
}
