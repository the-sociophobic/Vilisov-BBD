import React from 'react'

import Div100vh from 'react-div-100vh'
import queryString from 'query-string'

import ThreeScene from './components/ThreeScene'
import TextArea from './components/TextArea'
import OgImage from './components/OgImage'
import SharePagesGenerator from './components/SharePagesGenerator'

import 'styles/index.sass'


export default class App extends React.Component {
  constructor(props) {
    super(props)

    const { amount, page } = queryString.parse(window.location.search)

    this.state = {
      amount: amount ? parseFloat(amount) : amount,
      page: page ? parseFloat(page) : page,
    }

    if (amount)
      window.history.replaceState({}, document.title, `/ubi?amount=${this.state.amount + .5}`)
    else
      if (page)
        window.history.replaceState({}, document.title, `/ubi?page=${this.state.page + .5}`)
      else
        window.history.replaceState({}, document.title, "/ubi")
  }

  render = () =>
    <Div100vh>
      {this.state.amount && <OgImage amount={this.state.amount} />}
      {this.state.page && <SharePagesGenerator amount={this.state.page} />}
      {!this.state.amount && !this.state.page &&
        <>
          <ThreeScene/>
          <TextArea/>
        </>        
      }
    </Div100vh>
}
