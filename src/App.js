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

    const { amount } = queryString.parse(window.location.search)

    this.state = {
      amount: amount ? parseFloat(amount) : amount
    }

    if (!amount) //QUESTIONABLE: /Vilisov-BBD
      window.history.replaceState({}, document.title, "/ubi")
    else
      window.history.replaceState({}, document.title, `/ubi?amount=${this.state.amount + .5}`)
  }

  render = () =>
    <Div100vh>
      {!this.state.amount ?
        <>
          <ThreeScene/>
          <TextArea/>
        </>
        :
        <OgImage amount={1} />}
    </Div100vh>
}
