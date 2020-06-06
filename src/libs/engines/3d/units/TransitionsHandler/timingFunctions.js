let fns = {}

fns.linear = t => t
fns.easeInQuad = t => t * t
fns.easeOutQuad = t => t * (2 - t)
fns.easeInOutQuad = t => t < .5 ? 2 * (t ** 2) : -1 + (4 - 2 * t) * t
fns.easeInCubic = t => t * t * t
fns.easeOutCubic = t => (--t) * t * t + 1
fns.easeInOutCubic = t => t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
fns.easeInQuart = t => t * t * t * t
fns.easeOutQuart = t => 1-(--t) * t * t * t
fns.easeInOutQuart = t => t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
fns.easeInQuint = t => t * t * t * t * t
fns.easeOutQuint = t => 1 + (--t) * t * t * t * t
fns.easeInOutQuint = t => t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t

fns.easeIn = (t, k) => (t ** k)
fns.easeOut = (t, k) => 1 - fns.easeIn(1 - t, k)
fns.easeInOut = (t, k) => t < .5 ?
  fns.easeIn(t * 2, k) / 2
  :
  1 - fns.easeIn((1 - t) * 2, k) / 2

fns.easeIn2 = t => fns.easeIn(t, 1.5)
fns.easeOut2 = t => fns.easeOut(t, 1.5)
fns.easeInOut2 = t => fns.easeInOut(t, 1.5)


export default fns