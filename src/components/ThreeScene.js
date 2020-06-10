import React, { Component } from 'react'
import ResizeObserver from 'resize-observer-polyfill'

import Scene from 'libs/engines/3d/Scene'
import Character from 'libs/engines/3d/units/Character'
import Landscape from 'libs/engines/3d/units/Landscape'
import Coins from 'libs/engines/3d/units/Coins'
import Lights from 'libs/engines/3d/units/Lights'
import Fog from 'libs/engines/3d/units/Fog'
import Controls from 'libs/engines/3d/units/Controls'
// import VignettePostprocessing from 'libs/engines/3d/units/VignettePostprocessing'
// import FilmGrainPostprocessing from 'libs/engines/3d/units/FilmGrainPostprocessing'
import BloomPostprocessing from 'libs/engines/3d/units/BloomPostprocessing'
// import EasterEgg from 'libs/engines/3d/units/EasterEgg'


export default class ThreeScene extends Component {

  constructor(props) {
    super(props)
    this.state = {}

    this.viewerRef = new React.createRef()

    this.scene = new Scene({
      units: {
        Character: {
          unit: Character,
          disabled: false,
        },
        Landscape: {
          unit: Landscape,
          disabled: false,
        },
        Coins: {
          unit: Coins,
          disabled: false,
        },
        Lights: {
          unit: Lights,
          disabled: false,
        },
        Fog: {
          unit: Fog,
          disabled: false,
        },
        Controls: {
          unit: Controls,
          disabled: false,
        },
        // FilmGrainPostprocessing: {
        //   unit: FilmGrainPostprocessing,
        //   disabled: false,
        // },
        BloomPostprocessing: {
          unit: BloomPostprocessing,
          disabled: false,
        },
        // VignettePostprocessing: {
        //   unit: VignettePostprocessing,
        //   disabled: false,
        // },
        // EasterEgg: {
        //   unit: EasterEgg,
        //   disabled: false,
        // },
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
    >
      <div id="zone-joystick" />
    </div>
}
