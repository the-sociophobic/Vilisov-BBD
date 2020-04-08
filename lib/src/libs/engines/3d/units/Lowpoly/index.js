import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import Unit from '../../Unit'
import modelGLTF from './models/model.glb'
import isTouchDevice from '../../../../utils/isTouchDevice'
// import load from 'little-loader'

const clamp = (value, min, max) => Math.min(max, Math.max(value, min))
const lightDistanceToModel = 35

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

    var manager = new THREE.LoadingManager()
    manager 
    // load("https://drive.google.com/u/0/uc?id=1wZkZ5lo8JOlaLrRmdcNyAO2hrE_ioHty&export=download", modelGLTF => {
    // load("http://localhost:3010/vilisov-model", modelGLTF => {
      const loader = new GLTFLoader()
      // .load(modelGLTF, gltf => {
      .load(modelGLTF, gltf => {
        that.object = gltf.scene

        //COMMENT: Изначальное положение модели на экране
        const aspect = Math.min(props.camera.aspect, 1) ** .5
        that.object.scale.multiplyScalar(4 * aspect)  //Размер
        // that.object.translateZ(-2 / aspect)             //Положение по Z
        that.object.translateY(-14.5 * aspect)           //Положение по Y

        scene.add(that.object)
      })
    // })



    //COMMENT: Добавление света, его цвета и интенсивность
    this.light0 = new THREE.HemisphereLight( 0xffffff, 0x444444, 0.75 )
    // this.light0.castShadow = true
    this.light0.position.set( 0, lightDistanceToModel, 0 )
    scene.add( this.light0 )
    //COMMENT: Добавление еще одного света
    this.light1 = new THREE.HemisphereLight( 0xffffff, 0x444444, 0.55 )
    // this.light1.castShadow = true
    this.light1.position.set( 0, -lightDistanceToModel, 0 )
    scene.add( this.light1 )
    
    //COMMENT: Добавление еще одного света
    this.light2 = new THREE.DirectionalLight( 0x7701ee, .75 )
    this.light2.position.set( 0, lightDistanceToModel, 0 )
    this.light2.castShadow = true
    scene.add( this.light2 )

    //COMMENT: Добавление еще одного света
    this.light3 = new THREE.DirectionalLight( 0x00cc0f, .65 )
    this.light3.position.set( -20, -lightDistanceToModel, 0 )
    this.light3.castShadow = true
    scene.add( this.light3 )

    //COMMENT: Добавление еще одного света
    this.light4 = new THREE.DirectionalLight( 0xff0000, .65 )
    this.light4.position.set( -20, -lightDistanceToModel, 0 )
    this.light4.castShadow = true
    scene.add( this.light4 )

    this.counter = 0
  }

  animate() {
    const maxCounter = 600
    if (this.counter > maxCounter)
      this.counter = 0
    else
      this.counter++

    const angle = this.counter / maxCounter * Math.PI * 2

    //COMMENT: Как будет двигаться свет
    this.light2.position.set(lightDistanceToModel * Math.sin(angle), lightDistanceToModel * Math.cos(angle), 0)
    this.light3.position.set(-20, -lightDistanceToModel * Math.cos(angle * 2), lightDistanceToModel * Math.sin(angle * 2))
    this.light3.position.set(-20, -lightDistanceToModel * Math.cos(angle * 3 + Math.PI / 2), lightDistanceToModel * Math.sin(angle * 3 + Math.PI / 2))
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
