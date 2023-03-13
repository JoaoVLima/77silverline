import * as THREE from 'three';
// import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';

export default class Core {
    public scene: THREE.Scene;
    public camera: THREE.PerspectiveCamera;
    public lights: THREE.Light[];
    public objects: THREE.Mesh[];
    public renderer: THREE.WebGLRenderer;
    // public controls: OrbitControls;

    constructor() {
        this.scene = this.initScene();
        this.camera = this.initCamera();
        this.lights = this.initLights();
        this.objects = this.initObjects();
        this.renderer = this.initRenderer();
        // this.controls = this.initControls();
    }

    /* 📦 Scene */
    private initScene(): THREE.Scene {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xffffff );
        return scene;
    }

    /* 🎥 Camera */
    private initCamera(): THREE.PerspectiveCamera {
        const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 20);
        camera.position.set(0, -0.5, 8);
        camera.lookAt(new THREE.Vector3(0, -0.5, 0))
        return camera;
    }

    /* 💡 Lights */
    private initLights(): THREE.Light[] {
        let lights: THREE.Light[] = []

        // const ambient = new THREE.HemisphereLight(0xffffff, 0x444444, 0.01);
        // lights.push(ambient)

        // const loader = new THREE.TextureLoader().setPath('./media/');
        // const texture = loader.load('disturb.jpg');
        // texture.minFilter = THREE.LinearFilter;
        // texture.magFilter = THREE.LinearFilter;
        // texture.encoding = THREE.sRGBEncoding;


        // const spotLight = new THREE.SpotLight(0xffffff, 1);
        // spotLight.position.set(25, 50, 25);
        // spotLight.angle = Math.PI / 6;
        // spotLight.penumbra = 1;
        // spotLight.decay = 2;
        // spotLight.distance = 100;
        // spotLight.map = texture;
        // spotLight.castShadow = true;
        // spotLight.shadow.mapSize.width = 1024;
        // spotLight.shadow.mapSize.height = 1024;
        // spotLight.shadow.camera.near = 10;
        // spotLight.shadow.camera.far = 200;
        // spotLight.shadow.focus = 1;
        // lights.push(spotLight)

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

        // create a plane geometry
        const geometry = new THREE.BoxGeometry(2, 2,0.1);

        // create a material with the texture
        const material = new THREE.MeshBasicMaterial();

        // create a mesh with the geometry and material
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0,0,0);
        mesh.name = 'album';
        objects.push(mesh)

        objects.forEach((object: THREE.Mesh) => {
            this.scene.add(object)
        });

        return objects;
    }

    /* 🖨️ Renderer */
    private initRenderer(): THREE.WebGLRenderer {
        const renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById("ThreeCanvas") as HTMLCanvasElement,
            antialias: true,
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(renderer.domElement);
        return renderer;
    }

    /* 🎮 Controls */
    // private initControls(): OrbitControls {
    //     const controls = new OrbitControls(this.camera, this.renderer.domElement);
    //     controls.minDistance = 1;
    //     controls.maxDistance = 100;
    //     controls.maxPolarAngle = Math.PI / 2;
    //     controls.target.set(0, 0, 0);
    //     controls.update();
    //     return controls;
    // }
}
