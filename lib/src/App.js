import React, { Component } from 'react'

import ThreeScene from './components/ThreeScene'
import myScene from './libs/myScene'

// import './styles/index.sass'


class App extends Component {
  constructor(props) {
    super(props)
  }
  
  render() {
    return (
      <ThreeScene
        // ref={this.context.threeSceneRef}
        myScene={myScene}
        // {...props}
      />
    )
  }
}

export default App
