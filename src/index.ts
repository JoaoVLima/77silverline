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
        // const time = performance.now() / 300;

        const mesh = scene.getObjectByName( 'album' ) as THREE.Mesh;

        mesh.rotation.y += 0.01;
        if (mesh.rotation.y > Math.PI) {
            mesh.rotation.y -= Math.PI;
            const mat = mesh.material as THREE.MeshBasicMaterial;
            const temp = mat.map as THREE.Texture;
            mat.map = mat.lightMap;
            mat.lightMap = temp;
            mat.needsUpdate = true;
        }

        renderer.render(scene, camera);

    };
    renderer.setAnimationLoop( render );
}

init();
