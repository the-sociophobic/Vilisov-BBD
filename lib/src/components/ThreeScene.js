import React, { Component } from 'react'

import ResizeObserver from 'resize-observer-polyfill'

import THREE from '../libs/engines/3d/three'


const targetToCamera = 28


const cameraPositions = [
  {
    position: new THREE.Vector3(-3, -5.6, targetToCamera),
    target: new THREE.Vector3(0, 2,0),
    frames: 80,
  },
  {
    position: new THREE.Vector3(-2, -5.6, targetToCamera),
    target: new THREE.Vector3(0, 2,0),
    frames: 33,
  },

  {
    position: new THREE.Vector3(3, -5, targetToCamera),
    target: new THREE.Vector3(0,2,0),
    frames: 90,
  },
  {
    position: new THREE.Vector3(3, -5, targetToCamera),
    target: new THREE.Vector3(0,2,0),
    frames: 35,
  },

  {
    position: new THREE.Vector3(0, 1, targetToCamera - .3),
    target: new THREE.Vector3(0,2, 0),
    frames: 85,
  },
  {
    position: new THREE.Vector3(.2, 1, targetToCamera - .2),
    target: new THREE.Vector3(0,2, 0),
    frames: 30,
  },
]
var currentFrame = 0

class ThreeScene extends Component {
  constructor(props) {
    super(props)
    this.viewerRef = new React.createRef()
    this.transitions = []
  }

  updateDimensions() {
    const ViewerDiv = this.viewerRef && this.viewerRef.current
    if (!this.renderer || !ViewerDiv || !this.camera)
      return
    this.camera.aspect = ViewerDiv.clientWidth / ViewerDiv.clientHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(ViewerDiv.clientWidth, ViewerDiv.clientHeight)

    this.renderer.setPixelRatio(window.devicePixelRatio)
  }

  componentDidMount() {
    this.resizeObs = new ResizeObserver(this.updateDimensions.bind(this))
      .observe(this.viewerRef.current)

    const ViewerDiv = this.viewerRef.current
    const width = ViewerDiv.clientWidth
    const height = ViewerDiv.clientHeight

    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(window.devicePixelRatio)

    this.renderer.shadowMap.enabled = true

    ViewerDiv.appendChild(this.renderer.domElement)

    //ADD SCENE
    this.scene = new THREE.Scene()

    //ADD CAMERA
    this.camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    )
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enabled = false
    this.camera.position.z = targetToCamera
    this.controls.update()

    this.initUnits()

    if (!this.frameId)
      this.frameId = requestAnimationFrame(this.animate)

    if (this.transitions.length === 0)
      this.randomCameraMove()
  }

  componentWillUnmount(){
    this.disposeUnits()
    cancelAnimationFrame(this.frameId)
    // this.viewerRef.removeChild(this.renderer.domElement)
  }

  initUnits = () => {
    this.units = {}
    const props = {
      THREE: THREE,
      renderer: this.renderer,
      scene: this.scene,
      camera: this.camera,
    }

    Object.keys(this.props.myScene.units)
      .forEach(unitName => {
        const unit = this.props.myScene.units[unitName]

        if (!unit.disabled ^ this.unitsToggled)
          this.units[unitName] = new unit.unit(props)
      })
        
  }

  disposeUnits = () => {
    Object.keys(this.units)
      .forEach(unitName => this.units[unitName].dispose())
    //REDO THIS SHIT: units should unregister themselves
    while(this.scene.children.length > 0)
      this.scene.remove(this.scene.children[0])
  }

  toggleUnits = () => {
    this.disposeUnits()
    this.unitsToggled = !this.unitsToggled
    this.initUnits()
  }

  animate = () => {
    Object.keys(this.units).forEach(unitName => this.units[unitName].animate())

    this.controls.update()

    this.randomCameraMove()

    // //VECTOR TRANSITIONS
    // if(this.transitions.length > 0) {
    //   let unregisteredTransitions = []
    //   let onCompleteFns = []
  
    //   this.transitions.forEach((transition, index) => {
    //     if (transition.currentFrame === transition.numberOfFrames) {
    //       unregisteredTransitions.push(index)
    //       typeof transition.onComplete !== "undefined" && onCompleteFns.push(transition.onComplete)
    //     } else {
    //       const alpha = 1 / (transition.numberOfFrames - transition.currentFrame)
    //       // if (transition?.variable?.lerp)
    //       //   transition.variable.lerp(transition.value, alpha)
    //       // if (transition?.variable?.slerp)
    //       //   transition.variable.slerp(transition.value, alpha * 2)
    //       transition.currentFrame++
    //       transition.onUpdate && transition.onUpdate()
    //     }
    //   })

    //   unregisteredTransitions.forEach(transitionIndex => {
    //     this.transitions = [
    //       ...this.transitions.slice(0, transitionIndex),
    //       ...this.transitions.slice(transitionIndex + 1)
    //     ]
    //     // console.log(this.transitions.length)
    //   })
    //   onCompleteFns.forEach(fn => {
    //     // console.log(onCompleteFns.length)
    //     // console.log(this.transitions)
    //     console.log(unregisteredTransitions)
    //     fn()
    //   })
    //   // onCompleteFns[0]()
    //   // onCompleteFns.length > 0 && console.log(onCompleteFns.length)
    //   onCompleteFns = []
    // }


    this.renderer.render(this.scene, this.camera)
    this.frameId = window.requestAnimationFrame(this.animate)
  }

  // registerTransition = props => {
  //   this.transitions.push({
  //     variable: props.variable,
  //     value: props.value,
  //     numberOfFrames: props.numberOfFrames || 10,
  //     currentFrame: 0,
  //     onUpdate: props.onUpdate,
  //     onComplete: props.onComplete,
  //   })
  // }

  randomCameraMove = () => {
    // const pos = this.camera.position
    // const newPos = new THREE.Vector3(
    //   pos.x + (Math.random() - .5) * 1,
    //   pos.y + (Math.random() - .5) * 1,
    //   pos.z + (Math.random() - .5) * 1,
    // )
    // const target = new THREE.Vector3(
    //   (Math.random() - .5) * .02,
    //   (Math.random() - .5) * .02,
    //   (Math.random() - .5) * .02,
    // )
    // const numberOfFrames = 30

    // this.registerTransition({
    //   variable: this.camera.position,
    //   value: newPos,
    //   numberOfFrames: numberOfFrames,
    //   onUpdate: () => this.controls.update()
    // })
    // this.registerTransition({
    //   variable: this.controls.target,
    //   value: target,
    //   numberOfFrames: numberOfFrames,
    //   onUpdate: () => this.controls.update(),
    //   onComplete: () => setTimeout(() => this.randomCameraMove(), 100)
    // })

    var currentPos = 0
    var prevFrames = 0
    while (currentFrame - prevFrames > 0) {
      prevFrames += cameraPositions[currentPos].frames
      ++currentPos
    }
    currentPos %= cameraPositions.length
    const currentFrameClipped = currentFrame - prevFrames
    const alpha = (1 / (cameraPositions[currentPos].frames - currentFrameClipped)) ** .75

    this.camera.position.lerp(cameraPositions[currentPos].position, alpha)
    this.controls.update()
    this.controls.target.lerp(cameraPositions[currentPos].target, alpha)

    const maxFrames = cameraPositions.map(pos => pos.frames).reduce((a, b) => a + b) - 1
    currentFrame = (currentFrame + 1) % maxFrames
  }
  
  render = () => (
    <div
      className="Viewer"
      ref={this.viewerRef}
    />
  )
}

export default ThreeScene