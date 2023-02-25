import Core from './core';
import Events from './events';
import * as THREE from "three";
// import {Pane} from 'tweakpane';
// import * as EssentialsPlugin from '@tweakpane/plugin-essentials';

async function init() {
    const core = new Core();
    const camera = core.camera
    const scene = core.scene
    const renderer = core.renderer

    // const pane = new Pane();
    // pane.registerPlugin(EssentialsPlugin);
    // const fpsGraph = pane.addBlade({
    //   view: 'fpsgraph',
    //   label: 'fpsgraph',
    //   lineCount: 2,
    // });


    let obj_events = new Events([{
        "id": "77SL001",
        "artist": "Truno",
        "titulo": "Valentine",
        "descricao": "",
        "data": "09/12/2021",
        "tipo": "EP",
        "link_imagem": "https://i.scdn.co/image/ab67616d0000b273dcc6628b1565cde3ee672776",
        "link_spotify": "https://open.spotify.com/album/35nHXuu9rlq49Opzf5rBrq?si=RLzVhz_2TI-HHnCm0x3rXA",
        "link_soundcloud": "https://soundcloud.com/truno77/sets/valentine?si=dd3b2d052e804b15923ea12167806eb8&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing"
    }]);

    await fetch('../events.json')
        .then(result => result.json())
        .then(data => {
            obj_events = new Events(data);
        })
        .catch(error => console.error(error));


    let onWindowResize = function () {
        storeBounds();
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }

    window.addEventListener('resize', onWindowResize);

    const container = document.getElementById("container") as HTMLDivElement;

    let onDocumentMouseScroll = function () {
        //calculate the current scroll progress as a percentage
        // scrollPercent = ((container.scrollTop || container.scrollTop) /
        //                 ((container.scrollHeight || container.scrollHeight) -
        //                 container.clientHeight));
        detectCurrent();
        const mesh = scene.getObjectByName('album') as THREE.Mesh;
        mesh.rotation.y = (container.scrollTop / (container.clientHeight * 0.3191)) % Math.PI;

    };
    container.onscroll = onDocumentMouseScroll

    type ele = {
        el: Element,
        bounds: DOMRect,
        offsetY: number,
    }

    let containerBounds: DOMRect;

    const lista = obj_events.events;


    // Store items as an array of objects
    const items = Array.from(document.querySelectorAll('.secao')).map(elem => ({el:elem} as ele))

    const storeBounds = function (){
        // Store the bounds of the container
        containerBounds = container.getBoundingClientRect() // triggers reflow
        // Store the bounds of each item
        items.forEach((item) => {
            item.bounds = item.el.getBoundingClientRect() // triggers reflow
            item.offsetY = item.bounds.top - containerBounds.top // store item offset distance from container
        })
    }
    storeBounds() // Store bounds on load

    let currentItem: ele;

    let index = 0;

    const detectCurrent = function (){
        const scrollY = container.scrollTop // Container scroll position
        const goal = 0 // Where we want the current item to be, 0 = top of the container
        // Find item closest to the goal
        currentItem = items.reduce((prev, curr) => {
            return (Math.abs(curr.offsetY - scrollY - goal) < Math.abs(prev.offsetY - scrollY - goal) ? curr : prev); // return the closest to the goal
        });


        let newindex = Number(currentItem.el.id)-1;
        if(index != newindex){
            const mesh = scene.getObjectByName('album') as THREE.Mesh;
            const texture = new THREE.TextureLoader().load(lista[newindex]['link_imagem']);
            const mat = mesh.material as THREE.MeshBasicMaterial;
            // const temp = mat.map as THREE.Texture;
            mat.map = texture;
            mat.needsUpdate = true;
            index = newindex;
        }




    }
    detectCurrent();


    // let clamp = function (num: number, min: number, max: number): number {
    //     return num < min
    //             ? max
    //             : num > max
    //             ? min
    //             : num;
    // }

    const mesh = scene.getObjectByName('album') as THREE.Mesh;
    const texture = new THREE.TextureLoader().load(lista[index]['link_imagem']);
    const mat = mesh.material as THREE.MeshBasicMaterial;
    mat.map = texture;
    mat.needsUpdate = true

    let render = function () {
        // fpsGraph.begin()
        renderer.render(scene, camera);
        // fpsGraph.end()
    };
    renderer.setAnimationLoop(render);
}

init();
