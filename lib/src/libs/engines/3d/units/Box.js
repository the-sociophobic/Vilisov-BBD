import Unit from 'libs/engines/3d/Unit'


export default class Skybox extends Unit {
  constructor(props) {
    super(props)
    const { THREE, scene } = props

    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube )

  }
  animate() {
  }
  dispose() {}
}
