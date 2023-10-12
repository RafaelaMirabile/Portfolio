import React, { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import CanvasLoader from '../Loader';

const Terrain = () => {
  const canvasRef = useRef();

  useEffect(() => {
    // Canvas
    const canvas = canvasRef.current;

    // Scene
    const scene = new THREE.Scene();

    // Objects
    const geometry = new THREE.PlaneGeometry(3, 3, 64, 64);

    // Texture Loader
    const loader = new THREE.TextureLoader();
    const texture = loader.load('./alphaMap_terrain/textureImg.jpg');
    const heigth = loader.load('./alphaMap_terrain/heigthImg.jpg');
    const alpha = loader.load('./alphaMap_terrain/alphaImg.jpg')

    // Materials
    const material = new THREE.MeshStandardMaterial({
      color: '#915EFF',
      map: texture,
      displacementMap: heigth,
      displacementScale: .6,
      alphaMap: alpha,
      transparent: true,
      depthTest: false,
    });

    // Mesh
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);
    plane.rotation.x = 11.3;
    plane.position.set(0, -1, 0)

    // Lights
    const pointLight = new THREE.PointLight('#915EFF', 7);
    pointLight.position.x = 0;
    pointLight.position.y = 1;
    pointLight.position.z = 1;
    scene.add(pointLight);

    // Sizes
    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    //automatically handle resizing.
    window.addEventListener('resize', () => {
      // Update sizes
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      // Update camera
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      // Update renderer
      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });

    // Camera
    const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 50);
    camera.position.set(0, 0, 4)
    scene.add(camera);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Animate
    document.addEventListener('mousemove', animateTerrain)
    let mouseY = 0;
    function animateTerrain(event) {
      mouseY = event.clientY
    }

    const clock = new THREE.Clock();

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();

      // Update objects
      plane.rotation.z = 0.6 * elapsedTime;
      plane.material.displacementScale = .6 + mouseY * 0.008;

      // Render
      renderer.render(scene, camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(tick);
    };

    tick();
  }, []);

  return (
    <Suspense fallback={<CanvasLoader />}>
      <canvas ref={canvasRef} className="webgl" />
    </Suspense>

  );
};

export default Terrain;
