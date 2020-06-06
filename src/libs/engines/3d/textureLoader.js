import THREE from '~/src/libs/engines/3d/three'

const regeneratorRuntime = require("regenerator-runtime")


export default async file =>
  new Promise((res, rej) =>
    new THREE.TextureLoader()
      .load(file,
        texture =>
          res(texture),
        progress => {},
        error =>
          rej(error)
      )
  )