import Core from './core'
import * as THREE from "three";
import {PLYLoader} from "three/examples/jsm/loaders/PLYLoader";

function init(){
    const core = new Core();
    const camera = core.camera
    const scene = core.scene
    const renderer = core.renderer

    // const geometry = new THREE.PlaneGeometry( 1000, 1000 );
    // const material = new THREE.MeshLambertMaterial( { color: 0x808080 } );
    // const mesh = new THREE.Mesh( geometry, material );
    // mesh.position.set( 0, - 1, 0 );
    // mesh.rotation.x = - Math.PI / 2;
    // mesh.receiveShadow = true;
    // scene.add( mesh );

    const geoFloor = new THREE.BoxGeometry( 2000, 0.1, 2000 );
    const matStdFloor = new THREE.MeshStandardMaterial( { color: 0x808080, roughness: 0.1, metalness: 0 } );
    const mshStdFloor = new THREE.Mesh( geoFloor, matStdFloor );
    scene.add( mshStdFloor );

    const geoKnot = new THREE.TorusKnotGeometry( 1.5, 0.5, 200, 16 );
    const matKnot = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 0, metalness: 0 } );
    const meshKnot = new THREE.Mesh( geoKnot, matKnot );
    meshKnot.name = 'Knot';
    meshKnot.scale.set(0.5,0.5,0.5)
    meshKnot.position.set( 0, 5, 0 );
    scene.add( meshKnot );

    // const objLoader = new OBJLoader()
    // objLoader.load(
    //     './obj/cerberus/Cerberus.obj',
    //     (object) => {
    //         (object.children[0] as THREE.Mesh).material = matKnot
    //         object.traverse(function (child) {
    //             if ((child as THREE.Mesh).isMesh) {
    //                 (child as THREE.Mesh).material = matKnot
    //             }
    //         })
    //         // object.scale.set(50,50,50)
    //         scene.add(object)
    //     },
    //     (xhr) => {
    //         console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    //     },
    //     (error) => {
    //         console.log(error)
    //     }
    // )

    new PLYLoader().load( './media/Lucy100k.ply', function ( geometry ) {

        geometry.scale( 0.006, 0.006, 0.006 );
        geometry.computeVertexNormals();

        const mesh = new THREE.Mesh( geometry, matKnot );
        mesh.position.y = 4.8;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.name = 'Lucy';

        scene.add( mesh );

    } );



    let onWindowResize = function () {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    }

    window.addEventListener( 'resize', onWindowResize );

    let render = function () {
        const time = performance.now() / 300;
        // spotLight.position.x = Math.cos( time ) * 25;
        // spotLight.position.z = Math.sin( time ) * 25;
        // spotLight.angle = Math.sin( time );

        // lightHelper.update();

        const knot = scene.getObjectByName( 'Knot' ) as THREE.Mesh;
        knot.rotation.y = time/4;
        knot.position.x = Math.cos( time/8 ) * 4;
        knot.position.z = Math.sin( time/8 ) * 4;

        renderer.render(scene, camera);

    };
    renderer.setAnimationLoop( render );
}

init();
