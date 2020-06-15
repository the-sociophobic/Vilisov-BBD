import React, { Component } from 'react'


export default class ControlsHelper extends Component {
  state = {
    showControlsHelper: true,
  }

  render = () =>
    this.state.showControlsHelper &&
      <div className="controls-helper">
        <div
          className="controls-helper__close"
          onClick={() => this.setState({showControlsHelper: false})}
        />
        <div className="controls-helper__text controls-helper__text--desktop">
          управляйте стрелками,<br />двигайте камеру мышкой.<br />обновите страницу, чтобы<br />сменить модель
        </div>
        <div className="controls-helper__text controls-helper__text--mobile">
          управляйте джойстиком.<br />обновите страницу, чтобы<br />сменить модель
        </div>
      </div>
}

