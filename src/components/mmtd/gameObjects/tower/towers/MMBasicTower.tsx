import {MMATower} from "../MMATower";
import {Vector2, Vector3} from "three";
import * as THREE from "three";
import {MMProjectileManager, MMProjectileType} from "../../projectiles/MMProjectileManager";
import {MMAEnemy} from "../../enemies/MMAEnemy";

export class MMBasicTower extends MMATower {

    weaponFireRate: number = 2; // shots per sec
    timeToShoot: number = 1 / this.weaponFireRate;


    constructor(gridPosition: Vector2, position: Vector3) {
        super();
        this.gridPosition = gridPosition;

        const buildingGeometry = new THREE.BoxGeometry(60, 60, 2);
        const buildingMaterial = new THREE.MeshBasicMaterial({color: 0xA52A2A});
        const buildingMesh = new THREE.Mesh(buildingGeometry, buildingMaterial);
        buildingMesh.position.set(position.x, position.y, position.z);
        this.buildingMesh = buildingMesh;

        const weaponGeometry = new THREE.BoxGeometry(10, 10, 10);
        const weaponMaterial = new THREE.MeshBasicMaterial({color: 0x7FFF00});
        const weaponMesh = new THREE.Mesh(weaponGeometry, weaponMaterial);
        weaponMesh.position.set(position.x, position.y, position.z);
        this.weaponMesh = weaponMesh;

        this.addMeToScene();
    }

    update(deltaTime: number) {
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
            if (this.weaponMesh.position.distanceTo(this.target.mesh.position) > this.weaponRange) {
                this.target = undefined;
                return;
            }
            MMProjectileManager.getInstance().createProjectile(MMProjectileType.BasicBullet, this.weaponMesh.position, this.target);
            this.timeToShoot -= 1 / this.weaponFireRate;
        }
    }

    targetDead(target: MMAEnemy) {
        super.targetDead(target);
    }

    addMeToScene() {
        super.addMeToScene();
    }

    findClosestEnemy(): null | MMAEnemy {
        return super.findClosestEnemy();
    }
}