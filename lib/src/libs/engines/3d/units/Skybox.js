import Unit from 'libs/engines/3d/Unit'

import top from 'img/skybox/top.png'
import bottom from 'img/skybox/bottom.png'

export default class Skybox extends Unit {
  constructor(props) {
    super(props)
    const { THREE, scene } = props

    //COMMENT: Задний фон в виде бокса
    scene.background = new THREE.CubeTextureLoader()
      .load( [ bottom, bottom, top, bottom, bottom, bottom ] );
  }
  animate() {}
  dispose() {}
}
