import Skybox from 'libs/engines/3d/units/Skybox'
import Lowpoly from 'libs/engines/3d/units/Lowpoly'
import Box from 'libs/engines/3d/units/Box'

export default {
  units: {
    skybox: {
      unit: Skybox,
      disabled: false,
    },
    lowpoly: {
      unit: Lowpoly,
      disabled: false,
    },
    // box: {
    //   unit: Box,
    //   disabled: false,
    // },
  }
}