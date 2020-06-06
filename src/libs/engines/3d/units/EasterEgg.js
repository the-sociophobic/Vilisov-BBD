// import { Refractor } from './Refractor'
// import { WaterRefractionShader } from './WaterRefractionShader'
// import backgrounds from '../Logo/img/backgrounds'

import Unit from '../Unit'

import tapEvent from '../../../utils/tapEvent'


const clicksNeeded = 20

const textures = [
  "https://sun9-11.userapi.com/c858024/v858024693/e5555/9P6IqwFmXec.jpg",
  "https://sun9-21.userapi.com/c851432/v851432308/a75d/ppf63WwN4eY.jpg",
  "https://sun9-29.userapi.com/c639322/v639322344/4e3e3/bK3C8o8SYk4.jpg",
  // "https://sun9-53.userapi.com/c854524/v854524420/2156c5/qJFFibkPBQY.jpg",
  // "https://sun9-2.userapi.com/c855220/v855220379/1bb564/UHTzG2dLx3s.jpg",
  // "https://sun9-41.userapi.com/c856028/v856028379/16270e/qoetixUkat4.jpg", //UU2
  "https://sun9-34.userapi.com/c857520/v857520572/140ad4/xXrrNuE1Mmo.jpg", //graph
  "https://sun9-39.userapi.com/c847123/v847123469/19ddbd/fEJSTgKCiA0.jpg", //fedlud
  "https://sun9-24.userapi.com/c847123/v847123469/19dd92/DVEniNTr89A.jpg", //bek
  "https://sun9-7.userapi.com/c847123/v847123469/19de14/bt5dMHxz0yA.jpg", //I
  "https://sun9-3.userapi.com/c844320/v844320469/1ad7b1/fTQZtUxvQ_I.jpg", //cover 3
  "https://sun9-48.userapi.com/c857136/v857136370/120dab/nXbxgoyQGmw.jpg", //liter
  "https://sun9-69.userapi.com/c856028/v856028379/162731/h_llrMMbpbg.jpg", //stop bulling
]

export default class EasterEgg extends Unit {
  constructor(props) {
    super(props)
    const { renderer } = props

    this.clickCounter = 0
    const elem = document.getElementsByClassName("Viewer")[0]
    elem.addEventListener("click", this.registerClick)
    tapEvent(elem, this.registerClick)
  }

  registerClick = () => {
    this.clickCounter++
    // console.log(`clicks before R4VE: ${clicksNeeded - this.clickCounter}`)
    if (this.clickCounter === clicksNeeded)
      this.init()
  }

  init = () => {
    var sound      = document.createElement('audio')
    sound.autoplay = "autoplay"
    sound.src      = 'https://drive.google.com/u/0/uc?id=1J4mUIvLltOBGuri5XP1BBeGu1YGyNjXY&export=download'
    sound.type     = 'audio/mp3'
    sound.loop = true
    this.props.renderer.domElement.appendChild(sound)

    const { scene } = this.props
    

    var geometry = new THREE.BufferGeometry();
    var vertices = [], parameters, materials = [];

    var textureLoader = new THREE.TextureLoader();
    var sprites = textures.map(tex => textureLoader.load( tex ))
    // var sprite0 = textureLoader.load( textures[0] );
    // var sprite1 = textureLoader.load( textures[1] );
    // var sprite2 = textureLoader.load( textures[2] );
    // var sprite3 = textureLoader.load( textures[3] );
    // var sprite4 = textureLoader.load( textures[4] );
    // var sprite5 = textureLoader.load( textures[5] );
    // var sprite6 = textureLoader.load( textures[6] );
    // var sprite7 = textureLoader.load( textures[7] );
    // var sprite8 = textureLoader.load( textures[8] );
    // var sprite9 = textureLoader.load( textures[9] );

    for ( var i = 0; i < 5000; i ++ ) {

      var x = Math.random() * 2000 - 1000;
      var y = Math.random() * 2000 - 1000;
      var z = Math.random() * 2000 - 1000;

      vertices.push( x, y, z );

    }

    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

    // parameters = [
    //   [[ 1.0, 0.2, 0.45 ], sprite0, 20 ],
    //   [[ 0.95, 0.1, 0.5 ], sprite1, 15 ],
    //   [[ 0.90, 0.05, 0.55 ], sprite2, 10 ],
    //   [[ 0.85, 0, 0.5 ], sprite3, 8 ],
    //   [[ 0.80, 0, 0.5 ], sprite4, 5 ],
    //   [[ 0.75, 0.2, 0.65 ], sprite5, 20 ],
    //   [[ 0.7, 0.1, 0.5 ], sprite6, 15 ],
    //   [[ 0.65, 0.15, 0.15 ], sprite7, 10 ],
    //   [[ 0.6, 0, 0.35 ], sprite8, 8 ],
    //   [[ 0.55, 0, 0.25 ], sprite9, 5 ]
    // ];


    for ( var i = 0; i < sprites.length; i ++ ) {
      var sprite = sprites[i];
      var size = 25;

      materials[ i ] = new THREE.PointsMaterial( {
        size: size,
        map: sprite,
        // blending: THREE.AdditiveBlending,
        // depthTest: false,
        // transparent: true 
      } );
      // materials[ i ].color.setHSL( color[ 0 ], color[ 1 ], color[ 2 ] );

      var particles = new THREE.Points( geometry, materials[ i ] );

      particles.rotation.x = Math.random() * 6;
      particles.rotation.y = Math.random() * 6;
      particles.rotation.z = Math.random() * 6;

      scene.add( particles );

    }

  }

  animate = () => {
    const { scene } = this.props
    var time = Date.now() * 0.000005

    for ( var i = 0; i < scene.children.length; i ++ ) {

      var object = scene.children[ i ];

      if ( object instanceof THREE.Points ) {

        object.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) );

      }

    }
  }

  dispose = () => {
    if (this.clickCounter >= clicksNeeded)
      if (isTouchDevice())
        clearInterval(this.scrollUpdateInterval)
      else
        window.removeEventListener('mousemove', this.handleMouseMove, false)
  }
  
}