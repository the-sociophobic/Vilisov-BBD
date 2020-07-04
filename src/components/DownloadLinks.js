import React from 'react'

import AppStore from 'img/app-store.png'
import GooglePlay from 'img/google-play.png'


export default () =>
  <div className="download-links">
    <div className="download-links__width-container">
      <div className="download-links__width-container__abs-container">
        <img alt="App Store" src={AppStore} />
        <img alt="Google Play" src={GooglePlay} />
      </div>
    </div>
  </div>

