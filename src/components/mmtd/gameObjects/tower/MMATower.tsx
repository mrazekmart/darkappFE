import * as THREE from "three";
import {Vector2} from "three";
import {MMAGameObject} from "../MMAGameObject";
import {MMBasicEnemy} from "../enemies/enemies/MMBasicEnemy";
import {MMEnemyManager} from "../enemies/MMEnemyManager";
import {MMTDSceneManager} from "../../MMTDSceneManager";
import {MMAEnemy} from "../enemies/MMAEnemy";
import {MMProjectileManager, MMProjectileType} from "../projectiles/MMProjectileManager";

export abstract class MMATower extends MMAGameObject {

    meshes: THREE.Mesh[] = [];
    gridPosition!: Vector2;
    target!: MMAEnemy | undefined;

    weaponRange: number = 200;
    weaponFireRate: number = 2; // shots per sec
    timeToShoot: number = 1 / this.weaponFireRate;

    sceneManager = MMTDSceneManager.getInstance();


    protected constructor() {
        super();
    }

    //todo: maybe make an abstract class from here with this basic update setup
    update(deltaTime: number) {
        const weaponMesh: THREE.Mesh = this.meshes[1];

        if (this.timeToShoot < 1 / this.weaponFireRate) {
            this.timeToShoot += deltaTime;
            return;
        }

        if (!this.target) {
            const closestEnemy = this.findClosestEnemy();
            if (closestEnemy) {
                this.target = closestEnemy;
            }
        }
        if (this.target) {
            if (weaponMesh.position.distanceTo(this.target.mesh.position) > this.weaponRange) {
                this.target = undefined;
                return;
            }
            this.createProjectile();
            this.timeToShoot -= 1 / this.weaponFireRate;
        }
    }

    createProjectile() {
        const weaponMesh: THREE.Mesh = this.meshes[1];
        MMProjectileManager.getInstance().createProjectile(MMProjectileType.BasicBullet, weaponMesh.position, this.target);
    }

    targetDead(target: MMAEnemy) {
        if (this.target === target) {
            this.target = undefined;
        }
    }

    addMeToScene() {
        this.meshes.forEach((mesh: THREE.Mesh) => {
            this.sceneManager.addToScene(mesh);
        })
    }

    removeMeFromScene() {
        this.meshes.forEach((mesh: THREE.Mesh) => {
            this.sceneManager.removeFromScene(mesh);
        })
    }

    findClosestEnemy() {
        const weaponMesh: THREE.Mesh = this.meshes[1];
        const enemies = MMEnemyManager.getInstance().enemies;
        if (!enemies || enemies.length === 0) return null;

        let closestEnemy = enemies[0];
        let distanceClosestEnemy = weaponMesh.position.distanceTo(closestEnemy.mesh.position);

        enemies.forEach((enemy: MMBasicEnemy) => {
            const distanceToEnemy = weaponMesh.position.distanceTo(enemy.mesh.position);
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