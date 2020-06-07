import nipplejs from 'nipplejs'
import clamp from 'clamp'
import THREE from '~/src/libs/engines/3d/three'
import isTouchDevice from '~/src/libs/utils/isTouchDevice'


var inputVariables = {
  // scroll: {
  //   alphaX: 0,
  //   alphaY: 0,
  // },
  mouse: {
    alphaX: 0,
    alphaY: 0,    
  },
  move: new THREE.Vector3(0, 0, 0),
}

var moveFlags = {
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


export default class inputHandler {
  constructor(props) {
    this.props = props

    this.input = inputVariables

    if (isTouchDevice()) {  
      // this.handleScroll()
      // this.scrollUpdateInterval = setInterval(() => this.handleScroll(), 5)
    }
    else {
      window.addEventListener('mousemove', this.handleMouseMove, false)
      window.addEventListener('keydown', this.handleKeyDown, false)
      window.addEventListener('keyup', this.handleKeyUp, false)
    }
  }

  inputHandlerInit = () => {
    const zoneJoystick = document.getElementById('zone-joystick')
    var options = {
      zone: zoneJoystick,
      mode: 'static',
      position: {
        x: Math.round(window.innerWidth / 4 * 3),
        y: Math.round(window.innerHeight / 5 * 4),
      },
      // size: 200,
    }
    this.joystickManager = nipplejs.create(options)

    console.log(this.joystickManager)

    this.joystickManager.processOnMove = e => this.input.move.set(-e.offsetX / 1000, 0, -e.offsetY / 1000)
    this.joystickManager.processOnEnd = e => this.input.move.set(0, 0, 0)

    // this.joystickManager.on('added', (e, nipple) => {
    //   nipple.on('start move end dir plain', e => {
    //     console.log(e)
    //     console.log(nipple)
    //     // this.move.set()
    //   })
    // }).on('removed', (e, nipple) => {
    //   nipple.off('start move end dir plain')
    // })
  }

  handleScroll = e => {
    const threeSceneElement = document.getElementById("three-scene")
    const getBodyScrollTop = () => Math.max(-threeSceneElement.getBoundingClientRect().top, 0)

    this.scroll.alphaY = clamp(getBodyScrollTop() / threeSceneElement.offsetHeight * .5, 0, .5)
  }
  
  handleMouseMove = e => {
    if (!e.pageX || !e.pageY) {
      console.log("no mouse found")
      return
    }
  
    this.input.mouse.alphaX = -clamp(e.pageX / window.innerWidth - .5, -.5, .5)
    this.input.mouse.alphaY = clamp(e.pageY / window.innerHeight - .5, -.5, .5)
  }

  handleKeyDown = e => {
    Object.keys(moveFlags)
      .forEach(direction =>
        moveFlags[direction]
          .forEach(key =>
            key.pressed = (key.code === e.keyCode)))

    this.updateMove()
  }
  handleKeyUp = e => {
    Object.keys(moveFlags)
      .forEach(direction =>
        moveFlags[direction]
          .forEach(key =>
            key.pressed &= !(key.code === e.keyCode)))

    this.updateMove()
  }

  updateMove = () => {
    const getDirectionState = direction =>
      direction
        .map(key => key.pressed)
        .reduce((a, b) => a || b)
      ? 1 : 0

    this.input.move.setX(
      (getDirectionState(moveFlags.right) - getDirectionState(moveFlags.left)) * .1)
    this.input.move.setZ(
      (getDirectionState(moveFlags.up) - getDirectionState(moveFlags.down)) * .1)
  }

  dispose = () => {
    if (isTouchDevice())
      ;
      // clearInterval(this.scrollUpdateInterval)
    else
      window.removeEventListener('mousemove', this.handleMouseMove, false)
  }
}