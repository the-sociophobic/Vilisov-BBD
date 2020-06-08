import Unit from 'libs/engines/3d/Unit'

import timingFuntions from './timingFunctions'

export default class TransitionsHandler extends Unit {
  constructor(props) {
    super(props)
    this.transitions = []
  }

  animateTransitions = () => {
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
    unregisteredTransitions.forEach(transitionIndex => {
      this.transitions[transitionIndex] && this.transitions[transitionIndex].onComplete()

      this.transitions = [
        ...this.transitions.slice(0, transitionIndex),
        ...this.transitions.slice(transitionIndex + 1)
      ]
    })
  }

  registerTransition = props => {
    this.transitions.push({
      variable: props.variable,
      value: props.value,
      initialValue: props.variable.clone(),
      numberOfFrames: props.numberOfFrames || 10,
      currentFrame: 0,
      timingFuntion: props.timingFuntion || "none",
      onComplete: props.onComplete || (() => {}),
    })
  }

  unregisterAllTransitions = () => this.transitions.length = 0

  noActiveTransitions = () => this.transitions.length === 0

}