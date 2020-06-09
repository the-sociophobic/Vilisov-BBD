import TextSprite from 'three.textsprite'
import THREE from 'libs/engines/3d/three'
import transitionHandler from 'libs/utils/handlers/transitionHandler'
import modelLoader from 'libs/engines/3d/modelLoader'

import coinModel from 'libs/engines/3d/models/coin.glb'


const coinAmount = 300
const ArenaRadius = 300
const initialScale = new THREE.Vector3(12, 12, 12)
const finalScale = new THREE.Vector3(.1, .1, .1)

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
      "✨",
      "❤️",
      "💋🐸",
      "🧠👌🏻",
      "🛹👙",
      "💻",
      "🇮🇱",
      "💜🌙",
      "🇷🇺⬆️",
      "🦊🛏",
      "🔞",
      "🥭",
      "🏳️‍🌈",
      "👨‍👨‍👦📕",
      "🎨🙅🏻‍♀️",
      "😎👮🏾‍♂️",
      "🎤💩",
      "🥖",
      "👑",
      "🧬🏆",
      "🕹",
      "💡",
      "✊🏾🔥",
      "🦠🏡",
      "🐞🧝🏼‍♀",
      "🎭🚧",
      "🐖👃🏻",
      "🐍🚸",
      "⏳😬",
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
          transitionId: undefined,
          position: coinInitialPos(),
          scale: initialScale.clone(),
        })
      )

    this.loadModel()
  }

  loadModel = async () => {
    const coinMesh = (await modelLoader(coinModel)).scene

    this.coinInstance = new THREE.InstancedMesh(coinMesh.children[0].geometry, coinMesh.children[0].material, coinAmount)
    this.coinInstance.instanceMatrix.setUsage( THREE.DynamicDrawUsage )
    this.props.scene.add(this.coinInstance)

    const middleOfArray = Math.floor(this.coins.length)
    for (let i = 0; i < middleOfArray; i++)
      this.emmitCoin(this.coins[i])
    
    setTimeout(() => {
      for (let i = middleOfArray; i < this.coins.length; i++)
        this.emmitCoin(this.coins[i])
    }, 3000)
  }

  animate = props => {
    if (!this.coinInstance)
      return

    this.animateTransitions()

    charachterPos.copy(props.controls.target)
    charachterPos.setY(charachterPos.y - 3)

    this.coins.forEach(coin => {
      //COLLISION
      const distance = coin.position.distanceTo(charachterPos)

      if (distance < 5) {
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

        this.emmitCoin(coin)
      }

      //FALL AND ROTATION
      dummy.position.copy(coin.position)
      dummy.scale.copy(coin.scale)
      switch ((coin.index) % 3) {
        case 0:
          dummy.rotation.x = (coin.index * 1000 + props.frameNumber * 100) / props.maxFrameNumber * Math.PI
          break
        case 1:
          dummy.rotation.y = (coin.index * 1000 + props.frameNumber * 100) / props.maxFrameNumber * Math.PI
          break
        case 2:
          dummy.rotation.z = (coin.index * 1000 + props.frameNumber * 100) / props.maxFrameNumber * Math.PI
          break
      }  

      dummy.updateMatrix()
      this.coinInstance.setMatrixAt(coin.index, dummy.matrix)
    })
    this.coinInstance.instanceMatrix.needsUpdate = true
  }


  emmitCoin = coin => {
    coin.position.copy(coinInitialPos())
    coin.scale.copy(initialScale)

    this.unregisterTransition(coin.transitionId)

    coin.transitionId = this.registerTransition({
      variable: coin.position,
      value: (new THREE.Vector3()).copy(coin.position).setY(1),
      numberOfFrames: Math.round((.25 + Math.random()) * 250),
      onComplete: () => {
        coin.transitionId = this.registerTransition({
          variable: coin.scale,
          value: finalScale,
          numberOfFrames: 150,
          timingFuntion: 'easeInQuad',
          onComplete: () => this.emmitCoin(coin)
        })
      }
    })

    dummy.position.copy(coin.position)
    dummy.scale.copy(coin.scale)
    dummy.updateMatrix()
    this.coinInstance.setMatrixAt(coin.index, dummy.matrix)
    this.coinInstance.instanceMatrix.needsUpdate = true
  }
}
