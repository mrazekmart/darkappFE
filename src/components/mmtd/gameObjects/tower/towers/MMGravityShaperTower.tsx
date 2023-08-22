import {MMATower} from "../MMATower";
import {Vector2, Vector3} from "three";
import * as THREE from "three";
import {MMProjectileManager, MMProjectileType} from "../../projectiles/MMProjectileManager";

export class MMGravityShaperTower extends MMATower {

    weaponFireRate: number = 0.2; // shots per sec
    timeToShoot: number = 1 / this.weaponFireRate;

    constructor(gridPosition: Vector2, position: Vector3) {
        super();
        this.gridPosition = gridPosition;

        const buildingGeometry = new THREE.BoxGeometry(60, 60, 2);
        const buildingMaterial = new THREE.MeshBasicMaterial({color: 0xDC143C});
        this.buildingMesh = new THREE.Mesh(buildingGeometry, buildingMaterial);
        this.buildingMesh.position.set(position.x, position.y, position.z);

        const weaponGeometry = new THREE.BoxGeometry(20, 20, 40);
        const weaponMaterial = new THREE.MeshBasicMaterial({color: 0x008B8B});
        this.weaponMesh = new THREE.Mesh(weaponGeometry, weaponMaterial);
        this.weaponMesh.position.set(position.x, position.y, position.z);

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
            MMProjectileManager.getInstance().createProjectile(MMProjectileType.GravityShaper, this.weaponMesh.position, this.target);
            this.timeToShoot -= 1 / this.weaponFireRate;
        }
    }
}