import clamp from 'clamp'
import THREE from 'libs/engines/3d/three'
import Unit from 'libs/engines/3d/Unit'
import modelLoader from 'libs/engines/3d/modelLoader'
import textureLoader from 'libs/engines/3d/textureLoader'

import treeModel from 'libs/engines/3d/models/tree.glb'
import planeTextureImage from 'libs/engines/3d/textures/blackgrid.jpg'
import backgroundMusic from 'sounds/background.mp3'

const treeAmount = 75
const ArenaRadius = 300
const xAxis = new THREE.Vector3(1, 0, 0)
const yAxis = new THREE.Vector3(0, 1, 0)
// const zAxis = new THREE.Vector3(0, 0, 1)

export default class Character extends Unit {
  constructor(props) {
    super(props)

    this.audio = new Audio(backgroundMusic)
    this.audio.addEventListener('ended', () => {
      this.audio.currentTime = 0
      this.audio.play()
    })
    this.audio.play()
    this.loadModel()
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

  animate = props => {}
  dispose = () => {}
}
