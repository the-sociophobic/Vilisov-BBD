import THREE from 'libs/engines/3d/three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import classes from 'multiple-extend'

import transitionHandler from 'libs/utils/handlers/transitionHandler'
import inputHandler from 'libs/utils/handlers/inputHandler'


const targetToCamera = -15
const maxFrameNumber = 5000

var sceneVariables = {
  renderer: undefined,
  camera: undefined,
  scene: new THREE.Scene(),
  composer: undefined,
  controls: undefined,

  clock: new THREE.Clock(),
  frameNumber: 0,

  units: {},
  unitsToggled: false,
}


export default class Scene extends
  classes(transitionHandler, inputHandler) {

  constructor(props) {
    super(props)
    this.scene = sceneVariables
  }

  init = ViewerDiv => {
    this.inputHandlerInit()

    const W = ViewerDiv.clientWidth
    const H = ViewerDiv.clientHeight

    //ADD RENDERER
    this.scene.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.scene.renderer.setClearColor(0x000000, 0)
    this.scene.renderer.setSize(W, H)
    this.scene.renderer.setPixelRatio(window.devicePixelRatio)
    this.scene.renderer.shadowMap.enabled = true

    ViewerDiv.appendChild(this.scene.renderer.domElement)

    //ADD CAMERA
    this.scene.camera = new THREE.PerspectiveCamera(
      75,
      W / H,
      0.1,
      1000
    )
    this.scene.controls = new OrbitControls(this.scene.camera, this.scene.renderer.domElement)
    this.scene.controls.enabled = false
    this.scene.camera.position.z = targetToCamera
    this.scene.controls.update()

    this.scene.composer = new EffectComposer(this.scene.renderer)
    this.scene.composer.addPass(new RenderPass(this.scene.scene, this.scene.camera))

    this.initUnits()

    if (!this.frameId)
      this.frameId = requestAnimationFrame(this.animate)
  }

  dispose = () => {
    this.disposeUnits()
    cancelAnimationFrame(this.frameId)
  }

  resize = (W, H) => {
    if (!this.scene.renderer || !this.scene.camera)
      return

    this.scene.camera.aspect = W / H
    this.scene.camera.updateProjectionMatrix()

    this.scene.renderer.setSize(W, H)
    this.scene.renderer.setPixelRatio(window.devicePixelRatio)
  }

  animate = () => {
    this.scene.frameNumber = (this.scene.frameNumber + 1) % maxFrameNumber

    const {
      composer,
      controls,
      units,
    } = this.scene

    Object.keys(units)
      .forEach(unitName =>
        units[unitName].animate({
          THREE: THREE,
          ...this.scene,
          input: this.input,
          maxFrameNumber: maxFrameNumber,
        }))

    controls.update()
    composer.render()

    this.frameId = window.requestAnimationFrame(this.animate)
  }


  initUnits = () => {
    const props = {
      THREE: THREE,
      ...this.scene,
      input: this.input,
      maxFrameNumber: maxFrameNumber,
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

  // toggleUnit = unitName => {
  //   // if (this.scene[unitName].enabled)
  //   console.log(this.scene.scene.children)
  // }
}
