import * as THREE from 'three';
import { Suspense, useState, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stats, OrbitControls, Environment, useGLTF, Clone, Html, ContactShadows } from '@react-three/drei';
import { useControls } from 'leva';

const Models = [
  { title: '1', url: './1.glb', miEscala: 1.1, miPosicion: 4 },
  { title: '2', url: './2.glb', miEscala: 1.1, miPosicion: 4 },
  { title: '3', url: './3.glb', miEscala: 1.1, miPosicion: 4 },
  { title: '4', url: './4.glb', miEscala: 1.1, miPosicion: 4 },
  { title: '5', url: './5.glb', miEscala: 1.1, miPosicion: 4 },
  { title: '6', url: './6.glb', miEscala: 1.1, miPosicion: 4 },
  { title: '7', url: './7.glb', miEscala: 1.1, miPosicion: 4 },
  { title: '8', url: './8.glb', miEscala: 1.1, miPosicion: 4 },
  { title: '9', url: './9.glb', miEscala: 1.1, miPosicion: 4 },
];

function Model({ url, miEscala, miPosicion }) {
  const { scene } = useGLTF(url);
  const group = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, (-2 + Math.sin(t)) / 90, 0.6);
  });

  useEffect(() => {
    scene.traverse((node) => {
      if (node.isMesh) {
        node.material.transparent = true;
        node.material.roughness = 1;
      }
    });
  }, [scene]);

  return (
    <group ref={group} position={[0, 0, .0]} scale={miEscala}>
      <Clone object={scene} castShadow receiveShadow />
    </group>
  );
}

function Fallback() {
  return <Html><div>Loading...</div></Html>;
}

export default function EstucheConAsas({ title }) {
  const [currentTitle, setCurrentTitle] = useState(title);

  const { modelo } = useControls('Model', {
    modelo: {
      value: title,
      options: Models.map(({ title }) => title),
    },
  });

  useEffect(() => {
    setCurrentTitle(modelo);
  }, [modelo]);

  const modelIndex = Models.findIndex((m) => m.title === currentTitle);
  const modelUrl = modelIndex !== -1 ? Models[modelIndex].url : null;
  const modelEscala = modelIndex !== -1 ? Models[modelIndex].miEscala : escala;
  const modelPosicion = modelIndex !== -1 ? Models[modelIndex].miPosicion : posicion;

  return (
    <Canvas camera={{ position: [0, 0.4, -0.6], near: 0.01, fov: 50 }}>
      <ambientLight intensity={2} /> {/* Aumentar la luz global */}
      <pointLight position={[100, 100, 0]} intensity={33333} decay={2} />
      <pointLight position={[-100, 100, 0]} intensity={33333} decay={2} />
      <pointLight position={[-100, 100, 100]} intensity={33333} decay={2} />
      <pointLight position={[100, -100, -100]} intensity={99999} decay={2} />
      <pointLight position={[100, -100, 100]} intensity={99999} decay={2} />
      <Suspense fallback={<Fallback />}>
        {modelUrl && <Model url={modelUrl} miEscala={modelEscala} miPosicion={modelPosicion} />}
      </Suspense>
      <OrbitControls autoRotate autoRotateSpeed={0.6} />
      <ContactShadows resolution={512} scale={30} position={[0, -0.2, 0]} blur={0.1} opacity={0.5} far={10} color='#8a6246' />
    </Canvas>
  );
}
