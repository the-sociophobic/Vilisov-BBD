import Skybox from './engines/3d/units/Skybox'
import Lowpoly from './engines/3d/units/Lowpoly'
import EasterEgg from './engines/3d/units/EasterEgg'


export default {
  units: {
    // skybox: {
    //   unit: Skybox,
    //   disabled: false,
    // },
    lowpoly: {
      unit: Lowpoly,
      disabled: false,
    },
    EasterEgg: {
      unit: EasterEgg,
      disabled: false,
    },
  }
}