import React from 'react'

import Div100vh from 'react-div-100vh'
import queryString from 'query-string'

import ThreeScene from './components/ThreeScene'
import TextArea from './components/TextArea'
import OgImage from './components/OgImage'

import 'styles/index.sass'


export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      amount: queryString.parse(window.location.search).amount
    }

    if (!this.state.amount)
      window.history.replaceState({}, document.title, "/")
  }

  render = () =>
    <Div100vh>
      {!this.state.amount ?
        <>
          <ThreeScene/>
          <TextArea/>
        </>
        :
        <OgImage amount={parseInt(this.state.amount)} />}
    </Div100vh>
}
