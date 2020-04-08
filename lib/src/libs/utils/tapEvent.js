export default (element, fn, startEvent = 'touchstart', endEvent = 'touchend', ms = 200) => {
  var timer,
    touchStarted = false,
    vector

  const registerTapHandler = e => {
    vector = new THREE.Vector2(e.touches[0].screenX, e.touches[0].screenY)
    timer = setTimeout(() => unregisterTapHandler(), ms)
    touchStarted = true
  }

  const unregisterTapHandler = () => {
    touchStarted = false
    clearTimeout(timer)
  }

  const tapHandler = e => {
    const finalPos = new THREE.Vector2(e.changedTouches[0].screenX, e.changedTouches[0].screenY)
    if (touchStarted && vector && (vector.sub(finalPos).length() < 0.1)) {
      fn()
    }
    unregisterTapHandler()
  }

  element.addEventListener(startEvent, registerTapHandler)
  element.addEventListener(endEvent, tapHandler)
}