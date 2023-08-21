import {MMAProjectile} from "../MMAProjectile";
import {Vector3} from "three";
import * as THREE from "three";
import {MMEnemyManager} from "../../enemies/MMEnemyManager";
import {MMAEnemy} from "../../enemies/MMAEnemy";
import {MMTDSceneManager} from "../../../MMTDSceneManager";
import {MMProjectileManager} from "../MMProjectileManager";

export class MMGravityShaperProjectile extends MMAProjectile {

    discMesh!: THREE.Mesh;
    range: number = 200;
    gravityForce: number = 2;
    damage = 0.1;

    constructor(position: Vector3) {
        super();

        this.position = position;
        const projectileGeometry = new THREE.SphereGeometry(10, 10, 10);
        const projectileMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
        this.projectileMesh = new THREE.Mesh(projectileGeometry, projectileMaterial);
        this.projectileMesh.position.set(position.x, position.y, position.z);

        const discGeometry = new THREE.CircleGeometry(this.range, 32);
        const discMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFB6C1,
            transparent: true,
            opacity: 0.5
        });
        this.discMesh = new THREE.Mesh(discGeometry, discMaterial);
        this.discMesh.rotation.z = -Math.PI / 2;
        this.discMesh.position.set(position.x, position.y, position.z)

        this.addMeToScene();
    }

    update(deltaTime: number) {
        MMEnemyManager.getInstance().enemies.forEach((enemy: MMAEnemy) => {
            if (this.position.distanceTo(enemy.mesh.position) < this.range) {

                const forceInDirection = new Vector3().subVectors(this.position, enemy.mesh.position).multiplyScalar(this.gravityForce * deltaTime);
                enemy.addForce(forceInDirection);
                enemy.takeDamage(this.damage);
            }
        });
        this.gravityForce -= deltaTime;
        if (this.gravityForce < 0) {
            this.destroy();
        }
    }

    destroy() {
        this.removeMeFromScene();
        //don't know if this does something
        this.projectileMesh.geometry.dispose();
        this.discMesh.geometry.dispose();
        MMProjectileManager.getInstance().deleteProjectile(this);
    }

    addMeToScene() {
        super.addMeToScene();
        MMTDSceneManager.getInstance().addToScene(this.discMesh);
    }

    removeMeFromScene() {
        super.removeMeFromScene();
        MMTDSceneManager.getInstance().removeFromScene(this.discMesh);
    }
}