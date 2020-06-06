import React, { Component } from 'react'
import ResizeObserver from 'resize-observer-polyfill'

import Scene from '~/src/libs/engines/3d/Scene'
import Lowpoly from '~/src/libs/engines/3d/units/Lowpoly'
import Lights from '~/src/libs/engines/3d/units/Lights'
import VignettePostprocessing from '~/src/libs/engines/3d/units/VignettePostprocessing'
import FilmGrainPostprocessing from '~/src/libs/engines/3d/units/FilmGrainPostprocessing'
import BloomPostprocessing from '~/src/libs/engines/3d/units/BloomPostprocessing'
import EasterEgg from '~/src/libs/engines/3d/units/EasterEgg'


export default class ThreeScene extends Component {

  constructor(props) {
    super(props)
    this.viewerRef = new React.createRef()

    this.scene = new Scene({
      units: {
        Lowpoly: {
          unit: Lowpoly,
          disabled: false,
        },
        Lights: {
          unit: Lights,
          disabled: false,
        },
        VignettePostprocessing: {
          unit: VignettePostprocessing,
          disabled: false,
        },
        FilmGrainPostprocessing: {
          unit: FilmGrainPostprocessing,
          disabled: false,
        },
        BloomPostprocessing: {
          unit: BloomPostprocessing,
          disabled: false,
        },
        EasterEgg: {
          unit: EasterEgg,
          disabled: false,
        },
      }
    })
  }

  componentDidMount() {
    this.resizeObs = new ResizeObserver(this.resize.bind(this))
      .observe(this.viewerRef.current)

    this.scene.init(this.viewerRef.current)
  }

  componentWillUnmount = () => {
    this.scene.dispose()
    // this.viewerRef.removeChild(this.renderer.domElement)
  }

  resize() {
    const ViewerDiv = this.viewerRef && this.viewerRef.current
    
    if (!ViewerDiv)
      return

    this.scene.resize(ViewerDiv.clientWidth, ViewerDiv.clientHeight)
  }

  render = () =>
    <div
      className="Viewer"
      ref={this.viewerRef}
    />
}
