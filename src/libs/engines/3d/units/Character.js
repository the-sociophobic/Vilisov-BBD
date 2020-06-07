import THREE from 'libs/engines/3d/three'
import Unit from 'libs/engines/3d/Unit'
import modelLoader from 'libs/engines/3d/modelLoader'
import AstronautModel from 'libs/engines/3d/models/Astronaut.glb'


const ArenaRadius = 10
const minPosition = new THREE.Vector3(-ArenaRadius, -ArenaRadius, -ArenaRadius)
const maxPosition = new THREE.Vector3( ArenaRadius,  ArenaRadius,  ArenaRadius)
const xAxis = new THREE.Vector3(1, 0, 0)
const yAxis = new THREE.Vector3(0, 1, 0)
// const zAxis = new THREE.Vector3(0, 0, 1)


export default class Character extends Unit {
  constructor(props) {
    super(props)

    this.loadModel()
  }

  loadModel = async () =>
    this.props.scene
      .add(this.model = await modelLoader(AstronautModel))

  animate = props => {
    if (!this.model)
      return

    this.model.position
      .add(props.input.move.clone()
        .applyAxisAngle(yAxis, props.input.mouse.alphaX * Math.PI * 2))
    this.model.position.clamp(minPosition, maxPosition)

    this.model.quaternion.slerp(
      (new THREE.Quaternion()).setFromAxisAngle(yAxis, props.input.mouse.alphaX * Math.PI * 2)
      , .1)

    const cameraToTarget = (new THREE.Vector3(0, 0, -15))
      .applyAxisAngle(xAxis, (props.input.mouse.alphaY + .5) * Math.PI / 4)
      .applyAxisAngle(yAxis, props.input.mouse.alphaX * Math.PI * 2)

    this.props.controls.target.copy(this.model.position)
    this.props.camera.position.copy(this.props.controls.target.clone().add(cameraToTarget))
  }

  dispose = () => {}
}
