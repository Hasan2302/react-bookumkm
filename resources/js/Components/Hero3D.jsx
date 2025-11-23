import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sphere, Box, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// Floating booking card 3D
function BookingCard({ position, rotation, color }) {
    const meshRef = useRef();
    
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
        }
    });

    return (
        <Float
            speed={2}
            rotationIntensity={0.5}
            floatIntensity={0.5}
            floatingRange={[-0.5, 0.5]}
        >
            <group position={position} rotation={rotation}>
                <RoundedBox
                    ref={meshRef}
                    args={[1.2, 1.6, 0.1]}
                    radius={0.1}
                    smoothness={4}
                >
                    <meshStandardMaterial
                        color={color}
                        transparent
                        opacity={0.3}
                        roughness={0.2}
                        metalness={0.8}
                    />
                </RoundedBox>
            </group>
        </Float>
    );
}

// Calendar icon 3D
function CalendarIcon({ position }) {
    const groupRef = useRef();
    
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
        }
    });

    return (
        <Float
            speed={1.5}
            rotationIntensity={0.3}
            floatIntensity={0.8}
        >
            <group ref={groupRef} position={position}>
                {/* Calendar body */}
                <RoundedBox args={[1, 1.2, 0.15]} radius={0.08}>
                    <meshStandardMaterial
                        color="#3b82f6"
                        transparent
                        opacity={0.4}
                        roughness={0.3}
                        metalness={0.7}
                    />
                </RoundedBox>
                
                {/* Calendar header */}
                <Box args={[1, 0.25, 0.16]} position={[0, 0.48, 0]}>
                    <meshStandardMaterial
                        color="#1e40af"
                        transparent
                        opacity={0.6}
                    />
                </Box>
            </group>
        </Float>
    );
}

// Clock icon 3D
function ClockIcon({ position }) {
    const hourRef = useRef();
    const minuteRef = useRef();
    
    useFrame((state) => {
        if (hourRef.current) {
            hourRef.current.rotation.z = -state.clock.elapsedTime * 0.5;
        }
        if (minuteRef.current) {
            minuteRef.current.rotation.z = -state.clock.elapsedTime * 1;
        }
    });

    return (
        <Float
            speed={1.8}
            rotationIntensity={0.4}
            floatIntensity={0.6}
        >
            <group position={position}>
                {/* Clock face */}
                <Sphere args={[0.6, 32, 32]}>
                    <meshStandardMaterial
                        color="#60a5fa"
                        transparent
                        opacity={0.35}
                        roughness={0.2}
                        metalness={0.8}
                    />
                </Sphere>
                
                {/* Hour hand */}
                <Box
                    ref={hourRef}
                    args={[0.05, 0.3, 0.05]}
                    position={[0, 0.15, 0.61]}
                >
                    <meshStandardMaterial color="#1e3a8a" />
                </Box>
                
                {/* Minute hand */}
                <Box
                    ref={minuteRef}
                    args={[0.04, 0.4, 0.04]}
                    position={[0, 0.2, 0.62]}
                >
                    <meshStandardMaterial color="#2563eb" />
                </Box>
            </group>
        </Float>
    );
}

// Particles
function Particles() {
    const particlesRef = useRef();
    
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < 100; i++) {
            const x = (Math.random() - 0.5) * 20;
            const y = (Math.random() - 0.5) * 20;
            const z = (Math.random() - 0.5) * 20;
            temp.push(x, y, z);
        }
        return new Float32Array(temp);
    }, []);

    useFrame((state) => {
        if (particlesRef.current) {
            particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
        }
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particles.length / 3}
                    array={particles}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.05}
                color="#93c5fd"
                transparent
                opacity={0.6}
                sizeAttenuation
            />
        </points>
    );
}

// Main 3D Scene
export default function Hero3D() {
    return (
        <div className="absolute inset-0 pointer-events-none">
            <Canvas
                camera={{ position: [0, 0, 8], fov: 50 }}
                style={{ background: 'transparent' }}
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#60a5fa" />
                
                {/* Booking Cards */}
                <BookingCard 
                    position={[-3, 2, 0]} 
                    rotation={[0.2, 0.5, 0]} 
                    color="#3b82f6"
                />
                <BookingCard 
                    position={[3, -1, -2]} 
                    rotation={[-0.2, -0.5, 0]} 
                    color="#60a5fa"
                />
                
                {/* Icons */}
                <CalendarIcon position={[-4, -2, -1]} />
                <ClockIcon position={[4, 1, -1]} />
                
                {/* Particles */}
                <Particles />
            </Canvas>
        </div>
    );
}
