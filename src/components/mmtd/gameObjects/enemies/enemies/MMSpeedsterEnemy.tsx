import * as THREE from "three";
import {Vector3} from "three";

import {MMAEnemy} from "../MMAEnemy";


//progressively speeding up
export class MMSpeedsterEnemy extends MMAEnemy {

    constructor(position: Vector3) {
        super();
        const geometry = new THREE.BoxGeometry(30, 30, 30);
        const material = new THREE.MeshBasicMaterial({color: 0x00FFFF});
        const newMesh = new THREE.Mesh(geometry, material);

        newMesh.position.set(position.x, position.y, position.z);
        this.mesh = newMesh;

        this.addMeToScene();

    }

    update(deltaTime: number) {
        super.update(deltaTime);
        this.speed += 0.04;
    }

    takeDamage(damage: number) {
        super.takeDamage(damage);
    }

    addMeToScene() {
        super.addMeToScene();
    }
}