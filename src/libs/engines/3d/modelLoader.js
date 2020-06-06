import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const regeneratorRuntime = require("regenerator-runtime")


export default async model =>
  new Promise((res, rej) =>
    new GLTFLoader()
      .load(
        model,
        gltf =>
          res(gltf.scene),
        progress =>
          console.log((progress.loaded / progress.total * 100) + '% loaded'),
        error =>
          rej(error),
      )
  )
