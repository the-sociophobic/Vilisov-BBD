import THREE from 'libs/engines/3d/three'
import Unit from 'libs/engines/3d/Unit'
import nipplejs from 'nipplejs'
import clamp from 'clamp'
import isTouchDevice from 'libs/utils/isTouchDevice'


const yAxis = new THREE.Vector3(0, 1, 0)

const initialThis = {
  // scroll: {
  //   alphaX: 0,
  //   alphaY: 0,
  // },
  mouse: {
    alphaX: 0,
    alphaY: 0,
  },

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
      // this.handleScroll()
      // this.scrollUpdateInterval = setInterval(() => this.handleScroll(), 5)
    }
    else {
      window.addEventListener('mousemove', this.handleMouseMove, false)
      window.addEventListener('keydown', this.handleKeyDown, false)
      window.addEventListener('keyup', this.handleKeyUp, false)
    }
  }

  init = () => {
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

    this.joystickManager[0].on('move', (e, data) => {
      this.move.set(-data.force / 7, 0, 0)
        .applyAxisAngle(yAxis, data.angle.radian)
    })
    this.joystickManager[0].on('end', e => {
      this.move.set(0, 0, 0)
    })
  }

  // handleScroll = e => {
  //   const threeSceneElement = document.getElementById("three-scene")
  //   const getBodyScrollTop = () => Math.max(-threeSceneElement.getBoundingClientRect().top, 0)

  //   this.scroll.alphaY = clamp(getBodyScrollTop() / threeSceneElement.offsetHeight * .5, 0, .5)
  // }

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
        .multiplyScalar(.55)
  }

  
  handleMouseMove = e => {
    if (!e.pageX || !e.pageY) {
      console.log("no mouse found")
      return
    }
  
    this.mouse.alphaX = -clamp(e.pageX / window.innerWidth - .5, -.5, .5)
    this.mouse.alphaY = clamp(e.pageY / window.innerHeight - .5, -.5, .5)
  }

  handleKeyDown = e =>
    Object.keys(this.moveFlags)
      .forEach(direction =>
        this.moveFlags[direction]
          .forEach(key =>
            key.pressed |= (key.code === e.keyCode)))

  handleKeyUp = e =>
    Object.keys(this.moveFlags)
      .forEach(direction =>
        this.moveFlags[direction]
          .forEach(key =>
            key.pressed &= !(key.code === e.keyCode)))


  dispose = () => {
    if (isTouchDevice())
      ;
      // clearInterval(this.scrollUpdateInterval)
    else
      window.removeEventListener('mousemove', this.handleMouseMove, false)
  }
}
