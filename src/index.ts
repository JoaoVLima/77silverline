import Core from './core';
import Events from './events';
import * as THREE from "three";

async function init(){
    const core = new Core();
    const camera = core.camera
    const scene = core.scene
    const renderer = core.renderer

    let obj_events: Events;

    await fetch('../events.json')
        .then(result => result.json())
        .then(data => {
            obj_events = new Events(data);
        })
        .catch(error => console.error(error));


    let onWindowResize = function() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }

    window.addEventListener( 'resize', onWindowResize );

    let clamp = function(num:number, min:number, max:number):number {
        return num < min
               ? max
               : num > max
               ? min
               : num;
    }

    let index = 0;

    const mesh = scene.getObjectByName( 'album' ) as THREE.Mesh;
    // @ts-ignore
    const texture = new THREE.TextureLoader().load(obj_events.events[index]['link_imagem']);
    const mat = mesh.material as THREE.MeshBasicMaterial;
    mat.map = texture;

    index++;

    let render = function() {

        const mesh = scene.getObjectByName( 'album' ) as THREE.Mesh;

        // @ts-ignore
        const texture = new THREE.TextureLoader().load(obj_events.events[index]['link_imagem']);

        mesh.rotation.y += 0.02;
        if (mesh.rotation.y > Math.PI) {
            mesh.rotation.y -= Math.PI;
            const mat = mesh.material as THREE.MeshBasicMaterial;
            // const temp = mat.map as THREE.Texture;
            mat.map = texture;
            mat.needsUpdate = true;
            index = clamp(index+1, 0, obj_events.events.length-1);
        }

        renderer.render(scene, camera);

    };
    renderer.setAnimationLoop( render );
}

init();
