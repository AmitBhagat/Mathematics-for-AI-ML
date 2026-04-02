import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Text } from '@react-three/drei';
import * as THREE from 'three';
import { Play, Pause, RotateCcw, Sliders } from 'lucide-react';

const Surface = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Define a loss function: f(x, y) = sin(x) * cos(y) + 0.1 * (x^2 + y^2)
  const { positions, indices } = useMemo(() => {
    const size = 40;
    const segments = 64;
    const halfSize = size / 2;
    const step = size / segments;
    
    const positions = [];
    const indices = [];

    for (let i = 0; i <= segments; i++) {
      for (let j = 0; j <= segments; j++) {
        const x = -halfSize + i * step;
        const z = -halfSize + j * step;
        // Loss function
        const y = Math.sin(x * 0.3) * Math.cos(z * 0.3) * 2 + (x * x + z * z) * 0.05;
        positions.push(x, y, z);
      }
    }

    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < segments; j++) {
        const a = i * (segments + 1) + j;
        const b = (i + 1) * (segments + 1) + j;
        const c = (i + 1) * (segments + 1) + (j + 1);
        const d = i * (segments + 1) + (j + 1);
        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    return {
      positions: new Float32Array(positions),
      indices: new Uint32Array(indices),
    };
  }, []);

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="index"
          count={indices.length}
          array={indices}
          itemSize={1}
        />
      </bufferGeometry>
      <meshStandardMaterial 
        color="#3b82f6" 
        wireframe={false} 
        transparent 
        opacity={0.6} 
        side={THREE.DoubleSide}
        flatShading
      />
    </mesh>
  );
};

const Ball = ({ position }: { position: [number, number, number] }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="#f43f5e" emissive="#f43f5e" emissiveIntensity={2} />
      <pointLight intensity={5} distance={10} color="#f43f5e" />
    </mesh>
  );
};

const Path = ({ points }: { points: THREE.Vector3[] }) => {
  const lineGeometry = useMemo(() => {
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [points]);

  return (
    <primitive object={new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color: "#f43f5e" }))} />
  );
};

export const GradientDescent3D: React.FC = () => {
  const [ballPos, setBallPos] = useState<[number, number, number]>([8, 10, 8]);
  const [path, setPath] = useState<THREE.Vector3[]>([new THREE.Vector3(8, 10, 8)]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [learningRate, setLearningRate] = useState(0.1);

  const f = (x: number, z: number) => {
    return Math.sin(x * 0.3) * Math.cos(z * 0.3) * 2 + (x * x + z * z) * 0.05;
  };

  const df = (x: number, z: number) => {
    // Partial derivatives
    const dx = 0.3 * Math.cos(x * 0.3) * Math.cos(z * 0.3) * 2 + 0.1 * x;
    const dz = -0.3 * Math.sin(x * 0.3) * Math.sin(z * 0.3) * 2 + 0.1 * z;
    return { dx, dz };
  };

  const step = () => {
    const [x, , z] = ballPos;
    const { dx, dz } = df(x, z);
    const nextX = x - learningRate * dx;
    const nextZ = z - learningRate * dz;
    const nextY = f(nextX, nextZ);
    
    const nextPos: [number, number, number] = [nextX, nextY, nextZ];
    setBallPos(nextPos);
    setPath(prev => [...prev, new THREE.Vector3(...nextPos)]);
  };

  useFrame((state, delta) => {
    if (isAnimating) {
      // Slow down the steps for visualization
      if (state.clock.getElapsedTime() % 0.1 < 0.02) {
        step();
      }
    }
  });

  const reset = () => {
    const startPos: [number, number, number] = [8, f(8, 8), 8];
    setBallPos(startPos);
    setPath([new THREE.Vector3(...startPos)]);
    setIsAnimating(false);
  };

  return (
    <div className="glass-panel p-6 w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-display font-bold text-white">Gradient Descent in 3D</h3>
          <p className="text-slate-400 text-sm">Visualizing a ball rolling down a loss surface.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsAnimating(!isAnimating)}
            className={`p-2 rounded-lg transition-colors ${isAnimating ? 'bg-rose-500/20 text-rose-500' : 'bg-brand-primary/20 text-brand-primary'}`}
          >
            {isAnimating ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button 
            onClick={reset}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <label className="text-xs text-slate-500 uppercase font-bold flex items-center gap-2 mb-2">
              <Sliders size={12} /> Learning Rate
            </label>
            <input 
              type="range" min="0.01" max="0.5" step="0.01" 
              value={learningRate} onChange={(e) => setLearningRate(parseFloat(e.target.value))}
              className="w-full accent-brand-primary"
            />
            <div className="text-right text-xs font-mono mt-1">{learningRate.toFixed(2)}</div>
          </div>

          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <h4 className="text-sm font-bold mb-2 text-slate-300">Current State</h4>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">X:</span>
                <span>{ballPos[0].toFixed(3)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Z:</span>
                <span>{ballPos[2].toFixed(3)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 text-brand-accent font-bold">Loss (Y):</span>
                <span className="text-brand-accent">{ballPos[1].toFixed(3)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 h-[400px] bg-slate-900/50 rounded-2xl border border-white/5 overflow-hidden">
          <Canvas shadows>
            <PerspectiveCamera makeDefault position={[15, 15, 15]} />
            <OrbitControls enableDamping />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <spotLight position={[-10, 20, 10]} angle={0.15} penumbra={1} intensity={2} castShadow />
            
            <Surface />
            <Ball position={ballPos} />
            <Path points={path} />
            
            <Grid 
              infiniteGrid 
              fadeDistance={50} 
              fadeStrength={5} 
              cellSize={1} 
              sectionSize={5} 
              sectionColor="#3b82f6" 
              cellColor="#1e293b" 
            />
          </Canvas>
        </div>
      </div>
    </div>
  );
};
