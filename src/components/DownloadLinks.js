import React from 'react'

import ExternalLink from 'components/ExternalLink'

import AppStore from 'img/app-store.svg'
import GooglePlay from 'img/google-play.png'


export default () =>
  <div className="download-links">
    <div className="download-links__width-container">
      <div className="download-links__width-container__abs-container">
        <ExternalLink newTab to="https://apps.apple.com/ru/app/sitting-in-a-room-i-am/id1522227172">
          <img alt="App Store" src={AppStore} />
        </ExternalLink>
        <ExternalLink newTab to="https://play.google.com/store/apps/details?id=apollonia.sittinginaroom">
          <img alt="Google Play" src={GooglePlay} />
        </ExternalLink>
      </div>
    </div>
  </div>

