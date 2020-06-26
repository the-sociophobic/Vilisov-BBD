import React from 'react'

import countable from 'libs/utils/countable'
import { maxCoins } from 'libs/utils/coinCodes'


export default props => {
  const amount = Math.min(props.amount, maxCoins)
  const drawPlus = props.amount > maxCoins

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
