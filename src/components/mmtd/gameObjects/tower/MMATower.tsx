import * as THREE from "three";
import {Vector2} from "three";
import {MMAGameObject} from "../MMAGameObject";
import {MMBasicEnemy} from "../enemies/enemies/MMBasicEnemy";
import {MMEnemyManager} from "../enemies/MMEnemyManager";
import {MMTDSceneManager} from "../../MMTDSceneManager";
import {MMAEnemy} from "../enemies/MMAEnemy";

export abstract class MMATower extends MMAGameObject {

    buildingMesh!: THREE.Mesh;
    weaponMesh!: THREE.Mesh;
    gridPosition!: Vector2;
    target!: MMAEnemy | undefined;

    weaponRange: number = 200;


    protected constructor() {
        super();
    }

    update(deltaTime: number) {
        super.update(deltaTime);
    }

    targetDead(target: MMAEnemy){
        if(this.target === target){
            this.target = undefined;
        }
    }

    addMeToScene() {
        MMTDSceneManager.getInstance().addToScene(this.buildingMesh);
        MMTDSceneManager.getInstance().addToScene(this.weaponMesh);
    }

    findClosestEnemy() {
        const enemies = MMEnemyManager.getInstance().enemies;
        if (!enemies || enemies.length === 0) return null;

        let closestEnemy = enemies[0];
        let distanceClosestEnemy = this.weaponMesh.position.distanceTo(closestEnemy.mesh.position);

        enemies.forEach((enemy: MMBasicEnemy) => {
            const distanceToEnemy = this.weaponMesh.position.distanceTo(enemy.mesh.position);
            if (distanceToEnemy < distanceClosestEnemy) {
                distanceClosestEnemy = distanceToEnemy;
                closestEnemy = enemy;
            }
        })

        if (distanceClosestEnemy < this.weaponRange) {
            return closestEnemy;
        }
        return null;
    }
}