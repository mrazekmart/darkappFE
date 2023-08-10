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
    distance: number;
    color: number[];
    angle1: number;
    angle2: number;
    rotationSpeed1: number;
    rotationSpeed2: number;
}

type UpdateSystem = {
    distance: number;
    angle: number;
    rotatingSpeed: number;
    planet: any;
    cloud: any;
    rings: Array<any>;
    moons: Array<any>;
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

    const animationId = useRef<number | null>(null);
    const speed = useRef(0);
    const superSpeed = useRef(false);
    const direction = useRef(new THREE.Vector3());

    const isDragging = useRef(false);
    const startPosition = useRef({x: 0, y: 0});
    const currentPosition = useRef({x: 0, y: 0});

    const containerRef = useRef<HTMLDivElement | null>(null);

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

                const moon = {
                    name: `Moon ${j + 1}`,
                    size: getRandomNumber(6, planet.size / 2),
                    distance: distance,
                    color: getRandomColor(),
                    angle1: angle1,
                    angle2: angle2,
                    rotationSpeed1: (getRandomNumber(0, 10) - 5) / 100,
                    rotationSpeed2: (getRandomNumber(0, 10) - 5) / 100,
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

            let planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
            let position = calculatePosition(planet.distanceFromSun, planet.angle);
            planetMesh.position.set(position[0], position[1], 0);
            planetMesh.name = planetNames[Math.floor(getRandomFloat(0, 99))];

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
                        transparent: true,
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
                let moonPosition = calculate3Position(moon.distance, moon.angle1, moon.angle2);
                moonMesh.position.set(position[0] + moonPosition[0], position[1] + moonPosition[1], moonPosition[2]);
                scene.add(moonMesh);
                moons.push([moonMesh, moon.angle1, moon.angle2, moon.rotationSpeed1, moon.rotationSpeed2, moon.distance]);
            }

            updateSystem.push({
                distance: planet.distanceFromSun,
                angle: planet.angle,
                rotatingSpeed: planet.rotatingSpeed,
                planet: planetMesh,
                cloud: clouds,
                rings: rings,
                moons: moons
            })
        }
        if (containerRef.current) {
            containerRef.current.appendChild(renderer.domElement);
        }
        let timer: number = 0;

        function animate() {

            animationId.current = requestAnimationFrame(animate);
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
                updateSystem.forEach((system: any) => {
                    system.angle += system.rotatingSpeed;
                    let position = calculatePosition(system.distance, system.angle);
                    if (system.planet) {
                        system.planet.position.set(position[0], position[1], 0);
                        system.planet.rotation.x += 0.01;
                        //planet.planet.angle.set(planet.planet.angle + 1);
                    }
                    if (system.cloud) {
                        system.cloud.position.set(position[0], position[1], 0);
                        system.cloud.rotation.x += 0.01;
                    }
                    if (system.rings) {
                        if (system.rings.length > 0) {
                            system.rings.forEach((ring: any) => {
                                ring.position.set(position[0], position[1], 0);
                            })
                        }
                    }
                    if (system.moons) {
                        if (system.moons.length > 0) {
                            for (let i = 1; i < system.moons.length; i++) {
                                let moon = system.moons[i];
                                moon[1] += moon[3];
                                //moon[2] += moon[4];
                                let moonPosition = calculate3Position(moon[5], moon[1], moon[2]);
                                moon[0].position.set(position[0] + moonPosition[0],
                                    position[1] + moonPosition[1],
                                    moonPosition[2]);

                            }

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

        let raycaster = new THREE.Raycaster();
        let mouse = new THREE.Vector2();

        const onMouseMove = (event: MouseEvent) => {

            if (isDragging.current) {
                currentPosition.current = {x: event.clientX, y: event.clientY};
            }

            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);

            var intersects = raycaster.intersectObjects(scene.children);
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
        canvas.addEventListener('mousemove', onMouseMove, false);
        return () => {
            canvas.removeEventListener('keydown', handleKeyDown);
            canvas.removeEventListener('keyup', handleKeyUp);
            canvas.removeEventListener('mousedown', handleMouseDown, false);
            canvas.removeEventListener('mouseup', handleMouseUp, false);
            canvas.removeEventListener('mousemove', onMouseMove, false);

            if (animationId.current) {
                cancelAnimationFrame(animationId.current);
            }

            scene.traverse((object) => {
                if (!(object instanceof THREE.Mesh)) return;

                object.geometry.dispose();

                if (Array.isArray(object.material)) {
                    for (const material of object.material) {
                        cleanMaterial(material);
                    }
                } else {
                    cleanMaterial(object.material);
                }
            });

            while (scene.children.length > 0) {
                scene.remove(scene.children[0]);
            }

            renderer.dispose();
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }

        };
    }


    const [mousePos, setMousePos] = useState({x: 0, y: 0});
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [tooltipText, setTooltipText] = useState("");

    function cleanMaterial(material: any) {
        material.dispose();

        // dispose textures
        for (const key of Object.keys(material)) {
            const value = material[key];
            if (value && typeof value === 'object' && 'dispose' in value) {
                value.dispose();
            }
        }
    }

    const handleMousePos = (e: any) => {
        setMousePos({x: e.clientX, y: e.clientY});
    };

    function calculatePosition(distance: number, angle: number): number[] {
        return [distance * Math.cos(angle), distance * Math.sin(angle)];
    }

    function calculate3Position(distance: number, angle1: number, angle2: number): number[] {
        return [distance * Math.sin(angle1) * Math.cos(angle2),
            distance * Math.sin(angle1) * Math.sin(angle2),
            distance * Math.cos(angle1)];

    }

    return (
        <div style={{position: "relative"}}>
            <canvas ref={canvasRef} onMouseMove={handleMousePos} style={{position: "fixed", top: 0, left: 0}}/>

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