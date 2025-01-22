import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text3D } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";

const ExplodingText = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 100], fov: 75 }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <ExplodingTextParticles text="UNIVERSE is expanding." />
    </Canvas>
  );
};

const ExplodingTextParticles = ({ text }) => {
  const particleRef = useRef();
  const textGeometryRef = useRef();

  // useEffect(() => {
  //   if (!particleRef.current || !textGeometryRef.current) return;

  //   // Extract particle positions from the text geometry
  //   const textGeometry = textGeometryRef.current.geometry;
  //   const positions = extractParticlePositions(textGeometry);

  //   const particlesGeometry = particleRef.current.geometry;
  //   particlesGeometry.setAttribute(
  //     "position",
  //     new THREE.Float32BufferAttribute(positions, 3)
  //   );

  //   // Animate particles outward
  //   animateParticles(particlesGeometry);
  // }, []);

  // // Animate particles using GSAP
  // const animateParticles = (geometry) => {
  //   const positions = geometry.attributes.position;
  //   const numParticles = positions.count;

  //   // Store original positions for reset
  //   const originalPositions = new Float32Array(positions.array);
  //   const targetPositions = new Float32Array(positions.array);

  //   // Generate random target positions for explosion
  //   for (let i = 0; i < numParticles; i++) {
  //     targetPositions[i * 3] += (Math.random() - 0.5) * 50; // x
  //     targetPositions[i * 3 + 1] += (Math.random() - 0.5) * 50; // y
  //     targetPositions[i * 3 + 2] += (Math.random() - 0.5) * 50; // z
  //   }

  //   // Use GSAP to animate from original positions to target positions
  //   gsap.to(originalPositions, {
  //     duration: 2,
  //     endArray: targetPositions,
  //     onUpdate: () => {
  //       positions.needsUpdate = true; // Update positions in the render loop
  //     },
  //   });
  // };

  // // Extract particle positions from a geometry
  // const extractParticlePositions = (geometry) => {
  //   const vertices = geometry.attributes.position.array;
  //   const positions = [];
  //   for (let i = 0; i < vertices.length; i += 3) {
  //     positions.push(vertices[i], vertices[i + 1], vertices[i + 2]);
  //   }
  //   return positions;
  // };

  return (
    <>
      {/* Hidden 3D text to extract geometry */}
      <Text3D
        ref={textGeometryRef}
        font="/fonts/MonaSans-SemiBold.json"
        // font="/fonts/helvetiker_regular.typeface.json"
        size={15}
        height={1}
        curveSegments={12}
      >
        {text}
        <meshBasicMaterial attach="material" visible={true} />
      </Text3D>

      {/* Particles */}
      {/* <points ref={particleRef}>
        <bufferGeometry />
        <pointsMaterial size={0.5} color={0xffcc00} />
      </points> */}
    </>
  );
};

export default ExplodingText;
