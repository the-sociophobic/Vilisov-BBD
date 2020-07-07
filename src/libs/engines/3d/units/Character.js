import THREE from 'libs/engines/3d/three'
import Unit from 'libs/engines/3d/Unit'
import isTouchDevice from 'libs/utils/isTouchDevice'

import modelLoader from 'libs/engines/3d/modelLoader'
import AstronautModel from 'libs/engines/3d/models/Astronaut.glb'
import VoxelGuyModel from 'libs/engines/3d/models/VoxelGuy.glb'
import WomanModel from 'libs/engines/3d/models/Woman.glb'
import footstep0 from 'sounds/footstep0.mp3'
import footstep1 from 'sounds/footstep1.mp3'


const ArenaRadius = 300
const modelXOffset = 5
const modelXOffsetTouch = .1
const getModelOffset = () =>
  isTouchDevice() || window.innerWidth < 1200 ?
    modelXOffsetTouch : modelXOffset
var modelOffset = new THREE.Vector3(getModelOffset(), 0, 0)
const slowerAnimation = .1

const initialJumpForce = 550
const jumpScale = .002

const minPosition = new THREE.Vector3(-ArenaRadius, 0,           -ArenaRadius)
const maxPosition = new THREE.Vector3( ArenaRadius, ArenaRadius,  ArenaRadius)
const xAxis = new THREE.Vector3(1, 0, 0)
const yAxis = new THREE.Vector3(0, 1, 0)
const zAxis = new THREE.Vector3(0, 0, 1)

var nextPos = new THREE.Vector3(0, 0, 0)
var nextPosCollision = new THREE.Vector3(0, 0, 0)

const collisionK = .5
var distanceToTree = new THREE.Vector3(0, 0, 0)
var treesCollisionForces = new THREE.Vector3(0, 0, 0)

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
    animationScale: 5,
  },
  {
    file: AstronautModel,
    scale: 1.25,
    animationScale: 4.2,
  },
  {
    file: WomanModel,
    scale: 3,
    animationScale: 3.8,
  },
]


export default class Character extends Unit {
  constructor(props) {
    super(props)

    this.loadModel()

    this.firstFlag = true

    this.footstep0 = new Audio(footstep0)
    this.footstep1 = new Audio(footstep1)
    this.footstep0Interval = undefined
    this.footstep1Interval = undefined

    this.jumping = false
    this.jumpingForce = new THREE.Vector3(0, 0, 0)
  }

  loadModel = async () => {
    const randomModel = models[Math.round(Math.random() * (models.length - 1))]

    this.gtlf = await modelLoader(randomModel.file)
    this.model = this.gtlf.scene
    this.mixer = new THREE.AnimationMixer( this.gtlf.scene )
    this.action = this.mixer.clipAction( this.gtlf.animations[ 0 ] )
    this.action.play()

    this.model.position.set(getModelOffset(), 0, 0)
    this.model.scale.set(randomModel.scale, randomModel.scale, randomModel.scale)

    this.props.scene.add(this.model)
  }

  startStepsSounds = () => {
    const interval = Math.round(1250 / this.mixer.timeScale)

    if (!this.footstep0Interval) {
      this.footstep0.currentTime = 0
      this.footstep0.play()
      this.footstep0Interval = setInterval(() => {
        this.footstep0.currentTime = 0
        this.footstep0.play()
      }, interval)
    }
    if (!this.footstep1Interval && !this.footstep1Timeout) {
      this.footstep1Timeout = setTimeout(() => {
        this.footstep1.currentTime = 0
        this.footstep1.play()
        this.footstep1Interval = setInterval(() => {
          this.footstep1.currentTime = 0
          this.footstep1.play()
        }, interval)
      }, Math.round(interval / 2))
    }
  }
  stopStepsSounds = () => {
    if (this.footstep0Interval) {
      clearInterval(this.footstep0Interval)
      this.footstep0Interval = undefined
    }
    if (this.footstep1Interval) {
      clearInterval(this.footstep1Interval)
      this.footstep1Interval = undefined
    }
    if (this.footstep1Timeout) {
      clearTimeout(this.footstep1Timeout)
      this.footstep1Timeout = undefined
    }
  }

  animate = props => {
    //COMPLETE INITIALIZATIONS
    if (!this.model)
      return

    if (this.firstFlag) {
      this.firstFlag = false
      this.mixer.timeScale *= props.input.moveSpeed * slowerAnimation
    }

    //CALC MOVE ACCORDING TO CAMERA VIEW ANGLE
    cameraAngleX +=
      props.input.move.z > 0 ?
        props.input.move.angleTo(zAxis) / 150 * Math.sign(props.input.move.x)
        :
        (Math.PI - props.input.move.angleTo(zAxis)) / 150 * Math.sign(props.input.move.x)

    if (!isTouchDevice()) {
      if (props.input.move.x != 0 
        || props.input.move.y != 0 
        || props.input.move.z != 0) {
        cameraAngleX += props.input.mouse.alphaX * 0.075
      } else {
        cameraAngleX += props.input.mouse.alphaX * 0.025
      }
      cameraAngleConrolsApplied.set(
        props.input.mouse.alphaX * Math.PI * 1.5 + cameraAngleX,
        props.input.mouse.alphaY * Math.PI / 12
      )
    }
    else
      cameraAngleConrolsApplied.set(cameraAngleX, Math.PI / 16)

    moveCameraAngleApplied
      .copy(props.input.move)
        .applyAxisAngle(yAxis, cameraAngleConrolsApplied.x)

    modelOffset
      .set(getModelOffset(), 0, 0)
      .applyAxisAngle(yAxis, cameraAngleConrolsApplied.x)

    nextPos.copy(this.model.position)
      .add(moveCameraAngleApplied)

    //HANDLE JUMP
    if (this.jumping && nextPos.y <= 0)
      this.jumping = false

    if (!this.jumping && props.input.space) {
      this.jumping = true
      this.jumpingForce.set(
        moveCameraAngleApplied.x / 1.6,
        initialJumpForce * jumpScale,
        moveCameraAngleApplied.z / 1.6)
    }
    
    if (this.jumping) {
      nextPos.copy(this.model.position)
        .add(this.jumpingForce)
      
      this.jumpingForce.setY(this.jumpingForce.y - 9.8 * jumpScale)
    }

    //CLAMP POSITION BY SCENE SIZE
    nextPos.clamp(minPosition, maxPosition)

    nextPosCollision.copy(nextPos)//.setY(0)

    //HANDLE TREE COLLISION
    const trees = props.units?.Landscape?.trees
    treesCollisionForces.set(0, 0, 0)

    if (trees)
      for (let i = 0; i < trees.length; i++) {
        distanceToTree
          .copy(nextPosCollision)
          .sub(trees[i].position)

        if (distanceToTree.length() < trees[i].scale * 1.35) {
          distanceToTree
            .normalize()
            .multiplyScalar(collisionK)

          treesCollisionForces.add(distanceToTree)
        }
      }

    nextPos.add(treesCollisionForces)

    //MOVE MODEL
    this.model.position.copy(nextPos)
    if (props.input.move.length() > .01 && !this.jumping) {
      // this.startStepsSounds()
      this.mixer.update(props.clock.getDelta())
    } else
      ;//this.stopStepsSounds()

    //ROTATE MODEL TOWARDS MOVE DIRECTION
    if (props.input.move.length() > 0)
      this.model.quaternion.slerp(
        modelQuaternion
          .setFromUnitVectors(zAxis, moveCameraAngleApplied.normalize())
        , .135)

    //CALC CAMERA POS
    cameraToTarget = (new THREE.Vector3(0, 0, -15))
      .applyAxisAngle(xAxis, cameraAngleConrolsApplied.y)
      .applyAxisAngle(yAxis, cameraAngleConrolsApplied.x)

    props.controls.target.copy(this.model.position).sub(modelOffset)
    props.controls.target.setY(props.controls.target.y + (isTouchDevice() ? 7 : 5))
    props.camera.position.copy(tmpVector.copy(this.props.controls.target).add(cameraToTarget))
  }

  dispose = () => {}
}
