"use client";

import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { BufferGeometry } from "three";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { isComputedPropertyName } from "typescript";

const addLighting = (
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
  scene.add(directionalLight);
};

function Model() {
  useEffect(() => {
    const scene = new THREE.Scene();

    // scene.background = new THREE.Color().setHex(12892855, "srgb");

    const ambientLight = new THREE.AmbientLight(0x404040);
    ambientLight.castShadow = true;
    scene.add(ambientLight);

    const light = new THREE.PointLight(0x404040, 40, 1000);
    light.position.set(5, 15, 0);
    scene.add(light);

    addLighting(scene, 1, 0, 1, 0.2, true);
    addLighting(scene, -1, 0, 0, 0.2, false);
    addLighting(scene, 0, 1, 0, 0.2, false);
    addLighting(scene, 1, -1, 0, 0.2, false);
    addLighting(scene, 0, 0, 1, 0.2, false);
    addLighting(scene, 0, 0, -1, 0.2, false);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    //create canvas and renderer
    const canvas = document.getElementById("threeJSCanvas");
    const renderer = new THREE.WebGLRenderer({
      canvas: canvas!,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(window.innerWidth - 15, window.innerHeight - 10);
    document.body.appendChild(renderer.domElement);

    window.addEventListener("resize", () => onWindowResize(), false);

    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth - 15, window.innerHeight - 10);
    }
    // Create geometry
    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // const cube = new THREE.Mesh(geometry, material);
    // scene.add(cube);

    const loader = new GLTFLoader();
    loader.load(
      // resource URL
      "http://localhost:5500/assets/180sx.glb",
      // called when the resource is loaded
      function (gltf) {
        const loadedModel = gltf.scene;
        // centers group
        new THREE.Box3()
          .setFromObject(loadedModel)
          .getCenter(loadedModel.position)
          .multiplyScalar(-1);
        scene.add(loadedModel);
      },
      // called while loading is progressing
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      },
      // called when loading has errors
      function (error) {
        console.log("An error happened");
      }
    );

    //Add Controls
    const controls = new OrbitControls(camera, renderer.domElement);

    camera.position.y = 0.2;
    camera.position.z = 3.5;

    function animate() {
      scene.rotation.y += -0.001;
      renderer.render(scene, camera);
      window.requestAnimationFrame(animate);
    }
    animate();
  }, []);

  return <canvas id="threeJSCanvas"></canvas>;
}

export default Model;
