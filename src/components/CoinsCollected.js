import React from 'react'
import ReactDOM from 'react-dom'

import {
  TelegramShareButton,
  TelegramIcon,

  VKShareButton,
  VKIcon,

  FacebookShareButton,
  FacebookIcon,

  TwitterShareButton,
  TwitterIcon,
} from 'react-share'

import { coinCodes, maxCoins } from 'libs/utils/coinCodes'
import copyToClipboard from 'libs/utils/copyToClipboard'

import shareIcon from 'img/share.svg'


export default class CoinsCollected extends React.Component {
  state = {
    showShare: false,
    copied: false,
  }

  renderSharePanel = () => {
    const coinsCollected = Math.min(this.props.number, maxCoins)
    const coinsCollectedCode = coinCodes[coinsCollected]
    const url = `https://apollonia.today/ubi/?${coinsCollectedCode}`
    const shortUrl = `apollonia.today/ubi/?${coinsCollectedCode}`

    return (
      <div className="coins-collected__share">
        <div
          className="coins-collected__share__background"
          onClick={() => this.setState({showShare: false})}
        />
        <div className="coins-collected__share__panel">
          share
          <div
            className="coins-collected__share__panel__copy-field"
            onClick={() => {
              if (!this.state.copied)
                setTimeout(() => this.setState({copied: false}), 3000)
              this.setState({copied: true})
              copyToClipboard(url)
            }}
          >
            {this.state.copied ? "скопировано" : shortUrl}
          </div>
          <div className="coins-collected__share__panel__social">
            <TelegramShareButton url={url}>
              <TelegramIcon size={32} />
            </TelegramShareButton>
            <VKShareButton url={url}>
              <VKIcon size={32} />
            </VKShareButton>
            <FacebookShareButton url={url}>
              <FacebookIcon size={32} />
            </FacebookShareButton>
            <TwitterShareButton url={shortUrl}>
              <TwitterIcon size={32} />
            </TwitterShareButton>
          </div>
        </div>
      </div>
    )
  }

  render = () =>
    <div className="coins-collected">

      <div className="coins-collected__coin" />

      <div className="coins-collected__number">
        {this.props.number}
      </div>

      <button
        className="coins-collected__share-button"
        onClick={() => this.setState({showShare: true})}
      >
        <img src={shareIcon} />
      </button>

      {this.state.showShare &&
        ReactDOM.createPortal(
          this.renderSharePanel(),
          document.body)}
          
    </div>
}