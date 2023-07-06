import React, {useEffect, useRef, useState} from "react";
import * as THREE from "three";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import axios from "axios";

interface Planet {
    planetName: string;
    planetType: number;
    modelData: any;
    moons: Moon[];
}

interface Moon {
    moonName: string;
}


const MMPlanet = () => {
    const canvasRef: React.RefObject<HTMLCanvasElement> = useRef(null);
    const [maxWidth] = useState<number>(5000);
    const [maxHeight] = useState<number>(5000);

    const [cubeVShader, setCubeVShader] = useState("");
    const [cubeFShader, setCubeFShader] = useState("");

    const [loading, setLoading] = useState(true);

    const speed = useRef(0);
    const superSpeed = useRef(false);
    const isDragging = useRef(false);

    const startPosition = useRef({x: 0, y: 0});
    const currentPosition = useRef({x: 0, y: 0});
    const direction = useRef(new THREE.Vector3());

    const [mainPlanet, setMainPlanet] = useState<Planet>();

    let mouse = new THREE.Vector2();

    const getUserProfileSettings = async () => {
        const token = localStorage.getItem('jwt');
        try {
            const response = await axios.get("/api/planet/getPlanet", {headers: {"Authorization": `Bearer ${token}`}});
            if (response.data) {
                let moon: Moon = {moonName: 'Moon2'};
                const planet: Planet = {
                    planetName: response.data.planet_name,
                    planetType: response.data.planet_type,
                    modelData: response.data.model_data,
                    moons: [moon]
                }
                setMainPlanet(planet);
            }
        } catch (error) {
            console.log(error);
        }
    };

    function loadModel(url: string): Promise<THREE.Mesh> {
        const loader = new GLTFLoader();

        return new Promise((resolve, reject) => {
            loader.load(
                url,
                (gltf) => {
                    let mesh: THREE.Mesh | null = null;

                    gltf.scene.traverse((node) => {
                        if (node instanceof THREE.Mesh) {
                            node.scale.set(2, 2, 2); // Scale the size of your model by 2 in the x, y and z direction
                            mesh = node; // assign the mesh to your variable
                        }
                    });

                    if (mesh) {
                        resolve(mesh);
                    } else {
                        reject(new Error('No mesh in the model'));
                    }
                },
                undefined, // onProgress callback not needed
                (error) => reject(error)
            );
        });
    }

    useEffect(() => {
        Promise.all([
            fetch('/universeShaders/cubeVertexShader.glsl').then(response => response.text()),
            fetch('/universeShaders/cubeFragmentShader.glsl').then(response => response.text()),
            getUserProfileSettings()
        ])
            .then(([cubeVShaderData, cubeFShaderData]) => {
                setCubeVShader(cubeVShaderData);
                setCubeFShader(cubeFShaderData);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);


    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) return;

        canvas.setAttribute('tabindex', '0');
        canvas.focus();

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        if (loading) return;

        renderPlanet(canvas);
    }, [cubeVShader]);

    function renderPlanet(canvas: HTMLCanvasElement) {

        const renderer = new THREE.WebGLRenderer({
            canvas,
            context: canvas.getContext("webgl2") as WebGLRenderingContext,
            antialias: true
        });
        renderer.shadowMap.enabled = true;
        const clock = new THREE.Clock();

        renderer.setSize(canvas.width, canvas.height);
        renderer.setClearColor(0x000123);
        renderer.clear();

        const planetScene = new THREE.Scene();
        const cameraPlanet = new THREE.PerspectiveCamera(
            75,
            canvas.width / canvas.height,
            0.1,
            100000
        );
        cameraPlanet.position.setZ(5);

        const light = new THREE.PointLight(0xffffff, 10, 100);
        light.position.set(0, 0, 5);
        planetScene.add(light);

        let binaryData = atob(mainPlanet?.modelData);

        let arrayBuffer = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
            arrayBuffer[i] = binaryData.charCodeAt(i);
        }
        let blob = new Blob([arrayBuffer], {type: 'model/gltf-binary'});
        let url = URL.createObjectURL(blob);



        let loader = new GLTFLoader();

        let mesh = new THREE.Mesh();

        async function loadAndAddModel(url: string) {
            try {
                mesh = await loadModel(url);
                planetScene.add(mesh);
            } catch (error) {
                console.error(error);
            }
        }

        loadAndAddModel(url);
        console.log(mesh);


        let timer: number = 0;

        function animate() {
            requestAnimationFrame(animate);

            cameraPlanet.getWorldDirection(direction.current);

            const delta: number = clock.getDelta();
            timer += delta;
            if (timer < 0.02) {
                return;
            }
            timer = 0;

            mesh.rotation.x += 0.01;

            let movingSpeed = speed.current;
            if (superSpeed.current) movingSpeed *= 25;
            cameraPlanet.position.addScaledVector(direction.current, movingSpeed);


            if (isDragging.current) {
                const dx = (currentPosition.current.x - startPosition.current.x) * 0.001;
                const dy = (currentPosition.current.y - startPosition.current.y) * 0.001;

                cameraPlanet.rotation.y += dx;
                cameraPlanet.rotation.x += dy;

                startPosition.current = currentPosition.current;
            }

            renderer.render(planetScene, cameraPlanet);
        }

        animate();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.code === "KeyW") {
                speed.current = .2;
            } else if (event.code === "KeyS") {
                speed.current = -.2;
            } else if (event.code === "KeyA") {
                cameraPlanet.position.x += 2;
            } else if (event.code === "KeyD") {
                cameraPlanet.position.x -= 2;
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
            event.preventDefault()

            isDragging.current = true;
            startPosition.current = {x: event.clientX, y: event.clientY};
        };

        const handleMouseUp = (event: MouseEvent) => {
            event.preventDefault()
            isDragging.current = false;
        };

        const handleMouseMove = (event: MouseEvent) => {
            event.preventDefault()
            if (isDragging.current) {
                currentPosition.current = {x: event.clientX, y: event.clientY};
            }
        };

        const onMouseMove = (event: MouseEvent) => {
            event.preventDefault()
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
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


    return (
        <div style={{position: "relative"}}>
            <canvas ref={canvasRef} style={{position: "fixed", top: 0, left: 0}}/>
        </div>
    );
}

export default MMPlanet;