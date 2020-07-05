import React from 'react'

import htmlToImage from 'html-to-image'
import download from 'downloadjs'

import countable from 'libs/utils/countable'
import { maxCoins } from 'libs/utils/coinCodes'

const generationOffset = 350

export default class OgImage extends React.Component {
  componentDidMount = () => {
    setTimeout(() => {
      const problematicLines = document.getElementsByClassName("custom-og-image__text-block__item")
      Array.from(problematicLines)
        .forEach(element => element.style.width = `${element.clientWidth}px`)
    }, generationOffset)

    var node = document.getElementById('custom-og-image');
    setTimeout(() =>
      htmlToImage.toPng(node)
      .then(dataUrl => {
        download(dataUrl, `${this.props.amount}.png`)
        // var img = new Image();
        // img.src = dataUrl;
        // img.style="position: fixed; top: 0; left: 0; width: 1200px; height: 630px"
        // document.body.appendChild(img);
      })
      .catch(function (error) {
        console.error('oops, something went wrong!', error);
      })
    , generationOffset * 2)

    setTimeout(() => window.location.reload(), generationOffset * 4)
  }
  
  render = () => {
    const amount = Math.min(this.props.amount, maxCoins)
    const drawPlus = this.props.amount > maxCoins
  
    return (
      <div
        className="custom-og-image"
        id="custom-og-image"
      >
        <div className="custom-og-image__text-block">
          <div className="custom-og-image__text-block__item">
            мне {countable(amount, ['досталась', 'достались', 'досталось'])} {amount}{drawPlus ? "+" : ""}
          </div>
          <div className="custom-og-image__text-block__item">
            {countable(amount, ['монетка', 'монетки', 'монеток'])}, а лучше
          </div>
          <div className="custom-og-image__text-block__item">
            бы достался
          </div>
          <div className="custom-og-image__text-block__item">
            → базовый доход
          </div>
        </div>
      </div>
    )
  }
}
