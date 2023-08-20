import * as THREE from 'three';
import {Vector2} from 'three';

import {MMGridCell} from "../MMGridCell";
import {MMGridType} from "../MMGridMesh";
import {MMTDSceneManager} from "../../MMTDSceneManager";

export class MMGridMakerGridManager {
    private static instance: MMGridMakerGridManager;
    gridSize!: Vector2;
    cellSize!: Vector2;
    grid!: MMGridCell[][];

    private constructor() {
    }

    public static getInstance(): MMGridMakerGridManager {
        if (!this.instance) {

            this.instance = new MMGridMakerGridManager();
        }
        return this.instance;
    }

    public static build(gridSize: Vector2, cellSize: Vector2) {
        this.getInstance().gridSize = gridSize;
        this.getInstance().cellSize = cellSize;
        this.getInstance().grid = new Array(gridSize.x).fill(undefined).map(() => new Array(gridSize.y).fill(undefined));
        this.getInstance().createGrid(this.getInstance().gridSize, this.getInstance().cellSize);
        return this.getInstance();
    }

    createGrid(gridSize: Vector2, cellSize: Vector2) {

        for (let i = 0; i < gridSize.x; i++) {
            for (let j = 0; j < gridSize.y; j++) {
                this.grid[i][j] = new MMGridCell(new Vector2(i, j), cellSize, MMGridType.Ground, true);
            }
        }
    }

    addMeToScene() {
        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                MMTDSceneManager.getInstance().scene.add(this.grid[i][j].gridMesh.mesh);
                MMTDSceneManager.getInstance().scene.add(this.grid[i][j].gridMesh.lineMesh);
            }
        }
    }
}