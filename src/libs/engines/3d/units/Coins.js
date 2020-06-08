import TextSprite from 'three.textsprite'
import THREE from 'libs/engines/3d/three'
import transitionHandler from 'libs/utils/handlers/transitionHandler'
import modelLoader from 'libs/engines/3d/modelLoader'

import coinModel from 'libs/engines/3d/models/coin.glb'


const coinAmount = 300
const ArenaRadius = 300
// const xAxis = new THREE.Vector3(1, 0, 0)
// const yAxis = new THREE.Vector3(0, 1, 0)
// const zAxis = new THREE.Vector3(0, 0, 1)

var dummy = new THREE.Object3D()
var charachterPos = new THREE.Vector3()


const coinInitialPos = () =>
  new THREE.Vector3(
    (Math.random() - .5) * 2 * ArenaRadius * .7,
    35,
    (Math.random() - .5) * 2 * ArenaRadius * .7,
  )


export default class Coins extends transitionHandler {
  constructor(props) {
    super(props)

    this.sprites = [
      "🌅",
      "🏆",
      "✨",
      "👌🏻",
      "❤️",
    ].map(text => {
      let sprite = new TextSprite({
        material: {
          color: 0xFFFFFF,
          // fog: false,
        },
        redrawInterval: false,
        textSize: 3,
        minFontSize: 128,
        maxFontSize: 128,
        texture: {
          // fontFamily: `'RF-Dewi', sans-serif`,
          // fontWeight: 700,
          text: text,
        },  
      })
      sprite.position.set(0, ArenaRadius * 2, 0)
      props.scene.add(sprite)
    
      return sprite
    })

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

    charachterPos.copy(props.controls.target)
    charachterPos.setY(charachterPos.y - 3)

    this.coins.forEach((coin, index) => {
      const distance = coin.position.distanceTo(charachterPos)

      if (distance < 3) {
        coin.emitted = false
        var shownSprite = this.sprites[Math.round(Math.random() * (this.sprites.length - 1))]
        shownSprite.position.copy(charachterPos)
        shownSprite.position.setY(shownSprite.position.y + 4)
        this.registerTransition({
          variable: shownSprite.position,
          value: new THREE.Vector3(shownSprite.position.x, shownSprite.position.y + 3, shownSprite.position.z),
          numberOfFrames: 25,
          timingFuntion: 'easeOutQuad',
          onComplete: () => shownSprite.position.setY(ArenaRadius * 2),
        })
      }

      if (coin.emitted) {
        dummy.position.copy(coin.position)
        switch (index % 3) {
          case 0:
            dummy.rotation.x = (index * 1000 + props.frameNumber * 100) / props.maxFrameNumber * Math.PI
            break
          case 1:
            dummy.rotation.y = (index * 1000 + props.frameNumber * 100) / props.maxFrameNumber * Math.PI
            break
          case 2:
            dummy.rotation.z = (index * 1000 + props.frameNumber * 100) / props.maxFrameNumber * Math.PI
            break
        }  
      }
      else
        dummy.position.set(0, ArenaRadius * 5, 0)

      dummy.updateMatrix()
      this.coinInstance.setMatrixAt(index, dummy.matrix)
    })
    this.coinInstance.instanceMatrix.needsUpdate = true
  }

  dispose = () =>
    clearTimeout(this.emmitCoinTimeout)


  emmitCoin = () => {
    const hiddenCoins = this.coins
      .filter(coin => !coin.emitted)

    if (hiddenCoins.length > coinAmount / 3) {
      var coinToEmmit = hiddenCoins[0]

      coinToEmmit.position = coinInitialPos()
      coinToEmmit.emitted = true
      this.registerTransition({
        variable: coinToEmmit.position,
        value: (new THREE.Vector3()).copy(coinToEmmit.position).setY(-1),
        numberOfFrames: Math.round((1 + Math.random()) * 250),
        onComplete: () => coinToEmmit.emitted = false
      })

      dummy.position.copy(coinToEmmit.position)
      this.coinInstance.setMatrixAt(coinToEmmit.index, dummy.matrix)
    }

    this.emmitCoinTimeout = setTimeout(
      () => this.emmitCoin(),
      Math.round((1 + Math.random()) * 2)
    )
  }
}
