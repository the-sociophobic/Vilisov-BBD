// import classes from 'multiple-extend'
import THREE from 'libs/engines/3d/three'
// import Unit from 'libs/engines/3d/Unit'
import transitionHandler from 'libs/utils/handlers/transitionHandler'
import modelLoader from 'libs/engines/3d/modelLoader'

import coinModel from 'libs/engines/3d/models/coin.glb'


const coinAmount = 25
const ArenaRadius = 10
// const xAxis = new THREE.Vector3(1, 0, 0)
// const yAxis = new THREE.Vector3(0, 1, 0)
// const zAxis = new THREE.Vector3(0, 0, 1)

var dummy = new THREE.Object3D()

const coinInitialPos = () =>
  new THREE.Vector3(
    (Math.random() - .5) * 2 * ArenaRadius * .7,
    ArenaRadius * 2,
    (Math.random() - .5) * 2 * ArenaRadius * .7,
  )


export default class Coins extends transitionHandler {
  constructor(props) {
    super(props)

    this.coins = Array
      .from(
        {length: coinAmount},
        (coin, index) => ({
          index: index,
          emitted: false,
          position: coinInitialPos()
        })
      )

    this.loadModel()
  }

  loadModel = async () => {
    const coinMesh = await modelLoader(coinModel)

    this.coinInstance = new THREE.InstancedMesh(coinMesh.children[0].geometry, coinMesh.children[0].material, coinAmount)
    this.coinInstance.instanceMatrix.setUsage( THREE.DynamicDrawUsage )
    this.props.scene.add(this.coinInstance)

    for (let i = 0; i < coinAmount; i++) {
      dummy.position.copy(coinInitialPos())
      dummy.scale.set(5, 5, 5)
      dummy.updateMatrix()
      this.coinInstance.setMatrixAt(i, dummy.matrix)
    }
    this.coinInstance.instanceMatrix.needsUpdate = true

    this.emmitCoin()
  }

  animate = props => {
    if (!this.coinInstance)
      return

    // super.animate(props)
    this.animateTransitions()

    this.coins.forEach((coin, index) => {
      if (coin.emitted)
        dummy.position.copy(coin.position)
      else
        dummy.position.set(0, ArenaRadius * 5, 0)

      dummy.rotation.y = (index * 1000 + props.frameNumber * 100) / props.maxFrameNumber * Math.PI

      dummy.updateMatrix()
      this.coinInstance.setMatrixAt(index, dummy.matrix)
    })
    this.coinInstance.instanceMatrix.needsUpdate = true
  }

  dispose = () =>
    clearInterval(this.emmitCoinTimeout)


  emmitCoin = () => {
    const hiddenCoins = this.coins
      .filter(coin => !coin.emitted)

    if (hiddenCoins.length > 0) {
      const coinToEmmit = hiddenCoins[0]

      this.coins[coinToEmmit.index].position = coinInitialPos()
      this.coins[coinToEmmit.index].emitted = true
      this.registerTransition({
        variable: this.coins[coinToEmmit.index].position,
        value: (new THREE.Vector3()).copy(this.coins[coinToEmmit.index].position).setY(-1),
        numberOfFrames: 350,
        onComplete: () => this.coins[coinToEmmit.index].emitted = false
      })

      dummy.position.copy(this.coins[coinToEmmit.index].position)
      this.coinInstance.setMatrixAt(coinToEmmit.index, dummy.matrix)
    }

    this.emmitCoinTimeout = setTimeout(
      () => this.emmitCoin(),
      Math.round((1 + Math.random()) * 255)
    )
  }
}
