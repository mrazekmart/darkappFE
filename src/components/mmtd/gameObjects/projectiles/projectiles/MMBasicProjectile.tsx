import  {Vector3} from "three";
import * as THREE from "three";
import {MMAProjectile} from "../MMAProjectile";

export class MMBasicProjectile extends MMAProjectile{
    constructor(position: Vector3, target: Vector3) {
        super();
        this.position = position;
        this.target = target;

        const projectileGeometry = new THREE.BoxGeometry(10, 10, 10);
        const projectileMaterial = new THREE.MeshBasicMaterial({color: 0x8A2BE2});
        const projectileMesh = new THREE.Mesh(projectileGeometry, projectileMaterial);
        projectileMesh.position.set(position.x, position.y, position.z);

        this.speed = 200;

        this.projectileMesh = projectileMesh;
        this.direction = new THREE.Vector3().subVectors(this.target, this.position).normalize();
        this.addMeToScene();
    }

    update(deltaTime: number) {
        const step = this.direction.clone().multiplyScalar(this.speed * deltaTime);
        this.projectileMesh.position.add(step);

        this.checkForIntersections();

        this.lifetime -= deltaTime;
        if (this.lifetime <= 0) {
            this.destroy();
        }
    }

    addMeToScene() {
        super.addMeToScene();
    }
    removeMeFromScene() {
        super.removeMeFromScene();
    }
}