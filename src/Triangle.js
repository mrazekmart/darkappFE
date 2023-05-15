import React, {useRef, useEffect} from 'react';
import * as THREE from 'three';
import glsl from 'glslify';
import vertexShaderSource from './shaders/myVertShader.vert';
import fragmentShaderSource from './shaders/myFragShader.frag';

const Triangle = () => {
    const mountRef = useRef(null);

    useEffect(() => {
        // Use glslify to transform the shader sources into valid GLSL code
        const vertexShader = glsl(vertexShaderSource);
        const fragmentShader = glsl(fragmentShaderSource);

        // Create a new shader material
        const material = new THREE.ShaderMaterial({
            uniforms: {
                angle: { value: 0.0 }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        });

        // Create a new triangle mesh that uses the custom shader material
        const geometry = new THREE.PlaneGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 1, 0, -1, -1, 0, 1, -1, 0], 3));
        geometry.setIndex([0, 1, 2]);
        const mesh = new THREE.Mesh(geometry, material);


        // Create a new camera and renderer
        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
        camera.position.z = -5;

        const scene = new THREE.Scene();
        scene.add(mesh);


        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth/4, window.innerHeight/4);
        renderer.setClearColor(new THREE.Color(0xff0000));
        mountRef.current.appendChild(renderer.domElement);

        // Render the scene
        function animate() {
            requestAnimationFrame( animate );

            material.uniforms.angle.value += 0.01;

            renderer.render( scene, camera );
        }

        animate();

        // Cleanup function
        return () => {
            renderer.dispose();
            geometry.dispose();
            material.dispose();
        };
    }, []);

    return <div ref={mountRef}/>;
};

export default Triangle;