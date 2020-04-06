import Unit from '../Unit'

import timingFuntions from './timingFunctions'

export default class TransitionsHandler extends Unit {
  constructor(props) {
    super(props)
    this.transitions = []
  }

  animate = () => {
    let unregisteredTransitions = []
    this.transitions.forEach((transition, index) => {
      if (transition.currentFrame === transition.numberOfFrames)
        unregisteredTransitions.push(index)
      else {
        // const alpha = 1 / (transition.numberOfFrames - transition.currentFrame)
        const alpha = transition.currentFrame / transition.numberOfFrames
        const timingFuntion = timingFuntions[transition.timingFuntion] || (t => t)

        transition.variable.copy(transition.initialValue
          .clone()
          .lerp(transition.value, timingFuntion(alpha)))

        transition.currentFrame++
      }
    })
    unregisteredTransitions.forEach(transitionIndex =>
      this.transitions = [
        ...this.transitions.slice(0, transitionIndex),
        ...this.transitions.slice(transitionIndex + 1)
      ]
    )
  }

  registerTransition = (variable, value, numberOfFrames = 10, timingFuntion = "none") => {
    this.transitions.push({
      variable: variable,
      value: value,
      initialValue: variable.clone(),
      numberOfFrames: numberOfFrames,
      currentFrame: 0,
      timingFuntion: timingFuntion,
    })
  }

  unregisterAllTransitions = () => this.transitions.length = 0

  noActiveTransitions = () => this.transitions.length === 0

}