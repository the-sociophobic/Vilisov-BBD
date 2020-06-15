import React from 'react'


export default props =>
  <div
    {...props}
    className={"arrow " + (props.left && "arrow--left")}
  >
    <span className="arrow__item" />
    <span className="arrow__item arrow__item--segunda" />
  </div>
