import Core from './core';
import { Evento } from './eventos';
import Eventos from './eventos';
import * as THREE from "three";
// import {Pane} from 'tweakpane';
// import * as EssentialsPlugin from '@tweakpane/plugin-essentials';

// function clamp(num: number, min: number, max: number): number {
//     return num < min
//             ? max
//             : num > max
//             ? min
//             : num;
// }

async function init() {
    const core = new Core();
    const camera = core.camera;
    const scene = core.scene;
    const renderer = core.renderer;

    // const pane = new Pane();
    // pane.registerPlugin(EssentialsPlugin);
    // const fpsGraph = pane.addBlade({
    //   view: 'fpsgraph',
    //   label: 'fpsgraph',
    //   lineCount: 2,
    // });


    let obj_events = new Eventos([{
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

    await fetch('../eventos.json')
        .then(result => result.json())
        .then(data => {
            obj_events = new Eventos(data);
        })
        .catch(error => console.error(error));

    const main = document.getElementsByTagName("main")[0] as HTMLDivElement;
    const progress = document.getElementsByClassName("progress")[0] as HTMLDivElement;

    const sectionComponent = function (e:Evento, index:number) {
        let section = document.createElement('section');
        section.className = 'grid-container';
        section.accessKey = String(index);
        section.id = e.id;

        let div = document.createElement('div');
        div.className = 'grid-item grid-middle';

        let wrapper_main = document.createElement('div');
        wrapper_main.className = 'wrapper-main';

        let h1 = document.createElement('h1');
        h1.innerText = e.titulo
        wrapper_main.appendChild(h1);

        let p = document.createElement('p');
        p.innerText = e.descricao
        wrapper_main.appendChild(p);

        section.appendChild(div);
        div.appendChild(wrapper_main)
        main.appendChild(section);
    };

     Array.from(obj_events.eventos).forEach(function callback(value, index){
        sectionComponent(value, index)
    });



    const onMainMouseScroll = function () {
        let scrollPercent = ((main.scrollTop || main.scrollTop) /
                            ((main.scrollHeight || main.scrollHeight) -
                            main.clientHeight));
        progress.style.height = `${scrollPercent*100}vh`;

        detectCurrent();
        const mesh = scene.getObjectByName('album') as THREE.Mesh;
        mesh.rotation.y = (main.scrollTop / (main.clientHeight * 0.3191)) % Math.PI;
    }
    main.addEventListener("scroll", onMainMouseScroll);

    type element_wrapper = {
        element: HTMLDivElement,
        bounds: DOMRect,
        offsetY: number,
    }

    let containerBounds: DOMRect;

    // Store items as an array of objects
    const items = Array.from(document.getElementsByTagName('section')).map(object => ({
        element: object,
        bounds: object.getBoundingClientRect(),
        offsetY: object.getBoundingClientRect().top
    } as element_wrapper)) as element_wrapper[]

    const storeBounds = function (){
        // Store the bounds of the container
        containerBounds = main.getBoundingClientRect() // triggers reflow
        // Store the bounds of each item
        items.forEach((item) => {
            item.bounds = item.element.getBoundingClientRect() // triggers reflow
            item.offsetY = item.bounds.top - containerBounds.top // store item offset distance from container
        })
    }
    storeBounds() // Store bounds on load

    const onWindowResize = function () {
        storeBounds();
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);

    }
    window.addEventListener('resize', onWindowResize);

    let currentItem: element_wrapper;
    let index = 0;
    const album = scene.getObjectByName('album') as THREE.Mesh;
    let texture = new THREE.TextureLoader().load(obj_events.eventos[index]['link_imagem']);
    let mat = album.material as THREE.MeshBasicMaterial;
    mat.map = texture;
    mat.needsUpdate = true;

    const detectCurrent = function (){
        const scrollY = main.scrollTop // Container scroll position
        const goal = 0 // Where we want the current item to be, 0 = top of the container
        // Find item closest to the goal
        currentItem = items.reduce((prev:element_wrapper|any, curr:element_wrapper) => {
            if (curr && prev || curr.offsetY && prev.offsetY){
                return (Math.abs(curr.offsetY - scrollY - goal) < Math.abs(prev.offsetY - scrollY - goal) ? curr : prev); // return the closest to the goal
            }
            return null
        });

        let newindex = Number(currentItem.element.accessKey);
        if(index != newindex){
            texture = new THREE.TextureLoader().load(obj_events.eventos[newindex]['link_imagem']);
            // const temp = mat.map as THREE.Texture;
            mat.map = texture;
            mat.needsUpdate = true;
            index = newindex;
        }
    }
    detectCurrent();

    // const mesh = scene.getObjectByName('album') as THREE.Mesh;
    // const texture = new THREE.TextureLoader().load(eventos[index]['link_imagem']);
    // const mat = mesh.material as THREE.MeshBasicMaterial;
    // mat.map = texture;
    // mat.needsUpdate = true

    let mouseX = 0;
    let mouseY = 0;

    const onDocumentMouseMove = function (event:MouseEvent) {
        mouseX = (event.clientX - (window.innerWidth/2));
        mouseY = (event.clientY - (window.innerHeight/2));

        camera.position.x = (mouseX - camera.position.x) * .003;
        camera.position.y = (-mouseY - camera.position.y) * .006;

        camera.lookAt(scene.position);
    }
    document.addEventListener( 'mousemove', onDocumentMouseMove );

    const onDocumentMouseLeave = function () {
        camera.position.set(0, 0, 8);
        camera.lookAt(new THREE.Vector3(0, 0, 0))
    }
    document.addEventListener( 'mouseleave', onDocumentMouseLeave );

    let render = function () {
        // fpsGraph.begin()
        renderer.render(scene, camera);
        // fpsGraph.end()
    };
    renderer.setAnimationLoop(render);

}
init();
