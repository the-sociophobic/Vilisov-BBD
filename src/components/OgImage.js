import React from 'react'

import countable from 'libs/utils/countable'


export default props =>
  <div
    className="custom-og-image"
    id="custom-og-image"
  >
    <div className="custom-og-image__text-block">
      <div className="custom-og-image__text-block__item">
        мне {countable(props.amount, ['досталась', 'достались', 'досталось'])} {props.amount}
      </div>
      <div className="custom-og-image__text-block__item">
        {countable(props.amount, ['монетка', 'монетки', 'монеток'])}, а лучше
      </div>
      <div className="custom-og-image__text-block__item">
        бы достался
      </div>
      <div className="custom-og-image__text-block__item">
        → базовый доход
      </div>
    </div>
  </div>