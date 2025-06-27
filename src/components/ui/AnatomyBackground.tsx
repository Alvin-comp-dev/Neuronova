'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function AnatomyBackground() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    anatomyGroup: THREE.Group;
    animationId: number;
  } | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    mountRef.current.appendChild(renderer.domElement);

    // Create anatomy group
    const anatomyGroup = new THREE.Group();
    scene.add(anatomyGroup);

    // Create human body parts with different colors for highlighting
    const bodyParts = [
      // Head
      {
        geometry: new THREE.SphereGeometry(0.8, 32, 32),
        position: [0, 3.5, 0],
        color: 0xff6b6b,
        name: 'head'
      },
      // Torso
      {
        geometry: new THREE.CylinderGeometry(1.2, 1.0, 2.5, 32),
        position: [0, 1.5, 0],
        color: 0x4ecdc4,
        name: 'torso'
      },
      // Arms
      {
        geometry: new THREE.CylinderGeometry(0.3, 0.25, 2.0, 16),
        position: [-1.8, 2.0, 0],
        color: 0x45b7d1,
        name: 'leftArm',
        rotation: [0, 0, Math.PI / 6]
      },
      {
        geometry: new THREE.CylinderGeometry(0.3, 0.25, 2.0, 16),
        position: [1.8, 2.0, 0],
        color: 0x45b7d1,
        name: 'rightArm',
        rotation: [0, 0, -Math.PI / 6]
      },
      // Legs
      {
        geometry: new THREE.CylinderGeometry(0.4, 0.35, 2.5, 16),
        position: [-0.6, -1.5, 0],
        color: 0x96ceb4,
        name: 'leftLeg'
      },
      {
        geometry: new THREE.CylinderGeometry(0.4, 0.35, 2.5, 16),
        position: [0.6, -1.5, 0],
        color: 0x96ceb4,
        name: 'rightLeg'
      },
      // Heart (inside torso)
      {
        geometry: new THREE.SphereGeometry(0.3, 16, 16),
        position: [-0.2, 1.8, 0.5],
        color: 0xff4757,
        name: 'heart'
      },
      // Lungs
      {
        geometry: new THREE.SphereGeometry(0.25, 16, 16),
        position: [-0.5, 1.5, 0.3],
        color: 0xffa502,
        name: 'leftLung'
      },
      {
        geometry: new THREE.SphereGeometry(0.25, 16, 16),
        position: [0.5, 1.5, 0.3],
        color: 0xffa502,
        name: 'rightLung'
      },
      // Brain
      {
        geometry: new THREE.SphereGeometry(0.6, 16, 16),
        position: [0, 3.5, 0],
        color: 0xf368e0,
        name: 'brain'
      }
    ];

    // Create materials and meshes for each body part
    const bodyMeshes: THREE.Mesh[] = [];
    bodyParts.forEach((part) => {
      const material = new THREE.MeshPhongMaterial({
        color: part.color,
        transparent: true,
        opacity: 0.7,
        shininess: 100
      });
      
      const mesh = new THREE.Mesh(part.geometry, material);
      mesh.position.set(part.position[0], part.position[1], part.position[2]);
      
      if (part.rotation) {
        mesh.rotation.set(part.rotation[0], part.rotation[1], part.rotation[2]);
      }
      
      mesh.userData = { name: part.name, originalColor: part.color };
      anatomyGroup.add(mesh);
      bodyMeshes.push(mesh);
    });

    // Add wireframe overlay for anatomical detail
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      wireframe: true,
      transparent: true,
      opacity: 0.1
    });

    bodyParts.forEach((part) => {
      const wireframe = new THREE.Mesh(part.geometry, wireframeMaterial);
      wireframe.position.set(part.position[0], part.position[1], part.position[2]);
      if (part.rotation) {
        wireframe.rotation.set(part.rotation[0], part.rotation[1], part.rotation[2]);
      }
      anatomyGroup.add(wireframe);
    });

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x00ffff, 0.5);
    pointLight.position.set(-5, 3, 2);
    scene.add(pointLight);

    // Camera position
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 1, 0);

    // Animation variables
    let time = 0;
    const highlightCycle = 5000; // 5 seconds per highlight cycle

    // Animation loop
    const animate = () => {
      time += 16; // Roughly 60fps
      
      // Rotate the entire anatomy
      anatomyGroup.rotation.y += 0.005;
      anatomyGroup.rotation.x = Math.sin(time * 0.001) * 0.1;

      // Highlight different body parts in sequence
      const cycleProgress = (time % highlightCycle) / highlightCycle;
      const partIndex = Math.floor(cycleProgress * bodyMeshes.length);
      
      bodyMeshes.forEach((mesh, index) => {
        const material = mesh.material as THREE.MeshPhongMaterial;
        if (index === partIndex) {
          // Highlight current part
          material.opacity = 0.9;
          material.emissive.setHex(0x333333);
          mesh.scale.set(1.1, 1.1, 1.1);
        } else {
          // Normal state
          material.opacity = 0.7;
          material.emissive.setHex(0x000000);
          mesh.scale.set(1, 1, 1);
        }
      });

      // Floating animation for organs
      const heartMesh = bodyMeshes.find(m => m.userData.name === 'heart');
      const brainMesh = bodyMeshes.find(m => m.userData.name === 'brain');
      
      if (heartMesh) {
        heartMesh.scale.set(
          1 + Math.sin(time * 0.01) * 0.1,
          1 + Math.sin(time * 0.01) * 0.1,
          1 + Math.sin(time * 0.01) * 0.1
        );
      }
      
      if (brainMesh) {
        brainMesh.position.y = 3.5 + Math.sin(time * 0.005) * 0.1;
      }

      renderer.render(scene, camera);
      sceneRef.current!.animationId = requestAnimationFrame(animate);
    };

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Store scene references
    sceneRef.current = {
      scene,
      camera,
      renderer,
      anatomyGroup,
      animationId: 0
    };

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animationId);
        if (mountRef.current && sceneRef.current.renderer.domElement) {
          mountRef.current.removeChild(sceneRef.current.renderer.domElement);
        }
        sceneRef.current.renderer.dispose();
      }
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 -z-10 opacity-20 dark:opacity-30"
      style={{ 
        background: 'radial-gradient(ellipse at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
        pointerEvents: 'none'
      }}
    />
  );
} 