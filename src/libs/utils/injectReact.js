import React from 'react'
import ReactDOM from 'react-dom'

//to use async / await
const regeneratorRuntime = require("regenerator-runtime")


const getNode = async (nodeId, triesNumber = 20) =>
  new Promise((res, rej) => {
    let tryCounter = 0
    let elementLoadedChecker = setInterval(() => {
      const elem = document.getElementById(nodeId)
    
      if (tryCounter >= triesNumber) {
        clearInterval(elementLoadedChecker)
        rej(`#${nodeId} wasn't found after ${triesNumber} tries`)
      }

      if (!elem) {
        tryCounter++
        // console.log(`no #${nodeId} element in the DOM`)
        return
      } else {
        clearInterval(elementLoadedChecker)
        console.log(`#${nodeId} element found`)
        res(elem)
      }
    }, 200)  
  })

const tryInjectReact = async (component, divId) => {
  const elem = await getNode(divId).catch(error => console.log(error))

  if (elem) {
    ReactDOM.render(component, elem)
    console.log(`React injected into #${divId}`)
  }
}

const injectElementsList = injectedElems => {
  injectedElems.forEach(elem =>
    tryInjectReact(elem.component, elem.id))
  
  //remove react-components by React, before readymag do it himself on orientationchange
  window.addEventListener("orientationchange", async () => 
    injectedElems.forEach(elem => {
      const elemInDOM = document.getElementById(elem.id)
  
      elemInDOM && ReactDOM.unmountComponentAtNode(elemInDOM)  
    })
  , true)
  
  //inject react-components after orientationchange
  window.addEventListener("orientationchange", async () =>
    injectedElems.forEach(async elem => {
      const elemInDOM = await getNode(elem.id, 5)
        .catch(error => console.log(error))
      
      if (elemInDOM && !elemInDOM.firstChild)
        tryInjectReact(elem.component, elem.id)
    })
  )
}

export {
  getNode,
  tryInjectReact,
  injectElementsList,
}