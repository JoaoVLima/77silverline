import Core from './core';
import Events from './events';
import * as THREE from "three";
// import {Pane} from 'tweakpane';
// import * as EssentialsPlugin from '@tweakpane/plugin-essentials';

async function init(){
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


    let onWindowResize = function() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }

    window.addEventListener( 'resize', onWindowResize );

    // let onDocumentMouseMove = function (event:MouseEvent) {
    //     console.log(event.clientX);
    // }
    // document.addEventListener( 'mousemove', onDocumentMouseMove );

    let scrollPercent = ((document.documentElement.scrollTop || document.body.scrollTop) /
                        ((document.documentElement.scrollHeight || document.body.scrollHeight) -
                        document.documentElement.clientHeight));
    let index = Math.floor((scrollPercent*100)/obj_events.events.length);
    console.log(Math.floor((scrollPercent*100)/obj_events.events.length));

    let onDocumentMouseScroll = function() {
        //calculate the current scroll progress as a percentage
        scrollPercent = ((document.documentElement.scrollTop || document.body.scrollTop) /
                        ((document.documentElement.scrollHeight || document.body.scrollHeight) -
                        document.documentElement.clientHeight));

        const mesh = scene.getObjectByName( 'album' ) as THREE.Mesh;
        mesh.rotation.y = (document.documentElement.scrollTop / 1000) % Math.PI;

        // let newindex = Math.floor((scrollPercent*100)/obj_events.events.length);
        console.log((document.documentElement.scrollTop / 1000) % Math.PI);
        // if(index != newindex){
        //     const lista = obj_events.events
        //
        //     const texture = new THREE.TextureLoader().load(lista[index]['link_imagem']);
        //     const mat = mesh.material as THREE.MeshBasicMaterial;
        //     mat.map = texture;
        //     mat.needsUpdate = true
        //     index = newindex;
        // }



    };
    document.body.onscroll = onDocumentMouseScroll



    let clamp = function(num:number, min:number, max:number):number {
        return num < min
               ? max
               : num > max
               ? min
               : num;
    }

    const lista = obj_events.events

    const mesh = scene.getObjectByName( 'album' ) as THREE.Mesh;
    const texture = new THREE.TextureLoader().load(lista[index]['link_imagem']);
    const mat = mesh.material as THREE.MeshBasicMaterial;
    mat.map = texture;
    mat.needsUpdate = true

    let faz = true;
    console.log(faz)
    let render = function() {
        // fpsGraph.begin()


        // mesh.rotation.y = (scrollPercent/100) * (Math.PI*2);
        // console.log(Math.floor(scrollPercent/(obj_events.events.length-1)))

        if ((((document.documentElement.scrollTop / 1000) % Math.PI) > Math.PI/2) && faz) {
            faz = false;
            // mesh.rotation.y -= Math.PI;
            const texture = new THREE.TextureLoader().load(lista[index]['link_imagem']);
            const mat = mesh.material as THREE.MeshBasicMaterial;
            // const temp = mat.map as THREE.Texture;
            mat.map = texture;
            mat.needsUpdate = true;
            index = clamp(index+1, 0, obj_events.events.length-1);
        }
        if((((document.documentElement.scrollTop / 1000) % Math.PI) < Math.PI/2)){
            faz = true;
        }


        renderer.render(scene, camera);
        // fpsGraph.end()
    };
    renderer.setAnimationLoop( render );
}

init();
