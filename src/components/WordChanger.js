import React, { Component } from 'react'


const shrinkTime = 300

export default class TextArea extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentIndex: 0,
      shrinked: false,
    }
  }

  componentDidMount = () =>
    this.changeWordInterval = setInterval(
      () => this.changeWord()
      , 2500)
  componentWillUnmount = () =>
    clearInterval(this.changeWordInterval)

  changeWord = () => {
    this.setState({shrinked: true})
    setTimeout(() => this.setState({
      shrinked: false,
      currentIndex: this.modulus(this.state.currentIndex + 1),
    }), shrinkTime)
  }

  modulus = number =>
    (this.props.words.length * 10 + number) % this.props.words.length
  
  render = () =>
    <div className="word-changer">
      <div className={"word-changer__container " + (this.state.shrinked && "word-changer__container--shrinked")}>
        {this.props.words[this.modulus(this.state.currentIndex + 2)]}
        {this.props.words[this.modulus(this.state.currentIndex + 1)]}
        {this.props.words[this.state.currentIndex]}
        {this.props.words[this.modulus(this.state.currentIndex - 1)]}
        {this.props.words[this.modulus(this.state.currentIndex - 2)]}
      </div>
    </div>
}

