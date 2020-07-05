import React, { Component } from 'react'


const frameTime = 1500
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
      , frameTime)
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
        {this.props.words
          .map((item, index) => {
            const word = this.props.words[this.modulus(this.state.currentIndex - index - 2)]

            return (
              <div
                className="item"
                key={word}
              >
                {word}
              </div>
        )})}
      </div>
    </div>
}

