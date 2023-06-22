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
    distanceFromSun: number;
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

    const [solarSystem, setSolarSystem] = useState<SolarSystem | undefined>();
    const [maxWidth] = useState<number>(5000);
    const [maxHeight] = useState<number>(5000);

    const [planetVShader, setPlanetVShader] = useState("");
    const [planetFShader, setPlanetFShader] = useState("");
    const [cloudVShader, setCloudVShader] = useState("");
    const [cloudFShader, setCloudFShader] = useState("");
    const [cubeVShader, setCubeVShader] = useState("");
    const [cubeFShader, setCubeFShader] = useState("");
    const [moonVShader, setMoonVShader] = useState("");
    const [moonFShader, setMoonFShader] = useState("");
    const [loading, setLoading] = useState(true);

    const speed = useRef(0);
    const direction = useRef(new THREE.Vector3());

    const isDragging = useRef(false);
    const startPosition = useRef({x: 0, y: 0});
    const currentPosition = useRef({x: 0, y: 0});


    useEffect(() => {
        Promise.all([
            fetch('/universeShaders/planetVShader.glsl').then(response => response.text()),
            fetch('/universeShaders/planetFShader.glsl').then(response => response.text()),
            fetch('/universeShaders/cubeVertexShader.glsl').then(response => response.text()),
            fetch('/universeShaders/cubeFragmentShader.glsl').then(response => response.text()),
            fetch('/universeShaders/cloudVShader.glsl').then(response => response.text()),
            fetch('/universeShaders/cloudFShader.glsl').then(response => response.text()),
            fetch('/universeShaders/moonVShader.glsl').then(response => response.text()),
            fetch('/universeShaders/moonFShader.glsl').then(response => response.text())
        ])
            .then(([sunVShaderData, sunFShaderData, cubeVShaderData, cubeFShaderData, cloudVShaderData, cloudFShaderData, moonVShaderData, moonFShaderData]) => {
                setPlanetVShader(sunVShaderData);
                setPlanetFShader(sunFShaderData);
                setCubeVShader(cubeVShaderData);
                setCubeFShader(cubeFShaderData);
                setCloudVShader(cloudVShaderData);
                setCloudFShader(cloudFShaderData);
                setMoonVShader(moonVShaderData);
                setMoonFShader(moonFShaderData);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);

    useEffect(() => {
        setSolarSystem(generateSolarSystem);
        // eslint-disable-next-line
    }, [])

    useEffect(() => {

        const canvas = canvasRef.current;

        if (!canvas) return;

        canvas.setAttribute('tabindex', '0');
        canvas.focus();

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        if (!solarSystem) return;

        if (loading) return;

        renderSolarSystem(solarSystem, canvas);


    }, [solarSystem, planetVShader]);

    function generateSolarSystem() {
        let sunSize = 200;

        const solarSystem = {
            mainStar: {
                name: "Sun",
                size: sunSize,
                color: [1, 1, 0],
            } as Star,
            planets: [] as Planet[],
            stars: [] as Star[],
        };

        const numPlanets = Math.floor(Math.random() * 3) + 8;

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
                distanceFromSun: distance,
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

    function renderSolarSystem(
        solarSystem: { mainStar: Star; planets: Planet[]; stars: Star[] },
        canvas: HTMLCanvasElement
    ) {
        const clock = new THREE.Clock();

        const renderer = new THREE.WebGLRenderer({
            canvas,
            context: canvas.getContext("webgl2") as WebGLRenderingContext,
            antialias: true
        });
        renderer.setSize(canvas.width, canvas.height);
        renderer.setClearColor(0x000000);
        renderer.clear();
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            canvas.width / canvas.height,
            0.1,
            3000
        );
        camera.position.setZ(2000);

        for (let i = 0; i < solarSystem.stars.length; i++) {
            const currStar = solarSystem.stars[i];
            const starColor = new THREE.Color(currStar.color[0], currStar.color[1], currStar.color[2]);
            const starGeometry = new THREE.CircleGeometry(currStar.size, 12);
            const starMaterial = new THREE.MeshBasicMaterial({color: starColor});
            const starMesh = new THREE.Mesh(starGeometry, starMaterial);
            starMesh.position.set(currStar.position[0], currStar.position[1], 0);
            scene.add(starMesh);
        }


        let cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
        cubeRenderTarget.texture.type = THREE.HalfFloatType;


        const sunMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: {value: 0.0}
            },
            vertexShader: cubeVShader,
            fragmentShader: cubeFShader
        });

        const geometry = new THREE.SphereGeometry(200, 30, 30);
        const sun = new THREE.Mesh(geometry, sunMaterial);
        scene.add(sun);

        const numPlanets = solarSystem.planets.length;

        const cloudMaterials: any = [];

        for (let i = 0; i < numPlanets; i++) {
            const planet = solarSystem.planets[i];

            const planetGeometry = new THREE.SphereGeometry(planet.size, 32);
            const planetMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    pOffset: {value: getRandomFloat(0, 100000)}
                },
                vertexShader: planetVShader,
                fragmentShader: planetFShader
            });

            if(planet.distanceFromSun < 600){
                planetMaterial.fragmentShader = moonFShader;
            }

            const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
            planetMesh.position.set(planet.position[0], planet.position[1], 0);
            scene.add(planetMesh);

            const cloudGeometry = new THREE.SphereGeometry(planet.size + 1, 32);
            const cloudMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    pOffset: {value: getRandomFloat(0, 100000)},
                    time: {value: 0.0}
                },
                vertexShader: cloudVShader,
                fragmentShader: cloudFShader,
                transparent: true,
            });
            cloudMaterials.push(cloudMaterial);

            const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
            clouds.position.set(planet.position[0], planet.position[1], 0);
            scene.add(clouds);

            const numMoons = planet.moons.length;

            for (let j = 0; j < numMoons; j++) {
                const moon = planet.moons[j];
                const moonGeometry = new THREE.SphereGeometry(moon.size, 32);
                const moonColor = new THREE.Color(moon.color[0], moon.color[1], moon.color[2]);
                const moonMaterial = new THREE.ShaderMaterial({
                    uniforms: {
                        pOffset: {value: getRandomFloat(0, 100000)},
                        color: {value: moonColor}
                    },
                    vertexShader: moonVShader,
                    fragmentShader: moonFShader
                });
                const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
                moonMesh.position.set(moon.position[0], moon.position[1], 0);
                scene.add(moonMesh);
            }
        }

        let timer: number = 0;

        function animate() {

            requestAnimationFrame(animate);
            const delta: number = clock.getDelta();
            timer += delta;
            if (timer < 0.02) {
                return;
            }
            timer = 0;

            camera.getWorldDirection(direction.current);

            camera.position.addScaledVector(direction.current, speed.current);


            if (isDragging.current) {
                const dx = (currentPosition.current.x - startPosition.current.x) * 0.001;
                const dy = (currentPosition.current.y - startPosition.current.y) * 0.001;

                camera.rotation.y += dx;
                camera.rotation.x += dy;

                startPosition.current = currentPosition.current;
            }


            sunMaterial.uniforms.time.value += 0.004;
            if (cloudMaterials.length > 0) {
                cloudMaterials.forEach((item: any, index: number) => {
                    item.uniforms.time.value += 0.004;
                });
            }
            renderer.render(scene, camera);
            //cubeCamera.update(renderer, scene);
        }

        function getRandomFloat(min: number, max: number) {
            return Math.random() * (max - min) + min;
        }

        animate();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === "KeyW") {
                speed.current = 2;
            } else if (event.code === "KeyS") {
                speed.current = -2;
            } else if (event.code === "KeyA") {
                camera.position.x += 2;
            } else if (event.code === "KeyD") {
                camera.position.x -= 2;
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.code === "KeyW") {
                speed.current = 0;
            } else if (event.code === "KeyS") {
                speed.current = 0;
            }
        };

        const handleMouseDown = (event: MouseEvent) => {
            isDragging.current = true;
            startPosition.current = {x: event.clientX, y: event.clientY};
        };

        const handleMouseUp = (event: MouseEvent) => {
            isDragging.current = false;
        };

        const handleMouseMove = (event: MouseEvent) => {
            if (isDragging.current) {
                currentPosition.current = {x: event.clientX, y: event.clientY};
            }
        };

        canvas.addEventListener('keydown', handleKeyDown);
        canvas.addEventListener('keyup', handleKeyUp);

        canvas.addEventListener('mousedown', handleMouseDown, false);
        canvas.addEventListener('mouseup', handleMouseUp, false);
        canvas.addEventListener('mousemove', handleMouseMove, false);
        return () => {
            canvas.removeEventListener('keydown', handleKeyDown);
            canvas.removeEventListener('keyup', handleKeyUp);
            canvas.removeEventListener('mousedown', handleMouseDown, false);
            canvas.removeEventListener('mouseup', handleMouseUp, false);
            canvas.removeEventListener('mousemove', handleMouseMove, false);
        };
    }

    return (
        <div style={{position: 'relative'}}>
            <canvas ref={canvasRef} style={{position: 'fixed', top: 0, left: 0}}/>
        </div>
    );
}
export default MMUniverse;