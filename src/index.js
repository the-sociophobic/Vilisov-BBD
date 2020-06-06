import React from 'react'
import ReactDOM from 'react-dom'

// import ThreeScene from './THREE/ThreeScene'
// import Logo from './THREE/Logo'
// import EasterEgg from './THREE/EasterEgg'
import App from './App'

import './styles/index.sass'


// new ThreeScene({units: [
//   Logo,
//   EasterEgg,
// ]})


let tryCounter = 0
let elementLoadedChecker = setInterval(() => {
  const container = document.getElementsByClassName("container")
  // const elem = document.getElementById('root')
  if (tryCounter >= 25)
    clearInterval(elementLoadedChecker)
  // if (!elem) {
  if (container.length === 0) {
    tryCounter++
    console.log("no #root element in the DOM")
    return
  }

  var rootElem = document.createElement("div")

  rootElem.id = "three-root"
  
  container[0].prepend(rootElem)
  // ReactDOM.render(<App />, elem)
  ReactDOM.render(<App />, rootElem)
  clearInterval(elementLoadedChecker)
}, 200)
