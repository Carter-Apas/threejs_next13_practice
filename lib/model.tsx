import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";


export default class sceneInit {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.Renderer;
  ambientLight: undefined;
  directionalLight: undefined;
  pointLight: undefined;
  controls: OrbitControls;
  constructor(canvasId: string, model: string, zoom: number) {
    //Create a scene
    this.scene = new THREE.Scene();

    //Create Camera
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera.position.y = 0.2;
    this.camera.position.z = zoom;

    //Add ambient lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    ambientLight.castShadow = true;
    this.scene.add(ambientLight);

    //Add point lighting
    const light = new THREE.PointLight(0x404040, 40, 1000);
    light.position.set(5, 15, 0);
    this.scene.add(light);

    //Add directional lighting
    this.addLighting(this.scene, 1, 0, 1, 0.2, true);
    this.addLighting(this.scene, -1, 0, 0, 0.2, false);
    this.addLighting(this.scene, 0, 1, 0, 0.2, false);
    this.addLighting(this.scene, 1, -1, 0, 0.2, false);
    this.addLighting(this.scene, 0, 0, 1, 0.2, false);
    this.addLighting(this.scene, 0, 0, -1, 0.2, false);

    //Create a canvas
    const canvas = document.getElementById(canvasId);
    console.log(canvas);

    //Add renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas!,
      alpha: true,
      antialias: true,
    })
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    //Add window resizing
    window.addEventListener("resize", () => this.onWindowResize(), false);

    //Add Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    //Load Model and add to canvas
    const loader = new GLTFLoader();
    loader.load(
      `http://localhost:5500/assets/${model}.glb`,
       (gltf) => {

        console.log(model);
        const loadedModel = gltf.scene;
        new THREE.Box3()
          .setFromObject(loadedModel)
          .getCenter(loadedModel.position)
          .multiplyScalar(-1);
        this.scene.add(loadedModel);
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      function (error) {
        console.log("An error happened");
      }
    );
  }

  addLighting = (
    scene: THREE.Scene,
    x: number,
    y: number,
    z: number,
    lumins: number,
    shadows: boolean
  ) => {
    const directionalLight = new THREE.DirectionalLight(0xffffff, lumins);
    directionalLight.position.set(x, y, z);
    directionalLight.castShadow = shadows;
    this.scene.add(directionalLight);
  };

  animate() {
      this.scene.rotation.y += -0.001;
      window.requestAnimationFrame(this.animate.bind(this));
      this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth - 15, window.innerHeight - 10);
  }
}
