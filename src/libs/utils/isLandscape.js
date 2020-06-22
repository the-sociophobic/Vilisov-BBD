import isMobile from 'libs/utils/isMobile'


export default () =>
  isMobile() &&
  window.matchMedia("(orientation: landscape)").matches &&
  window.innerWidth <= 1366 && window.innerHeight <= 1024 &&
  window.innerWidth > window.innerHeight