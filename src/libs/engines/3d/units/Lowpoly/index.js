import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import Unit from '~/src/libs/engines/3d/Unit'
import modelGLTF from './models/model.glb'


export default class Lowpoly extends Unit {
  constructor(props) {
    super(props)

    const { scene, THREE } = props
    var that = this

    var manager = new THREE.LoadingManager()
    manager 
      const loader = new GLTFLoader()
      .load(modelGLTF, gltf => {
        that.object = gltf.scene

        //COMMENT: Изначальное положение модели на экране
        const aspect = Math.min(props.camera.aspect, 1) ** .5
        that.object.scale.multiplyScalar(4 * aspect)
        that.object.translateZ(-2 / aspect)
        that.object.translateY(-14.5 * aspect)

        scene.add(that.object)
      })
  }

  animate = props => {}

  dispose = () => {}
}
