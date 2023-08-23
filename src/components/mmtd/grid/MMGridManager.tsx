import {Vector2, Vector3} from 'three';

import {MMGridCell} from "./MMGridCell";
import {MMTDSceneManager} from "../MMTDSceneManager";
import {gridPositionFromVector} from "../util/MMMathUtil";
import {MMGridType} from "./MMGridMesh";

export class MMGridManager {
    private static instance: MMGridManager;
    gridSize!: Vector2;
    cellSize!: Vector2;
    grid!: MMGridCell[][];

    private constructor() {
    }

    public static getInstance(): MMGridManager {
        if (!this.instance) {

            this.instance = new MMGridManager();
        }
        return this.instance;
    }

    public static build(gridSize: Vector2, cellSize: Vector2, grid: MMGridCell[][]) {
        this.getInstance().gridSize = gridSize;
        this.getInstance().cellSize = cellSize;
        this.getInstance().grid = grid;
        return this.getInstance();
    }

    addMeToScene() {
        this.grid.forEach(row => {
            row.forEach(cell => {
                MMTDSceneManager.getInstance().scene.add(cell.gridMesh.mesh);
                MMTDSceneManager.getInstance().scene.add(cell.gridMesh.lineMesh);
            });
        });
    }

    /**
     * Check if the given force would push the enemy out of the road.
     * @param position - Starting position of the object
     * @param size - Size of the object
     * @param force - The vector direction and magnitude of the force.
     * @returns - True if the force pushes the enemy off-road, false otherwise.
     */
    outOfRoad(position: Vector3, size: Vector3, force: Vector3): boolean {
        const offsets = [
            new Vector3(size.x / 2, size.y / 2, 0),
            new Vector3(-size.x / 2, -size.y / 2, 0),
            new Vector3(size.x / 2, size.y / 2, 0),
            new Vector3(size.x / 2, -size.y / 2, 0)
        ];

        for (let offset of offsets) {
            const gridPosition = gridPositionFromVector(position.clone().add(offset));
            if (this.grid[gridPosition.x][gridPosition.y].gridMesh.gridType !== MMGridType.Road) {
                return true;
            }
        }
        return false;
    }
}