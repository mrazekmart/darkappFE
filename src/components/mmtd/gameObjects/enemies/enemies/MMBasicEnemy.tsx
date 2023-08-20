import * as THREE from "three";
import {Vector3} from "three";
import {MMAEnemy} from "../MMAEnemy";

export class MMBasicEnemy extends MMAEnemy {

    constructor(position: Vector3) {
        super();
        const geometry = new THREE.BoxGeometry(30, 30, 30);
        const material = new THREE.MeshBasicMaterial({color: 0x000000});
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.set(position.x, position.y, position.z);

        // this might be helpful someday somewhere
        // this.mesh.userData.mmobject = this;
        // this.mesh.userData.mmobjectType = MMGameObjectType.MMEnemy;

        //just random speed, why not
        this.speed = Math.random() * 100 + 50;


        const healthBarGeometry = new THREE.PlaneGeometry(30, 3);
        const healthBarMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
        this.healthBarMesh = new THREE.Mesh(healthBarGeometry, healthBarMaterial);
        this.healthBarMesh.position.set(position.x, position.y + 30, position.z);

        this.addMeToScene();

    }
    takeDamage(damage: number) {
        super.takeDamage(damage);
    }
    update(deltaTime: number) {
        super.update(deltaTime);
    }

    addMeToScene() {
        super.addMeToScene();
    }
}

// drawing path line
// const removeOldLine = scene.getObjectByName("pathLine");
// if (removeOldLine) {
//     scene.remove(removeOldLine);
// }
//
// const points: any = [];
// this.path?.forEach((cell:MMNode)=>{
//     points.push(cell.center);
// })
// const geometry = new THREE.BufferGeometry().setFromPoints(points);
// const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
// const line = new THREE.Line(geometry, material);
// line.name = "pathLine";
//
// scene.add(line);