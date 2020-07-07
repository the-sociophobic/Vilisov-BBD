import React from 'react'
import ReactDOM from 'react-dom'

import {
  TelegramShareButton,
  VKShareButton,
  FacebookShareButton,
  TwitterShareButton,
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
    const url = `https://apollonia.today/ubi/share/${coinsCollectedCode}.html`
    const urlVK = `https://apollonia.today/ubi/share/${coinsCollectedCode}`
    const shortUrl = `apollonia.today/ubi/share/${coinsCollectedCode}.html`

    return (
      <div className="coins-collected__share">
        <div
          className="coins-collected__share__background"
          onClick={() => this.setState({showShare: false})}
        />
        <div className="coins-collected__share__panel">
          <div
            className="coins-collected__share__panel__h1"
            onClick={() => {
              copyToClipboard(url)
              this.setState({copied: true})
              setTimeout(() => this.setState({copied: false}), 2000)
            }}
          >
            {this.state.copied ? "скопировано" : "поделиться"}
          </div>
          <img
            className="coins-collected__share__panel__img"
            alt={`og:image ${coinsCollected}.png`}
            src={`https://apollonia.today/ubi/og-images/${coinsCollected}.png`}
          />
          <div className="coins-collected__share__panel__social">
            <TwitterShareButton url={shortUrl}>
              t
            </TwitterShareButton>
            {/* <VKShareButton url={urlVK}>
              vk
            </VKShareButton> */}
            <FacebookShareButton url={url}>
              fb
            </FacebookShareButton>
            <TelegramShareButton url={url}>
              tlg
            </TelegramShareButton>
          </div>
        </div>
      </div>
    )
  }

  render = () =>
    <>
      <div
        className="coins-collected"
        onClick={() => this.setState({showShare: true})}
      >
        <div className="coins-collected__coin" />

        <div className="coins-collected__number">
          {this.props.number}
        </div>

        <button className="coins-collected__share-button">
          <img alt="share" src={shareIcon} />
        </button>
      </div>

      {this.state.showShare &&
        ReactDOM.createPortal(
          this.renderSharePanel(),
          document.body)}
    </>
}