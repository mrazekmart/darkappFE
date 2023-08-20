import {Vector2} from 'three';

import {MMGridCell} from "./MMGridCell";
import {MMTDSceneManager} from "../MMTDSceneManager";

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
}