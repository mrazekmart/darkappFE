import * as THREE from 'three';
import {Vector2, Vector3} from 'three';
import {GRID_SIZE_HEIGHT, GRID_SIZE_WIDTH} from "../MMTDGame";
import {MMGridMesh, MMGridType} from "./MMGridMesh";


export class MMGridCell {
    gridPosition: Vector2;
    cellSize: Vector2;
    gridMesh: MMGridMesh;


    constructor(gridPosition: Vector2, cellSize: Vector2, gridType: MMGridType, walkable: boolean) {

        const geometry = new THREE.PlaneGeometry(cellSize.x, cellSize.y);
        const material = new THREE.MeshBasicMaterial({color: 0x643506, side: THREE.DoubleSide});
        const newMesh = new THREE.Mesh(geometry, material);

        const position: Vector3 = new Vector3(
            gridPosition.x * cellSize.x - (GRID_SIZE_WIDTH * cellSize.x) / 2 + cellSize.x / 2,
            -gridPosition.y * cellSize.y + (GRID_SIZE_HEIGHT * cellSize.y) / 2 - cellSize.y / 2,
            0);
        newMesh.position.set(position.x, position.y, position.z);


        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x000000 }));
        line.position.set(position.x, position.y, position.z);

        this.gridPosition = gridPosition;
        this.cellSize = cellSize;

        this.gridMesh = new MMGridMesh(newMesh, line, gridType, walkable);
        this.gridMesh.applyMaterial();
    }

    changeGridType() {
        if (this.gridMesh.gridType === 4) {
            this.gridMesh.gridType = 0;
        } else {
            this.gridMesh.gridType++;
        }
        this.gridMesh.applyMaterial();
    }
}