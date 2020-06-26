import React from 'react'
import {
  FacebookShareButton,
  InstapaperShareButton,
  TelegramShareButton,
  TwitterShareButton,
  VKShareButton,
} from 'react-share'

export default class CoinsCollected extends React.Component {

  renderSharePanel = () =>
    <div className="coins-collected__share-panel">

    </div>

  render = () =>
    <div className="coins-collected">
      {props.number}
      <button
        className="coins-collected__share-button"
        onClick={() => this.showShare()}
      >
        <img src={shareIcon} />
      </button>
      {ReactDOM.createPortal(
        this.renderSharePanel(),
        document.body
      )}
    </div>
}