import {Vector2, Vector3} from "three";
import {MMAEnemy} from "../enemies/MMAEnemy";
import {MMATower} from "./MMATower";
import {MMBasicTower} from "./towers/MMBasicTower";
import {MMSlowingTower} from "./towers/MMSlowingTower";
import {MMGravityShaperTower} from "./towers/MMGravityShaperTower";

export enum MMTowerType {
    BasicTower,
    SlowingTower,
    GravityShaperTower
}

export class MMTowerManager {
    private static instance: MMTowerManager;

    towers: MMATower[] = [];

    private constructor() {
    }

    public static getInstance(): MMTowerManager {
        if (!this.instance) {

            this.instance = new MMTowerManager();
        }
        return this.instance;
    }

    targetDead(target: MMAEnemy) {
        //TODO: rework this to observer pattern
        this.towers.forEach((tower: MMATower) => {
            tower.targetDead(target);
        })
    }

    createTower(towerType: number, gridPosition: Vector2, position: Vector3) {
        let tower;
        switch (towerType) {
            case MMTowerType.BasicTower:
                tower = new MMBasicTower(gridPosition, position);
                break
            case MMTowerType.SlowingTower:
                tower = new MMSlowingTower(gridPosition, position);
                break;
            case MMTowerType.GravityShaperTower:
                tower = new MMGravityShaperTower(gridPosition, position)
                break;
            default:
                tower = new MMBasicTower(gridPosition, position);
                break;

        }
        if (tower) this.addTower(tower);
    }

    updateTowers(deltaTime: number) {
        this.towers.forEach((tower: MMATower) => {
            tower.update(deltaTime);
        })
    }

    private addTower(tower: MMATower) {
        this.towers.push(tower);
    }
}
