import React from 'react'
import ReactDOMServer from 'react-dom/server'


import THREE from 'libs/engines/3d/three'
import Unit from 'libs/engines/3d/Unit'
import modelLoader from 'libs/engines/3d/modelLoader'
import textureLoader from 'libs/engines/3d/textureLoader'

import treeModel from 'libs/engines/3d/models/tree.glb'
import planeTextureImage from 'libs/engines/3d/textures/blackgrid.jpg'
import backgroundMusic from 'sounds/background.mp3'

const treeAmount = 75
const ArenaRadius = 300

export default class Laandscape extends Unit {
  constructor(props) {
    super(props)

    this.audio = new Audio(backgroundMusic)
    this.audio.addEventListener('ended', () => {
      this.audio.currentTime = 0
      this.audio.play()
    })

    this.loadModel()
    this.addSoundButton()
    
  }

  loadModel = async () => {
    var planeTexture = await textureLoader(planeTextureImage)
    planeTexture.wrapS = THREE.RepeatWrapping
    planeTexture.wrapT = THREE.RepeatWrapping
    planeTexture.repeat.set( 27, 27 )
    this.plane = new THREE.Mesh(
      new THREE.PlaneGeometry( 2 * ArenaRadius, 2 * ArenaRadius, 1, 1 ),
      new THREE.MeshBasicMaterial({
        map: planeTexture,
        side: THREE.DoubleSide,
      })
    )
    this.plane.rotateX(Math.PI / 2)
    this.props.scene.add( this.plane )

    const treeMesh = (await modelLoader(treeModel)).scene
    var dummy = new THREE.Object3D()
    var treePos = new THREE.Vector3()

    this.treeInstance = new THREE.InstancedMesh(treeMesh.children[0].geometry, treeMesh.children[0].material, treeAmount)
    this.treeInstance.instanceMatrix.setUsage( THREE.DynamicDrawUsage )
    this.props.scene.add(this.treeInstance)

    this.trees = []
    for (let i = 0; i < treeAmount; i++) {
      let randomX = Math.max(Math.random(), .1) * Math.sign(Math.random() - .5)
      let randomZ = Math.max(Math.random(), .1) * Math.sign(Math.random() - .5)

      treePos
        .set(
          ArenaRadius * randomX,
          ArenaRadius / 8 * Math.random(),
          ArenaRadius * randomZ,
        )

      let scale = (1 + Math.random()) * 10
      dummy.scale.set(scale, scale, scale)
      dummy.position.copy(treePos)
      this.trees.push({
        position: (new THREE.Vector3()).copy(dummy.position),
        scale: scale,
      })
      dummy.rotation.y = (-.5 + Math.random()) * Math.PI / 2
      dummy.rotation.x = (.5 + Math.random()) * Math.PI / 2
      dummy.updateMatrix()
      this.treeInstance.setMatrixAt(i, dummy.matrix)
    }

    this.treeInstance.instanceMatrix.needsUpdate = true
  }


  addSoundButton = () => {
    document.getElementById("root")
      .insertAdjacentHTML('beforeend',
        ReactDOMServer.renderToString(
          this.renderSoundButton()))

    window.addEventListener("click", e => {
      if (e.target.id === "sound-alert")
        this.hideSoundButton()
    })      
  }

  hideSoundButton = () => {
    console.log("a")
    const elem = document.getElementById("sound-alert")
    document.getElementById("root").removeChild(elem)
    this.audio.play()
  }

  renderSoundButton = () => (
    <div
      id="sound-alert"
      className="sound-alert"
    >
      включить звук <span
        className="emoji"
        role="img"
        aria-label="sound"
        title="sound"
      >
        🔈
      </span>
    </div>
  )

  animate = props => {}
  dispose = () => {}
}
