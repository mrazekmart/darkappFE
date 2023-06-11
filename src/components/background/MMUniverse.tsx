import React, {useEffect, useRef, useState} from "react";
import * as THREE from 'three';

interface SolarSystem {
    mainStar: Star;
    planets: Planet[];
    stars: Star[];
}

interface Planet {
    name: string;
    size: number;
    color: number[];
    position: number[];
    moons: Moon[];
    hasRings: boolean;
}

interface Star {
    name: string;
    size: number;
    color: number[];
    position: number[];
}

interface Moon {
    name: string;
    size: number;
    position: number[];
    color: number[];
}

const MMUniverse = () => {
    const canvasRef: React.RefObject<HTMLCanvasElement> = useRef(null);

    const [zoom, setZoom] = useState<number>(1);
    const [solarSystem, setSolarSystem] = useState<SolarSystem | undefined>();
    const [maxWidth] = useState<number>(5000);
    const [maxHeight] = useState<number>(5000);

    useEffect(() => {
        setSolarSystem(generateSolarSystem);
        // eslint-disable-next-line
    }, [])

    useEffect(() => {

        const canvas = canvasRef.current;

        if (!canvas) {
            return;
        }

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        if (!solarSystem) {
            return;
        }

        renderSolarSystem(solarSystem, canvas, zoom);


    }, [solarSystem, zoom]);

    function generateSolarSystem() {
        let sunSize = 100;

        const solarSystem = {
            mainStar: {
                name: "Sun",
                size: sunSize,
                color: [1, 1, 0],
            } as Star,
            planets: [] as Planet[],
            stars: [] as Star[],
        };

        const numPlanets = Math.floor(Math.random() * 6) + 4;

        for (let i = 0; i < numPlanets; i++) {
            let planetSize = getRandomSize(15, 65);
            let angle = Math.random() * 360;
            let distance = getRandomDistance(sunSize + sunSize / 2 + planetSize, 1500);
            let planetPosition = [distance * Math.cos(angle), distance * Math.sin(angle)];
            const planet = {
                name: `Planet ${i + 1}`,
                size: planetSize,
                color: getRandomColor(),
                position: planetPosition,
                moons: [] as Moon[],
                hasRings: Math.random() < 0.5,
            };

            const numMoons = Math.floor(Math.random() * 4);

            for (let j = 0; j < numMoons; j++) {
                let angle = Math.random() * 360;
                let distance = getRandomDistance(planet.size + planet.size / 2, 100);
                const moon = {
                    name: `Moon ${j + 1}`,
                    size: getRandomSize(6, planet.size / 2),
                    position: [planetPosition[0] + distance * Math.cos(angle), planetPosition[1] + distance * Math.sin(angle)],
                    color: getRandomColor(),
                };

                planet.moons.push(moon);
            }

            solarSystem.planets.push(planet);


            const numStars = 100;
            const starSize = 1;

            for (let i = 0; i < numStars; i++) {

                const x = Math.random() * maxWidth - maxWidth / 2;
                const y = Math.random() * maxHeight - maxHeight / 2;

                const gray = Math.random();
                const star = {
                    name: `Star ${i + 1}`,
                    size: starSize,
                    color: [gray, gray, gray] as number[],
                    position: [x, y] as number[],
                };
                solarSystem.stars.push(star);
            }
        }

        function getRandomSize(minSize: number, maxSize: number) {
            return Math.max(minSize, Math.random() * maxSize);
        }

        function getRandomColor() {
            return [Math.random(), Math.random(), Math.random()];
        }

        function getRandomDistance(minDistance: number, maxDistance: number) {
            return Math.max(minDistance, Math.random() * maxDistance);
        }

        return solarSystem;
    }
    const generateNoiseTexture = () => {
        const size = 512;
        const data = new Uint8Array(size * size * 3);

        for (let i = 0; i < size * size; i++) {
            const stride = i * 3;
            const value = Math.random() * 255;

            data[stride] = value;
            data[stride + 1] = value;
            data[stride + 2] = value;
        }

        const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.needsUpdate = true;

        return texture;
    };
    const noiseTexture = generateNoiseTexture();

    function renderSolarSystem(
        solarSystem: { mainStar: Star; planets: Planet[]; stars: Star[] },
        canvas: HTMLCanvasElement,
        zoomLevel: number
    ) {

        const renderer = new THREE.WebGLRenderer({canvas, context: canvas.getContext("webgl2") as WebGLRenderingContext});
        renderer.setSize(canvas.width, canvas.height);
        renderer.setClearColor(0x000000);
        renderer.clear();
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            200,
            canvas.width / canvas.height,
            0.1,
            1000
        );
        camera.position.z = 300 * zoomLevel;

        /*        if(!isStarBackgroundSet){
                    generateStarryBackground(scene, canvas.width, canvas.height);
                    //setIsStarBackgroundSet(true);
                }*/

        for (let i = 0; i < solarSystem.stars.length; i++) {
            const currStar = solarSystem.stars[i];
            const starColor = new THREE.Color(currStar.color[0], currStar.color[1], currStar.color[2]);
            const starGeometry = new THREE.CircleGeometry(currStar.size, 12);
            const starMaterial = new THREE.MeshBasicMaterial({color: starColor});
            const starMesh = new THREE.Mesh(starGeometry, starMaterial);
            starMesh.position.set(currStar.position[0], currStar.position[1], 0);
            scene.add(starMesh);
        }

        const sunGeometry = new THREE.CircleGeometry(200, 32);
        const sunMaterial = new THREE.ShaderMaterial({
            vertexShader: `
    varying vec2 vUv;

    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`,
            fragmentShader: `
        precision highp float;
        
        uniform float time;
        uniform vec2 resolution;
        varying vec2 vUv;

        void main() {
            // Calculate the coordinates of the pixel in the texture
            vec2 uv = vUv;
            uv -= 0.5;
            uv *= 10.0;
            
            // Add time to create dynamic patterns
            float t = time * 0.1;
            
            // Calculate color based on the pixel position and time
            vec3 color = vec3(
                abs(sin(uv.x + t)),
                abs(cos(uv.y + t)),
                abs(sin((uv.x + uv.y) + t))
            );

            gl_FragColor = vec4(color, 1.0);
        }
    `,
        });

        const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
        sunMesh.position.set(0, 0, 10);
        scene.add(sunMesh);

        const numPlanets = solarSystem.planets.length;

        for (let i = 0; i < numPlanets; i++) {
            const planet = solarSystem.planets[i];

            const planetColor = new THREE.Color(planet.color[0], planet.color[1], planet.color[2]);
            //const planetColor = new THREE.Color(1, 1, 1);
            const planetGeometry = new THREE.CircleGeometry(planet.size, 32);
            const planetMaterial = new THREE.ShaderMaterial({
                vertexShader: `
                    void main() {
                      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                  `,
                fragmentShader: `
                    uniform vec3 sunColor;
                    uniform float sunIntensity;
                    uniform vec2 sunPosition;
            
                    void main() {
                      float distance = length(gl_FragCoord.xy - sunPosition);
                      float brightness = 1.0;
                      vec3 finalColor = sunColor * sunIntensity * brightness;
                      gl_FragColor = vec4(finalColor, 1.0);
                    }
                  `,
                uniforms: {
                    sunColor: {value: planetColor},
                    sunIntensity: {value: 1.0},
                    sunPosition: {value: new THREE.Vector2(0, 0)},
                },
            });
            const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
            planetMesh.position.set(planet.position[0], planet.position[1], 0);
            scene.add(planetMesh);


            const numMoons = planet.moons.length;

            for (let j = 0; j < numMoons; j++) {
                const moon = planet.moons[j];
                const moonGeometry = new THREE.CircleGeometry(moon.size, 32);
                const moonColor = new THREE.Color(moon.color[0], moon.color[1], moon.color[2]);
                const moonMaterial = new THREE.MeshBasicMaterial({color: moonColor});
                const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
                moonMesh.position.set(moon.position[0], moon.position[1], 0);
                scene.add(moonMesh);
            }
        }
        renderer.render(scene, camera);
    }

    const handleZoom: React.WheelEventHandler<HTMLDivElement> = (event => {
        const delta = event.deltaY;
        const zoomFactor = 0.003;

        setZoom((prevZoom) => {
            const newZoom = prevZoom + delta * zoomFactor;
            return Math.max(0.1, newZoom);
        });
    });

    return (
        <div style={{position: 'relative'}}
             onWheel={handleZoom}
        >
            <canvas ref={canvasRef} style={{position: 'fixed', top: 0, left: 0}}/>
        </div>
    );
}

export default MMUniverse;