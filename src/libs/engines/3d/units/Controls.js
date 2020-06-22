import React from 'react'
import ReactDOMServer from 'react-dom/server'

import THREE from 'libs/engines/3d/three'
import Unit from 'libs/engines/3d/Unit'
import nipplejs from 'nipplejs'
import clamp from 'clamp'
import isTouchDevice from 'libs/utils/isTouchDevice'
import isMobile from 'libs/utils/isMobile'
import isLandscape from 'libs/utils/isLandscape'


const moveSpeed = .55

const yAxis = new THREE.Vector3(0, 1, 0)

const initialThis = {
  mouse: {
    alphaX: 0,
    alphaY: 0,
  },

  space: false,

  moveSpeed: moveSpeed / .06,
  move: new THREE.Vector3(),
  moveFlags: {
    up: [
      {
        code: 87,
        pressed: false,
      },
      {
        code: 38,
        pressed: false,
      }
    ],
    down: [
      {
        code: 83,
        pressed: false,
      },
      {
        code: 40,
        pressed: false,
      }
    ],
    left: [
      {
        code: 68,
        pressed: false,
      },
      {
        code: 39,
        pressed: false,
      }
    ],
    right: [
      {
        code: 65,
        pressed: false,
      },
      {
        code: 37,
        pressed: false,
      }
    ],
  }
}


export default class Controls extends Unit {
  constructor(props) {
    super(props)

    Object.keys(initialThis)
      .forEach(key => this[key] = initialThis[key])

    if (isTouchDevice()) {  
      ;
    }
    else {
      window.addEventListener('mousemove', this.handleMouseMove, false)
      window.addEventListener('keydown', this.handleKeyDown, false)
      window.addEventListener('keyup', this.handleKeyUp, false)
    }

    window.addEventListener('resize', () => {
      this.joystickManager && this.joystickManager.destroy && this.joystickManager.destroy()
      this.addJoystick()
    })
    window.addEventListener('orientationchange', () => {
      this.joystickManager && this.joystickManager.destroy && this.joystickManager.destroy()
      this.addJoystick()
    })
  }

  addJoystick = () => {
    const zoneJoystick = document.getElementById('zone-joystick')
    var options = {
      zone: zoneJoystick,
      mode: 'static',
      position: {
        x: isLandscape() ?
          Math.round(window.innerWidth < 667 ? window.innerWidth / 4 : window.innerWidth / 6)
          :
          Math.round(window.innerWidth < 667 ? window.innerWidth / 4 * 3 : window.innerWidth / 6 * 5),
        y: isLandscape() ?
          Math.round(window.innerHeight / 5 * 4)
          :
          Math.round(window.innerHeight / 7 * 6),
      },
      size: window.innerWidth < 768 ? 80 : 100,
    }
    
    this.joystickManager = nipplejs.create(options)

    this.joystickManager[0].on('move', (e, data) => {
      // this.move.set(-data.force / 7, 0, 0)
      this.move.set(-moveSpeed, 0, 0)
        .applyAxisAngle(yAxis, data.angle.radian)
    })
    this.joystickManager[0].on('end', e => {
      this.move.set(0, 0, 0)
    })
  }

  addSpaceButton = () => {
    const renderSoundButton = () => (
      <div
        id="space-button"
        className="space-button"
      >
        space
      </div>
    )  

    document.body
      .insertAdjacentHTML('beforeend',
        ReactDOMServer.renderToString(
          renderSoundButton()))

    window.addEventListener("click", e => {
      if (e.target.id === "space-button") {
        if (this.spaceCancelTimeout)
          clearTimeout(this.spaceCancelTimeout)
      
        this.spaceCancelTimeout = setTimeout(() => {
          this.space = false
          this.spaceCancelTimeout = null
        }, 100)
        this.space = true
      }
    })
  }

  init = () => {    
    if (isMobile()) {
      this.addJoystick()
      this.addSpaceButton()
    }
  }

  animate = props => {
    const getDirectionState = direction =>
      direction
        .map(key => key.pressed)
        .reduce((a, b) => a || b)
      ? 1 : 0

    if (!isTouchDevice())
      this.move
        .set(
          getDirectionState(this.moveFlags.right) - getDirectionState(this.moveFlags.left),
          0,
          getDirectionState(this.moveFlags.up) - getDirectionState(this.moveFlags.down))
        .normalize()
        .multiplyScalar(moveSpeed)
  }

  
  handleMouseMove = e => {
    if (!e.pageX || !e.pageY) {
      console.log("no mouse found")
      return
    }
  
    this.mouse.alphaX = -clamp(e.pageX / window.innerWidth - .5, -.5, .5)
    this.mouse.alphaY = clamp(e.pageY / window.innerHeight - .5, -.5, .5)
  }

  handleKeyDown = e => {
    Object.keys(this.moveFlags)
      .forEach(direction =>
        this.moveFlags[direction]
          .forEach(key =>
            key.pressed |= (key.code === e.keyCode)))

    if (e.keyCode === 32)
      this.space = true
  }

  handleKeyUp = e => {
    Object.keys(this.moveFlags)
      .forEach(direction =>
        this.moveFlags[direction]
          .forEach(key =>
            key.pressed &= !(key.code === e.keyCode)))

    if (e.keyCode === 32)
      this.space = false
  }


  dispose = () => {
    if (isTouchDevice())
      ;
    else
      window.removeEventListener('mousemove', this.handleMouseMove, false)
  }
}
