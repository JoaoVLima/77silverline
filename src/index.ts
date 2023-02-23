import Core from './core'
import * as THREE from "three";

function init(){
    const core = new Core();
    const camera = core.camera
    const scene = core.scene
    const renderer = core.renderer


    let onWindowResize = function () {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }

    window.addEventListener( 'resize', onWindowResize );

    let render = function () {
        const time = performance.now() / 300;

        const knot = scene.getObjectByName( 'Knot' ) as THREE.Mesh;
        knot.rotation.y = time/4;
        knot.position.x = Math.cos( time/8 ) * 4;
        knot.position.z = Math.sin( time/8 ) * 4;

        renderer.render(scene, camera);

    };
    renderer.setAnimationLoop( render );
}

init();
