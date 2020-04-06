import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import Unit from 'libs/engines/3d/Unit'
import modelGLTF from './models/model.glb'
import isTouchDevice from 'libs/utils/isTouchDevice'


const clamp = (value, min, max) => Math.min(max, Math.max(value, min))
const lightDistanceToModel = 30

export default class Skybox extends Unit {
  constructor(props) {
    super(props)

    if (isTouchDevice()) {
      this.handleScroll()
      this.scrollUpdateInterval = setInterval(() => this.handleScroll(), 5)
    }
    else
      window.addEventListener('mousemove', this.handleMouseMove, false)

    const { scene, THREE } = props
    var that = this

    const loader = new GLTFLoader()
      .load(modelGLTF, gltf => {
        that.object = gltf.scene

        //COMMENT: Изначальное положение модели на экране
        that.object.scale.multiplyScalar(4)  //Размер
        that.object.translateZ(-23)             //Положение по Z
        that.object.translateY(-14.5)           //Положение по Y

        scene.add(that.object)
      })


    //COMMENT: Добавление света, его цвета и интенсивность
    this.light0 = new THREE.HemisphereLight( 0xffffff, 0x444444, 0.75 )
    this.light0.castShadow = true
    this.light0.position.set( 0, lightDistanceToModel, 0 )
    scene.add( this.light0 )
    //COMMENT: Добавление еще одного света
    this.light1 = new THREE.HemisphereLight( 0xffffff, 0x444444, 0.75 )
    this.light1.castShadow = true
    this.light1.position.set( 0, -lightDistanceToModel, 0 )
    scene.add( this.light1 )
    
    //COMMENT: Добавление еще одного света
    this.light2 = new THREE.DirectionalLight( 0xff00ff, .5 )
    this.light2.position.set( 0, lightDistanceToModel, 0 )
    this.light2.castShadow = true
    scene.add( this.light2 )

    //COMMENT: Добавление еще одного света
    this.light3 = new THREE.DirectionalLight( 0x00ff00, .5 )
    this.light3.position.set( -20, -lightDistanceToModel, 0 )
    this.light3.castShadow = true
    scene.add( this.light3 )

    this.counter = 0
  }

  animate() {
    if (this.counter > 400)
      this.counter = 0
    else
      this.counter++

    const angle = this.counter / 400 * Math.PI * 2

    //COMMENT: Как будет двигаться свет
    this.light2.position.set(lightDistanceToModel * Math.sin(angle), lightDistanceToModel * Math.cos(angle), 0)
    this.light3.position.set(-20, -lightDistanceToModel * Math.cos(angle), lightDistanceToModel * Math.sin(angle))
  }
  dispose() {}



  handleScroll = e => {
    if (!this.object)
      return

    const threeSceneElement = document.getElementById("three-scene")
    const getBodyScrollTop = () => Math.max(-threeSceneElement.getBoundingClientRect().top, 0)
    const alpha = clamp(getBodyScrollTop() / threeSceneElement.offsetHeight * .5, 0, .5)
  
    //COMMENT: Реакция модели на скролл на мобильных
    this.object.rotation.x = alpha
  }
  
  handleMouseMove = e => {
    if (!this.object)
      return
      
    if (!e.pageX || !e.pageY) {
      console.log("no mouse found")
      return
    }
  
    const alphaX = -clamp(e.pageX / window.innerWidth - .5, -.5, .5)
    const alphaY = clamp(e.pageY / window.innerHeight - .5, -.5, .5)
  
    //COMMENT: Реакция модели на движение мыши на десктопе
    this.object.rotation.y = -alphaX / 3
    this.object.rotation.x = .15 + alphaY / 3
  }
}
