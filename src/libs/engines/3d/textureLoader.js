import THREE from 'libs/engines/3d/three'


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