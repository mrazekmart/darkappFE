import React, {useEffect, useRef, useState} from "react";
import * as THREE from 'three';

let planetNames: string[] = [
    "Zephyron", "Qualthor", "Braxon", "Phaedra", "Nylex",
    "Vorsoth", "Thule", "Ethros", "Maelis", "Vendara",
    "Orionex", "Telkara", "Santheon", "Zarthan", "Gorthos",
    "Pelendros", "Orixis", "Vistran", "Morpheon", "Xandros",
    "Zelther", "Prytheon", "Helionix", "Quantrix", "Zephyros",
    "Thaltheon", "Procyon", "Quinthalas", "Telarion", "Xenith",
    "Aelon", "Ophion", "Zoran", "Elara", "Rethan",
    "Velanthor", "Nartheon", "Thalara", "Iridion", "Vaelix",
    "Lanthos", "Quendara", "Pyrtheon", "Olistar", "Zethra",
    "Sortheon", "Valthor", "Indaris", "Xelara", "Ophix",
    "Oryth", "Nelara", "Utharion", "Delara", "Sindara",
    "Xantheos", "Zelion", "Maelstrom", "Iridara", "Thalix",
    "Zephyrion", "Uthor", "Zantheon", "Xenara", "Aethos",
    "Orythos", "Deltheon", "Zalara", "Theonix", "Velara",
    "Phaedros", "Tyrian", "Oliara", "Telion", "Thaltheon",
    "Xeltheon", "Andara", "Orion", "Ophion", "Maelara",
    "Zephyran", "Vendrix", "Atheon", "Xandara", "Quinara",
    "Uthion", "Vistran", "Phaedrix", "Pelion", "Zaltheon",
    "Narix", "Orionix", "Santheon", "Zelara", "Veltheon",
    "Orion", "Etheon", "Xelara", "Iridara", "Rethan",
    "Zephyrion", "Olistar", "Telion", "Nelara", "Orionix"
];

interface SolarSystem {
    mainStar: Star;
    planets: Planet[];
    stars: Star[];
}

interface Planet {
    name: string;
    size: number;
    color: number[];
    angle: number;
    rotatingSpeed: number;
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

type UpdateSystem = {
    distance: number;
    angle: number;
    rotatingSpeed: number;
    planet: any;
    cloud: any;
    rings: Array<any>;
};


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
    const [planetRingVShader, setPlanetRingVShader] = useState("");
    const [planetRingFShader, setPlanetRingFShader] = useState("");

    const [loading, setLoading] = useState(true);

    const speed = useRef(0);
    const superSpeed = useRef(false);
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
            fetch('/universeShaders/moonFShader.glsl').then(response => response.text()),
            fetch('/universeShaders/planetRingsVShader.glsl').then(response => response.text()),
            fetch('/universeShaders/planetRingsFShader.glsl').then(response => response.text())
        ])
            .then(([sunVShaderData, sunFShaderData, cubeVShaderData, cubeFShaderData,
                       cloudVShaderData, cloudFShaderData, moonVShaderData, moonFShaderData,
                       planetRingVShaderData, planetRingFShaderData]) => {
                setPlanetVShader(sunVShaderData);
                setPlanetFShader(sunFShaderData);
                setCubeVShader(cubeVShaderData);
                setCubeFShader(cubeFShaderData);
                setCloudVShader(cloudVShaderData);
                setCloudFShader(cloudFShaderData);
                setMoonVShader(moonVShaderData);
                setMoonFShader(moonFShaderData);
                setPlanetRingVShader(planetRingVShaderData);
                setPlanetRingFShader(planetRingFShaderData);
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
            let planetSize = getRandomNumber(15, 65);
            let angle = Math.random() * 360;
            let distance = getRandomNumber(1000, 6000);
            const planet = {
                name: `Planet ${i + 1}`,
                size: planetSize,
                color: getRandomColor(),
                angle: angle,
                rotatingSpeed: (getRandomNumber(0, 10) - 5) / 10000,
                distanceFromSun: distance,
                moons: [] as Moon[],
                hasRings: Math.random() < 0.5,
            };

            const numMoons = Math.floor(Math.random() * 4);

            for (let j = 0; j < numMoons; j++) {
                let angle1 = Math.random() * 360;
                let angle2 = Math.random() * 360;
                let distance = getRandomNumber(planet.size * 5, 500);

                let moonPosition = [
                    distance * Math.sin(angle1) * Math.cos(angle2),
                    distance * Math.sin(angle1) * Math.sin(angle2),
                    distance * Math.cos(angle1)
                ];

                const moon = {
                    name: `Moon ${j + 1}`,
                    size: getRandomNumber(6, planet.size / 2),
                    position: moonPosition,
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

        function getRandomNumber(minSize: number, maxSize: number) {
            return Math.max(minSize, Math.random() * maxSize);
        }

        function getRandomColor() {
            return [Math.random(), Math.random(), Math.random()];
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
        renderer.setClearColor(0x000123);
        renderer.clear();
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            canvas.width / canvas.height,
            0.1,
            100000
        );
        camera.position.setZ(10000);

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
        sun.name = "Sun";
        scene.add(sun);

        const numPlanets = solarSystem.planets.length;

        const cloudMaterials: any = [];
        const planets: any = [[]];

        const updateSystem: UpdateSystem[] = [];

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

            if (planet.distanceFromSun < 2000) {
                planetMaterial.fragmentShader = moonFShader;
            }

            const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
            let position = calculatePositon(planet.distanceFromSun, planet.angle);
            planetMesh.position.set(position[0], position[1], 0);
            planetMesh.name = planetNames[Math.floor(getRandomFloat(0, 99))];
            scene.add(planetMesh);
            console.log(planet.angle);

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
            clouds.position.set(position[0], position[1], 0);
            clouds.name = "clouds";
            scene.add(clouds);

            const rings: any = [];

            if (getRandomFloat(0, 6) < 2) {
                let numberOfRings = Math.floor(getRandomFloat(2, 6));
                let radius = planet.size * 2;
                let size = getRandomFloat(0, planet.size / 5);
                for (let j = 0; j < numberOfRings; j++) {
                    const ringGeometry = new THREE.TorusGeometry(radius, size, 2, 100);
                    const ringMaterial = new THREE.ShaderMaterial({
                        uniforms: {
                            color: {
                                value: new THREE.Vector3(
                                    105 + getRandomFloat(0, 30),
                                    101 + getRandomFloat(0, 30),
                                    59 + getRandomFloat(0, 30))
                            },
                            time: {value: 0.0}
                        },
                        vertexShader: planetRingVShader,
                        fragmentShader: planetRingFShader,
                        transparent: false,
                    });
                    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                    ring.position.set(position[0], position[1], 0);
                    scene.add(ring);
                    rings.push(ring);

                    radius += size;
                    size = getRandomFloat(0, planet.size / 5);
                    radius += size + getRandomFloat(0, 1);
                }
            }
            //add orbits
            const orbitGeometry = new THREE.TorusGeometry(planet.distanceFromSun, 2, 2, 100);
            const orbitMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff
            });
            const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
            orbit.position.set(0, 0, 0);
            scene.add(orbit);

            const numMoons = planet.moons.length;

            const moons: any = [[]];

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
                moonMesh.position.set(position[0] + moon.position[0], position[1] + moon.position[1], moon.position[2]);
                scene.add(moonMesh);
                moons.push(moonMesh);
            }
            //funny bug
            //planets.push([planet.distanceFromSun, planet.angle, planetMesh, clouds, orbit, moons]);
            //planets.push([planet.distanceFromSun, planet.angle, planetMesh, clouds, rings, moons]);
            updateSystem.push({
                distance: planet.distanceFromSun,
                angle: planet.angle,
                rotatingSpeed: planet.rotatingSpeed,
                planet: planetMesh,
                cloud: clouds,
                rings: rings,
            })
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

            let movingSpeed = speed.current;
            if (superSpeed.current) movingSpeed *= 25;
            camera.position.addScaledVector(direction.current, movingSpeed);


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
            if (updateSystem.length > 0) {
                updateSystem.forEach((planet: any) => {
                    planet.angle += planet.rotatingSpeed;
                    let position = calculatePositon(planet.distance, planet.angle);
                    if (planet.planet) {
                        planet.planet.position.set(position[0], position[1], 0);
                        planet.planet.rotation.x += 0.01;
                        //planet.planet.angle.set(planet.planet.angle + 1);
                    }
                    if (planet.cloud) {
                        planet.cloud.position.set(position[0], position[1], 0);
                        planet.cloud.rotation.x += 0.01;
                    }
                    if (planet.rings) {
                        if (planet.rings.length > 0) {
                            planet.rings.forEach((ring: any) => {
                                ring.position.set(position[0], position[1], 0);
                            })
                        }
                    }
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
            } else if (event.shiftKey) {
                superSpeed.current = true;
            }
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if (event.code === "KeyW") {
                speed.current = 0;
            } else if (event.code === "KeyS") {
                speed.current = 0;
            } else if (event.key === "Shift") {
                superSpeed.current = false;
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

        let raycaster = new THREE.Raycaster();
        let mouse = new THREE.Vector2();

        const onMouseMove = (event: MouseEvent) => {

            // Calculate mouse position in normalized device coordinates (-1 to +1) for both components
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            // Update the picking ray with the camera and mouse position
            raycaster.setFromCamera(mouse, camera);

            // Calculate objects intersecting the picking ray
            var intersects = raycaster.intersectObjects(scene.children);
            // If there's any intersections
            if (intersects.length > 0) {

                if (intersects.length > 1) {
                    setTooltipText(intersects[1].object.name);
                    setTooltipVisible(true);
                } else {
                    if (intersects[0].object.name !== 'clouds') {
                    }
                    if (intersects[0].object.name === 'Sun') {
                        setTooltipText(intersects[0].object.name);
                        setTooltipVisible(true);
                    }
                }

            } else {
                setTooltipVisible(false);
            }

        }

        canvas.addEventListener('keydown', handleKeyDown);
        canvas.addEventListener('keyup', handleKeyUp);

        canvas.addEventListener('mousedown', handleMouseDown, false);
        canvas.addEventListener('mouseup', handleMouseUp, false);
        canvas.addEventListener('mousemove', handleMouseMove, false);
        canvas.addEventListener('mousemove', onMouseMove, false);
        return () => {
            canvas.removeEventListener('keydown', handleKeyDown);
            canvas.removeEventListener('keyup', handleKeyUp);
            canvas.removeEventListener('mousedown', handleMouseDown, false);
            canvas.removeEventListener('mouseup', handleMouseUp, false);
            canvas.removeEventListener('mousemove', handleMouseMove, false);
            canvas.removeEventListener('mousemove', onMouseMove, false);
        };
    }


    const [mousePos, setMousePos] = useState({x: 0, y: 0});
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipText, setTooltipText] = useState("");

    const handleMouseMove = (e: any) => {
        setMousePos({x: e.clientX, y: e.clientY});
    };

    function calculatePositon(distance: number, angle: number): number[] {
        return [distance * Math.cos(angle), distance * Math.sin(angle)];
    }

    return (
        <div style={{position: "relative"}}>
            <canvas ref={canvasRef} onMouseMove={handleMouseMove} style={{position: "fixed", top: 0, left: 0}}/>


            {tooltipVisible && (<span
                className="tooltip"
                style={{
                    left: `${mousePos.x}px`,
                    top: `${mousePos.y - 320}px`
                }}
            >
            {tooltipText}
            </span>)}

        </div>
    );
}
export default MMUniverse;