import THREE from 'libs/engines/3d/three'
import Unit from 'libs/engines/3d/Unit'
import isTouchDevice from 'libs/utils/isTouchDevice'

import modelLoader from 'libs/engines/3d/modelLoader'
import AstronautModel from 'libs/engines/3d/models/Astronaut.glb'
import VoxelGuyModel from 'libs/engines/3d/models/VoxelGuy.glb'
import WomanModel from 'libs/engines/3d/models/Woman.glb'


const ArenaRadius = 300
const modelZOffset = -2
const minPosition = new THREE.Vector3(-ArenaRadius, -ArenaRadius, -ArenaRadius)
const maxPosition = new THREE.Vector3( ArenaRadius,  ArenaRadius,  ArenaRadius)
const xAxis = new THREE.Vector3(1, 0, 0)
const yAxis = new THREE.Vector3(0, 1, 0)
const zAxis = new THREE.Vector3(0, 0, 1)

var nextPos = new THREE.Vector3(0, 0, 0)
var cameraAngleX = 0
var cameraAngleConrolsApplied = new THREE.Vector2(0, 0)
var moveCameraAngleApplied = new THREE.Vector3()
var cameraToTarget = new THREE.Vector3()
var modelQuaternion = new THREE.Quaternion()
var tmpVector = new THREE.Vector3()

const models = [
  {
    file: VoxelGuyModel,
    scale: 5,
  },
  {
    file: AstronautModel,
    scale: 1.25,
  },
  {
    file: WomanModel,
    scale: 3,
  },
]


export default class Character extends Unit {
  constructor(props) {
    super(props)

    this.loadModel()
  }

  loadModel = async () => {
    const randomModel = models[Math.round(Math.random() * (models.length - 1))]

    this.gtlf = await modelLoader(randomModel.file)
    this.model = this.gtlf.scene
    this.mixer = new THREE.AnimationMixer( this.gtlf.scene )
    this.action = this.mixer.clipAction( this.gtlf.animations[ 0 ] )
    this.action.play()

    this.model.scale.set(randomModel.scale, randomModel.scale, randomModel.scale)

    this.props.scene.add(this.model)
  }

  animate = props => {
    if (!this.model)
      return
    
    cameraAngleX +=
      props.input.move.z > 0 ?
        props.input.move.angleTo(zAxis) / 150 * Math.sign(props.input.move.x)
        :
        (Math.PI - props.input.move.angleTo(zAxis)) / 150 * Math.sign(props.input.move.x)

    if (!isTouchDevice())
      cameraAngleConrolsApplied.set(
        props.input.mouse.alphaX * Math.PI * 1.5 + cameraAngleX,
        props.input.mouse.alphaY * Math.PI / 12
      )
    else
      cameraAngleConrolsApplied.set(cameraAngleX, -Math.PI / 16)

    moveCameraAngleApplied
      .copy(props.input.move)
        .applyAxisAngle(yAxis, cameraAngleConrolsApplied.x)

    nextPos.copy(this.model.position)
      .add(moveCameraAngleApplied)
    nextPos.clamp(minPosition, maxPosition)

    let collisionFlag = false
    const trees = props.units?.Landscape?.trees

    if (trees)
      for (let i = 0; i < trees.length && !collisionFlag; i++) {
        const distance = nextPos.distanceTo(trees[i].position)

        if (distance < trees[i].scale * 1.25)
          collisionFlag = true
      }

    if (!collisionFlag) {
      this.model.position.copy(nextPos)
      if (props.input.move.length() > .01)
        this.mixer.update(props.clock.getDelta())
    }

    if (props.input.move.length() > 0)
      this.model.quaternion.slerp(
        modelQuaternion
          .setFromUnitVectors(zAxis, moveCameraAngleApplied.normalize())
        , .135)

    cameraToTarget = (new THREE.Vector3(0, 0, -15))
      .applyAxisAngle(xAxis, cameraAngleConrolsApplied.y)
      .applyAxisAngle(yAxis, cameraAngleConrolsApplied.x)

    this.props.controls.target.copy(this.model.position)
    this.props.controls.target.setY(5)
    this.props.camera.position.copy(tmpVector.copy(this.props.controls.target).add(cameraToTarget))
  }

  dispose = () => {}
}
