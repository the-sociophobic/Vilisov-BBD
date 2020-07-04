import React from 'react'

// import AppStore from 'img/app-store.png'
// import GooglePlay from 'img/google-play.png'


export default props =>
  props.show &&
    <div
      className="video-modal"
      onClick={() => props.hide()}
    >
      <div className="video-modal__container">
        <div className="video-modal__container__abs-container">
          <iframe
            // width="560"
            // height="315"
            title="video"
            src="https://www.youtube.com/embed/9UYSotyGXoM"
            frameborder="0"
            allow="accelerometer;
            autoplay;
            encrypted-media;
            gyroscope;
            picture-in-picture"
            allowfullscreen
          />
        </div>
      </div>
    </div>
