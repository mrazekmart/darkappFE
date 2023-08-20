import * as THREE from 'three';
import {MMGridManager} from "./grid/MMGridManager";
import {fetchMMGrid} from "./grid/MMMapLoader";
import {MMPathFinder} from "./grid/pathfinding/MMPathFinder";
import {MMGridCell} from "./grid/MMGridCell";
import {MMEnemyManager} from "./gameObjects/enemies/MMEnemyManager";
import {MMTDSceneManager} from "./MMTDSceneManager";
import {MMGridType} from "./grid/MMGridMesh";
import {MMTowerManager} from "./gameObjects/tower/MMTowerManager";
import {MMBuilderMode} from "./builder/MMBuilderMode";
import {MMProjectileManager} from "./gameObjects/projectiles/MMProjectileManager";


export const CANVAS_WIDTH = window.innerWidth;
export const CANVAS_HEIGHT = window.innerHeight;
export const GRID_SIZE_WIDTH = 32;
export const GRID_SIZE_HEIGHT = 18;

export const CELL_WIDTH = CANVAS_WIDTH / GRID_SIZE_WIDTH;
export const CELL_HEIGHT = CANVAS_HEIGHT / GRID_SIZE_HEIGHT;


export function initializeThreeGrid(containerID: string): void {
    const scene: THREE.Scene = MMTDSceneManager.getInstance().scene;

    const canvasWidth = CANVAS_WIDTH;
    const canvasHeight = CANVAS_HEIGHT;
    const divisionsX = GRID_SIZE_WIDTH;
    const divisionsY = GRID_SIZE_HEIGHT;
    const cellWidth = CELL_WIDTH;
    const cellHeight = CELL_HEIGHT;

    const camera = new THREE.PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 1000);
    camera.position.z = 1000;
    camera.lookAt(new THREE.Vector3(0, 0, 0));


    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById(containerID)!.appendChild(renderer.domElement);


    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();


    const loadMap = async () => {
        try {
            await fetchMMGrid(divisionsX, divisionsY, cellWidth, cellHeight, scene);
        } catch (error) {
            console.error('Error fetching MMGridManager:', error);
            throw error;
        }
    }


    const meshes: any = [];
    let mmgriding: any = [];

    loadMap().then(r => {
            MMGridManager.getInstance().grid.flat().forEach((cell: MMGridCell) => meshes.push(cell.gridMesh.mesh));
            MMPathFinder.ofGrid(MMGridManager.getInstance().grid);
        }
    );

    const onClick = (event: MouseEvent) => {
        const canvasBounds = renderer.domElement.getBoundingClientRect();

        // Adjust the mouse coordinates for canvas position and scaling
        mouse.x = ((event.clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1;
        mouse.y = -((event.clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(meshes);

        if (intersects.length > 0) {
            const mesh = intersects[0].object;
            const intersectedCustomObject = MMGridManager.getInstance().grid.flat().find(obj => obj.gridMesh.mesh === mesh);

            if (!intersectedCustomObject) return;

            if (MMBuilderMode.getInstance().isBuildingMode) {
                MMBuilderMode.getInstance().placeTower(intersectedCustomObject);
                return;
            }
        }
    };


    document.addEventListener('click', onClick);


    let lastTime: number | undefined;
    const animate = (currentTime: number) => {
        if (!lastTime) {
            lastTime = currentTime;
        }

        const deltaTime = (currentTime - lastTime) / 1000;
        lastTime = currentTime;

        update(deltaTime);

        renderer.render(scene, camera);

        requestAnimationFrame(animate);
    };

    const update = (deltaTime: number) => {
        MMEnemyManager.getInstance().updateEnemies(deltaTime);
        MMTowerManager.getInstance().updateTowers(deltaTime);
        MMProjectileManager.getInstance().updateProjectiles(deltaTime);
    }

    requestAnimationFrame(animate);
}