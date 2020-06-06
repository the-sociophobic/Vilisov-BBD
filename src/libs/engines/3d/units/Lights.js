import Unit from '~/src/libs/engines/3d/Unit'


const lightDistanceToModel = 35


export default class Lowpoly extends Unit {
  constructor(props) {
    super(props)

    const { scene, THREE } = props

    this.light0 = new THREE.HemisphereLight( 0xffffff, 0x444444, 0.75 )
    this.light0.position.set( 0, lightDistanceToModel, 0 )
    scene.add( this.light0 )
    this.light1 = new THREE.HemisphereLight( 0xffffff, 0x444444, 0.55 )
    this.light1.position.set( 0, -lightDistanceToModel, 0 )
    scene.add( this.light1 )
    
    this.light2 = new THREE.DirectionalLight( 0x7701ee, .75 )
    this.light2.position.set( 0, lightDistanceToModel, 0 )
    this.light2.castShadow = true
    scene.add( this.light2 )

    this.light3 = new THREE.DirectionalLight( 0x00cc0f, .65 )
    this.light3.position.set( -20, -lightDistanceToModel, 0 )
    this.light3.castShadow = true
    scene.add( this.light3 )

    this.light4 = new THREE.DirectionalLight( 0xff0000, .65 )
    this.light4.position.set( -20, -lightDistanceToModel, 0 )
    this.light4.castShadow = true
    scene.add( this.light4 )
  }

  animate = props => {
    const angle = props.frameNumber / 600 * Math.PI * 2

    this.light2.position.set(lightDistanceToModel * Math.sin(angle), lightDistanceToModel * Math.cos(angle), 0)
    this.light3.position.set(-20, -lightDistanceToModel * Math.cos(angle * 2), lightDistanceToModel * Math.sin(angle * 2))
    this.light3.position.set(-20, -lightDistanceToModel * Math.cos(angle * 3 + Math.PI / 2), lightDistanceToModel * Math.sin(angle * 3 + Math.PI / 2))
  }

  dispose = () => {}
}
