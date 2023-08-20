import * as THREE from "three";
import {Vector3} from "three";
import {MMAProjectile} from "../MMAProjectile";
import {MMAEnemy} from "../../enemies/MMAEnemy";

export class MMSlowingProjectile extends MMAProjectile {

    targetEnemy!: MMAEnemy;
    initialDistance!: number;

    constructor(position: Vector3, targetEnemy: MMAEnemy) {
        super();
        this.position = position;
        this.targetEnemy = targetEnemy;

        const distance = position.distanceTo(targetEnemy.mesh.position);
        this.initialDistance = distance;

        const cylinderGeometry = new THREE.CylinderGeometry(1, 1, distance, 8, 1, false);
        cylinderGeometry.rotateX(Math.PI / 2); // Rotate the cylinder to point along the Z-axis
        const cylinderMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
        this.projectileMesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
        this.projectileMesh.position.set(position.x, position.y, position.z);
        this.projectileMesh.lookAt(targetEnemy.mesh.position);
        this.projectileMesh.translateZ(distance / 2);

        this.addMeToScene();
    }

    update(deltaTime: number) {
        const end = this.targetEnemy.mesh.position;
        const distance = this.position.distanceTo(end);
        this.projectileMesh.scale.set(1, 1, distance / this.initialDistance);
        this.projectileMesh.position.set(this.position.x, this.position.y, this.position.z);
        this.projectileMesh.translateZ(distance / 2);
        this.projectileMesh.lookAt(end);
    }

    addMeToScene() {
        super.addMeToScene();
    }

    removeMeFromScene() {
        super.removeMeFromScene();
    }
}