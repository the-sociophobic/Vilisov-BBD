import clamp from 'clamp'
import THREE from 'libs/engines/3d/three'
import Unit from 'libs/engines/3d/Unit'
import modelLoader from 'libs/engines/3d/modelLoader'
import AstronautModel from 'libs/engines/3d/models/Astronaut.glb'


const ArenaRadius = 300
const minPosition = new THREE.Vector3(-ArenaRadius, -ArenaRadius, -ArenaRadius)
const maxPosition = new THREE.Vector3( ArenaRadius,  ArenaRadius,  ArenaRadius)
const xAxis = new THREE.Vector3(1, 0, 0)
const yAxis = new THREE.Vector3(0, 1, 0)
// const zAxis = new THREE.Vector3(0, 0, 1)

var move = new THREE.Vector3(0, 0, 0)
var nextPos = new THREE.Vector3(0, 0, 0)
var cameraAngle = new THREE.Vector2(0, 0)
var cameraToTarget = new THREE.Vector3()
var modelQuaternion = new THREE.Quaternion()

var aaaa = true
export default class Character extends Unit {
  constructor(props) {
    super(props)

    this.loadModel()
  }

  loadModel = async () => {
    this.model = await modelLoader(AstronautModel)
    this.props.scene.add(this.model)
    this.model.scale.set(2, 2, 2)
    this.model.position.setY(.05)
  }

  animate = props => {
    if (!this.model)
      return

    cameraAngle.set(
      (cameraAngle.x + props.input.mouse.alphaX / 7) % (Math.PI * 2),
      clamp(cameraAngle.y + props.input.mouse.alphaY / 15, 0, Math.PI / 3)
    )

    this.updateMove(props.input)

    
    nextPos.copy(this.model.position)
      .add(move.clone()
        .applyAxisAngle(yAxis, cameraAngle.x))
    nextPos.clamp(minPosition, maxPosition)

    let collisionFlag = false
    const trees = props.units?.Landscape?.trees

    if (trees)
      for (let i = 0; i < trees.length && !collisionFlag; i++) {
        const distance = nextPos.distanceTo(trees[i].position)

        if (distance < trees[i].scale * 1.25)
          collisionFlag = true
      }

    if (!collisionFlag)
      this.model.position.copy(nextPos)

    this.model.quaternion.slerp(
      modelQuaternion.setFromAxisAngle(yAxis, cameraAngle.x)
      , .1)

    cameraToTarget = (new THREE.Vector3(0, 0, -15))
      .applyAxisAngle(xAxis, cameraAngle.y - Math.PI / 16)
      .applyAxisAngle(yAxis, cameraAngle.x)

    this.props.controls.target.copy(this.model.position)
    this.props.controls.target.setY(5)
    this.props.camera.position.copy(this.props.controls.target.clone().add(cameraToTarget))
  }

  updateMove = input => {
    const getDirectionState = direction =>
      direction
        .map(key => key.pressed)
        .reduce((a, b) => a || b)
      ? 1 : 0

    move.setX(
      (getDirectionState(input.moveFlags.right) - getDirectionState(input.moveFlags.left)) * .35)
    move.setZ(
      (getDirectionState(input.moveFlags.up) - getDirectionState(input.moveFlags.down)) * .35)
  }


  dispose = () => {}
}
