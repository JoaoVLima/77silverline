import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import {PLYLoader} from "three/examples/jsm/loaders/PLYLoader";

export default class Core {
    public scene: THREE.Scene;
    public camera: THREE.PerspectiveCamera;
    public lights: THREE.Light[];
    public objects: THREE.Mesh[];
    public renderer: THREE.WebGLRenderer;
    public controls: OrbitControls;

    constructor() {
        this.scene = this.initScene();
        this.camera = this.initCamera();
        this.lights = this.initLights();
        this.objects = this.initObjects();
        this.renderer = this.initRenderer();
        this.controls = this.initControls();
    }

    /* 📦 Scene */
    private initScene(): THREE.Scene {
        return new THREE.Scene();
    }

    /* 🎥 Camera */
    private initCamera(): THREE.PerspectiveCamera {
        const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
        camera.position.set( 0, 5, - 15 );
        return camera;
    }

    /* 💡 Lights */
    private initLights(): THREE.Light[] {
        let lights: THREE.Light[] = []

        RectAreaLightUniformsLib.init();

        const rectLight1 = new THREE.RectAreaLight( 0xff0000, 5, 4, 10 );
        rectLight1.position.set( - 5, 5, 5 );
        lights.push(rectLight1)

        const rectLight2 = new THREE.RectAreaLight( 0x00ff00, 5, 4, 10 );
        rectLight2.position.set( 0, 5, 5 );
        lights.push(rectLight2)

        const rectLight3 = new THREE.RectAreaLight( 0x0000ff, 5, 4, 10 );
        rectLight3.position.set( 5, 5, 5 );
        lights.push(rectLight3)

        this.scene.add( new RectAreaLightHelper( rectLight1 ) );
        this.scene.add( new RectAreaLightHelper( rectLight2 ) );
        this.scene.add( new RectAreaLightHelper( rectLight3 ) );

        // const ambient = new THREE.HemisphereLight( 0xffffff, 0x444444, 0.01 );
        // lights.push(ambient)

        const loader = new THREE.TextureLoader().setPath( './media/' );
        const texture = loader.load('disturb.jpg');
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.encoding = THREE.sRGBEncoding;


        const spotLight = new THREE.SpotLight( 0xffffff, 1 );
        spotLight.position.set( 25, 50, 25 );
        spotLight.angle = Math.PI / 6;
        spotLight.penumbra = 1;
        spotLight.decay = 2;
        spotLight.distance = 100;
        spotLight.map = texture;

        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;
        spotLight.shadow.camera.near = 10;
        spotLight.shadow.camera.far = 200;
        spotLight.shadow.focus = 1;
        lights.push(spotLight)

        // const spotLightHelper = new THREE.SpotLightHelper(spotLight);
        // this.scene.add(spotLightHelper)

        lights.forEach((light: THREE.Light) => {
            this.scene.add(light)
        });

        return lights;
    }

    /* 🗿 Objects */
    private initObjects(): THREE.Mesh[] {
        let objects: THREE.Mesh[] = []

        const geoFloor = new THREE.BoxGeometry( 2000, 0.1, 2000 );
        const matStdFloor = new THREE.MeshStandardMaterial( { color: 0x808080, roughness: 0.1, metalness: 0 } );
        const mshStdFloor = new THREE.Mesh( geoFloor, matStdFloor );
        objects.push(mshStdFloor);

        const geoKnot = new THREE.TorusKnotGeometry( 1.5, 0.5, 200, 16 );
        const matKnot = new THREE.MeshStandardMaterial( { color: 0xffffff, roughness: 0, metalness: 0 } );
        const meshKnot = new THREE.Mesh( geoKnot, matKnot );
        meshKnot.name = 'Knot';
        meshKnot.scale.set(0.5,0.5,0.5)
        meshKnot.position.set( 0, 5, 0 );
        objects.push(meshKnot);

        new PLYLoader().load( './media/Lucy100k.ply', (geometry) => {

            geometry.scale( 0.006, 0.006, 0.006 );
            geometry.computeVertexNormals();

            const mesh = new THREE.Mesh( geometry, matKnot );
            mesh.position.y = 4.8;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.name = 'Lucy';

            this.scene.add(mesh);

        } );

        objects.forEach((object: THREE.Mesh) => {
            this.scene.add(object)
        });

        return objects;
    }

    /* 🖨️ Renderer */
    private initRenderer(): THREE.WebGLRenderer {
        const renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById("ThreeCanvas") as HTMLCanvasElement
        });
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;

        document.body.appendChild( renderer.domElement );
        return renderer;
    }

    /* 🎮 Controls */
    private initControls(): OrbitControls {
        const controls = new OrbitControls(this.camera, this.renderer.domElement );
        controls.minDistance = 1;
        controls.maxDistance = 100;
        controls.maxPolarAngle = Math.PI / 2;
        controls.target.set(0, 5, 0);
        controls.update();
        return controls;
    }
}
