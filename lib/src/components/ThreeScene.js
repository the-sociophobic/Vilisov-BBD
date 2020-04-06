import React, { Component } from 'react'

import ResizeObserver from 'resize-observer-polyfill'

import THREE from 'libs/engines/3d/three'


const targetToCamera = 5


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
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
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

    this.camera.position.z = targetToCamera

    this.initUnits()

    if (!this.frameId)
      this.frameId = requestAnimationFrame(this.animate)
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

    //VECTOR TRANSITIONS
    let unregisteredTransitions = []
    this.transitions.forEach((transition, index) => {
      if (transition.currentFrame === transition.numberOfFrames)
        unregisteredTransitions.push(index)
      else {
        const alpha = 1 / (transition.numberOfFrames - transition.currentFrame)
        transition.variable.lerp(transition.value, alpha)
        transition.currentFrame++
      }
    })
    unregisteredTransitions.forEach(transitionIndex =>
      this.transitions = [
        ...this.transitions.slice(0, transitionIndex),
        ...this.transitions.slice(transitionIndex + 1)
      ]
    )


    this.renderer.render(this.scene, this.camera)
    this.frameId = window.requestAnimationFrame(this.animate)
  }

  registerTransition = (variable, value, numberOfFrames) => {
    this.transitions.push({
      variable: variable,
      value: value,
      numberOfFrames: numberOfFrames || 10,
      currentFrame: 0,
    })
  }
  
  render = () => (
    <div
      className="Viewer"
      ref={this.viewerRef}
    />
  )
}

export default ThreeScene