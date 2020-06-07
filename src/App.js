import React, { Component } from 'react'

import ThreeScene from './components/ThreeScene'
import TextArea from './components/TextArea'


class App extends Component {
  constructor(props) {
    super(props)
  }
  
  render = () =>
    <>
      <ThreeScene/>
      <TextArea/>
    </>
}

export default App
