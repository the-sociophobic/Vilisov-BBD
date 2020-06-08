import Unit from 'libs/engines/3d/Unit'


export default class Fog extends Unit {
  constructor(props) {
    super(props)

    const { scene, THREE } = props

    this.fog = new THREE.Fog(0x444444, 35, 155)
    scene.fog = this.fog
  }

  animate = props => {}
  dispose = () => {}
}
