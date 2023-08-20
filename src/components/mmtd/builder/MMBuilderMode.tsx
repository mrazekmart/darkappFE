import {MMGridCell} from "../grid/MMGridCell";
import {MMGridType} from "../grid/MMGridMesh";
import {MMTowerManager} from "../gameObjects/tower/MMTowerManager";

export class MMBuilderMode {
    private static instance: MMBuilderMode;

    isBuildingMode: boolean = false;
    towerToPlaceType!: number;

    private constructor() {
    }

    public static getInstance(): MMBuilderMode {
        if (!this.instance) {

            this.instance = new MMBuilderMode();
        }
        return this.instance;
    }

    turnOn() {
        this.isBuildingMode = true;
    }

    turnOff() {
        this.isBuildingMode = false;
    }

    placeTower(intersectedCustomObject: MMGridCell) {
        if (intersectedCustomObject.gridMesh.gridType === MMGridType.Ground) {
            MMTowerManager.getInstance().createTower(this.towerToPlaceType, intersectedCustomObject.gridPosition, intersectedCustomObject.gridMesh.mesh.position);
        }
    }
}