import clamp from 'clamp'
import isTouchDevice from '~/src/libs/utils/isTouchDevice'


var inputVariables = {
  scroll: {
    alphaX: 0,
    alphaY: 0,
  },
  mouse: {
    alphaX: 0,
    alphaY: 0,    
  }
}


export default class inputHandler {
  constructor(props) {
    this.props = props

    this.input = inputVariables

    if (isTouchDevice()) {
      this.handleScroll()
      this.scrollUpdateInterval = setInterval(() => this.handleScroll(), 5)
    }
    else {
      window.addEventListener('mousemove', this.handleMouseMove, false)
    }
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

  dispose = () => {
    if (isTouchDevice())
      clearInterval(this.scrollUpdateInterval)
    else
      window.removeEventListener('mousemove', this.handleMouseMove, false)
  }
}