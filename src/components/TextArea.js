import React, { Component } from 'react'


export default class TextArea extends Component {
  constructor(props) {
    super(props)
  }
  
  render = () =>
    <div className="text-area">
        <div className="text-area__left-column">
          <div className="text-area__left-column__text">
            что голодная смерть британца в тяжёлой депрессии может рассказать нам о том, как мы распоряжаемся ресурсами и будем распоряжаться ими в будущем? что такое безусловный базовый доход? как изменится ваша жизнь, получай вы каждый месяц зарплату только за то, что живёте? 
          </div>
        </div>
        <div className="text-area__right-column">
          <h1 className="h1">
            SITTING&nbsp;IN&nbsp;A<br />
            ROOM.&nbsp;I&nbsp;AM.
          </h1>
        </div>
    </div>
}

