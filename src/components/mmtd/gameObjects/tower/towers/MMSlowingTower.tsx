import {MMATower} from "../MMATower";
import * as THREE from "three";
import {Vector2, Vector3} from "three";
import {MMProjectileManager, MMProjectileType} from "../../projectiles/MMProjectileManager";
import {MMAEnemy} from "../../enemies/MMAEnemy";
import {MMSlowingProjectile} from "../../projectiles/projectiles/MMSlowingProjectile";

export class MMSlowingTower extends MMATower {

    slowingProjectile!: MMSlowingProjectile;
    slowingTo: number = 0.2;

    weaponMesh: THREE.Mesh;

    constructor(gridPosition: Vector2, position: Vector3) {
        super();
        this.gridPosition = gridPosition;

        const buildingGeometry = new THREE.BoxGeometry(40, 40, 2);
        const buildingMaterial = new THREE.MeshBasicMaterial({color: 0x0000FF});
        const buildingMesh = new THREE.Mesh(buildingGeometry, buildingMaterial);
        buildingMesh.position.set(position.x, position.y, position.z);
        this.meshes.push(buildingMesh)

        const weaponGeometry = new THREE.BoxGeometry(10, 10, 10);
        const weaponMaterial = new THREE.MeshBasicMaterial({color: 0xFFF8DC});
        const weaponMesh = new THREE.Mesh(weaponGeometry, weaponMaterial);
        weaponMesh.position.set(position.x, position.y, position.z);
        this.meshes.push(weaponMesh)
        this.weaponMesh = weaponMesh;

        this.addMeToScene();
    }

    update(deltaTime: number) {
        if (!this.target) {
            const closestEnemy = this.findClosestEnemy();
            if (closestEnemy) {
                this.target = closestEnemy;
                this.slowingProjectile = MMProjectileManager.getInstance().createProjectile(
                    MMProjectileType.SlowingLaser, this.weaponMesh.position, this.target) as MMSlowingProjectile;
                this.target.speed *= this.slowingTo;
            }
        }
        if (this.target) {
            if (this.weaponMesh.position.distanceTo(this.target.mesh.position) > this.weaponRange) {
                this.slowingProjectile.destroy();
                this.target.speed /= this.slowingTo;
                this.target = undefined;
                return;
            }
        }
    }

    targetDead(target: MMAEnemy) {
        if (this.target === target) {
            this.slowingProjectile.destroy();
        }
        super.targetDead(target);
    }

    addMeToScene() {
        super.addMeToScene();
    }

    findClosestEnemy(): null | MMAEnemy {
        return super.findClosestEnemy();
    }
}