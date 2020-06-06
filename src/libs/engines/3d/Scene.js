import classes from 'multiple-extend'
import THREE from '~/src/libs/engines/3d/three'

import transitionHandler from '~/src/libs/utils/handlers/transitionHandler'
import inputHandler from '~/src/libs/utils/handlers/inputHandler'


const targetToCamera = 30
const maxFrameNumber = 5000

var sceneVariables = {
  renderer: undefined,
  camera: undefined,
  scene: undefined,
  controls: undefined,
  units: {},
  unitsToggled: false,
  frameNumber: 0,
  time: 0,
}


export default class Scene extends
  classes(transitionHandler, inputHandler) {

  constructor(props) {
    super(props)
    this.scene = sceneVariables
  }

  init = ViewerDiv => {
    const W = ViewerDiv.clientWidth
    const H = ViewerDiv.clientHeight

    //ADD RENDERER
    this.scene.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.scene.renderer.setClearColor(0x000000, 0)
    this.scene.renderer.setSize(W, H)
    this.scene.renderer.setPixelRatio(window.devicePixelRatio)
    this.scene.renderer.shadowMap.enabled = true

    ViewerDiv.appendChild(this.scene.renderer.domElement)

    //ADD SCENE
    this.scene.scene = new THREE.Scene()

    //ADD CAMERA
    this.scene.camera = new THREE.PerspectiveCamera(
      75,
      W / H,
      0.1,
      1000
    )
    this.scene.controls = new THREE.OrbitControls(this.scene.camera, this.scene.renderer.domElement)
    this.scene.controls.enabled = false
    this.scene.camera.position.z = targetToCamera
    this.scene.controls.update()

    this.initUnits()

    if (!this.frameId)
      this.frameId = requestAnimationFrame(this.animate)
  }

  dispose = () => {
    this.disposeUnits()
    cancelAnimationFrame(this.frameId)
  }

  resize = (W, H) => {
    console.log(this.scene.renderer.getSize())
    if (!this.scene.renderer || !this.scene.camera)
      return

    this.scene.camera.aspect = W / H
    this.scene.camera.updateProjectionMatrix()

    this.scene.renderer.setSize(W, H)
    this.scene.renderer.setPixelRatio(window.devicePixelRatio)
  }

  animate = () => {
    this.scene.time = Date.now() * 0.000005
    this.scene.frameNumber = (this.scene.frameNumber + 1) % maxFrameNumber

    const {
      renderer,
      camera,
      scene,
      controls,
      units,
      frameNumber
    } = this.scene

    Object.keys(units)
      .forEach(unitName =>
        units[unitName].animate({
          frameNumber: frameNumber,
          maxFrameNumber: maxFrameNumber,
        }))

    controls.update()
    renderer.render(scene, camera)

    this.frameId = window.requestAnimationFrame(this.animate)
  }


  initUnits = () => {
    const props = {
      THREE: THREE,
      renderer: this.scene.renderer,
      scene: this.scene.scene,
      camera: this.scene.camera,
    }

    Object.keys(this.props.units)
      .forEach(unitName => {
        const unit = this.props.units[unitName]

        if (!unit.disabled ^ this.scene.unitsToggled)
        this.scene.units[unitName] = new unit.unit(props)
      })
  }

  disposeUnits = () => {
    const {
      scene,
      units,
    } = this.scene

    Object.keys(units)
      .forEach(unitName => units[unitName].dispose())

    //REDO THIS SHIT: units should unregister themselves
    while(scene.children.length > 0)
      scene.remove(scene.children[0])
  }

  toggleUnits = () => {
    this.disposeUnits()
    this.scene.unitsToggled = !this.scene.unitsToggled
    this.initUnits()
  }
}
