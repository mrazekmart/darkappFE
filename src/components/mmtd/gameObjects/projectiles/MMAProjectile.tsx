import {MMAGameObject, MMGameObjectType} from "../MMAGameObject";
import {Vector3} from "three";
import * as THREE from "three";
import {MMTDSceneManager} from "../../MMTDSceneManager";
import {MMProjectileManager} from "./MMProjectileManager";
import {MMAEnemy} from "../enemies/MMAEnemy";
import {MMEnemyManager} from "../enemies/MMEnemyManager";

export abstract class MMAProjectile extends MMAGameObject {
    projectileMesh!: THREE.Mesh;
    position!: Vector3;
    target!: Vector3;
    direction!: Vector3;
    speed: number = 80;
    lifetime: number = 4;
    damage: number = 10;

    protected constructor() {
        super();

    }

    update(deltaTime: number) {
        super.update(deltaTime);
    }

    interactWithHitObject(enemy: MMAEnemy) {
        enemy.takeDamage(this.damage);
        this.destroy();
    }

    checkForIntersections() {
        const thisBox = new THREE.Box3().setFromObject(this.projectileMesh);
        const enemies = MMEnemyManager.getInstance().enemies;

        for (const enemy of enemies) {
            const enemyBox = new THREE.Box3().setFromObject(enemy.mesh);
            if (thisBox.intersectsBox(enemyBox)) {
                this.interactWithHitObject(enemy);
                break;
            }
        }
    }

    destroy() {
        this.removeMeFromScene();
        //don't know if this does something
        this.projectileMesh.geometry.dispose();
        MMProjectileManager.getInstance().deleteProjectile(this);
    }

    addMeToScene() {
        MMTDSceneManager.getInstance().addToScene(this.projectileMesh);
    }

    removeMeFromScene() {
        MMTDSceneManager.getInstance().removeFromScene(this.projectileMesh);
    }
}
