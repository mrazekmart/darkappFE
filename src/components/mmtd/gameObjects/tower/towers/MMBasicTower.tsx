import {MMATower} from "../MMATower";
import * as THREE from "three";
import {Vector2, Vector3} from "three";

export class MMBasicTower extends MMATower {

    constructor(gridPosition: Vector2, position: Vector3) {
        super();
        this.gridPosition = gridPosition;

        const buildingGeometry = new THREE.BoxGeometry(60, 60, 2);
        const buildingMaterial = new THREE.MeshBasicMaterial({color: 0xA52A2A});
        const buildingMesh = new THREE.Mesh(buildingGeometry, buildingMaterial);
        buildingMesh.position.set(position.x, position.y, position.z);
        this.meshes.push(buildingMesh)

        const weaponGeometry = new THREE.BoxGeometry(10, 10, 10);
        const weaponMaterial = new THREE.MeshBasicMaterial({color: 0x7FFF00});
        const weaponMesh = new THREE.Mesh(weaponGeometry, weaponMaterial);
        weaponMesh.position.set(position.x, position.y, position.z);
        this.meshes.push(weaponMesh)

        this.addMeToScene();
    }
}