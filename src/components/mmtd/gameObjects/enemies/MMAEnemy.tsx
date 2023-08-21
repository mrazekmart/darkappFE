import * as THREE from "three";
import {Vector3} from "three";
import {MMNode, MMPathFinder} from "../../grid/pathfinding/MMPathFinder";
import {CELL_HEIGHT} from "../../MMTDGame";
import {MMTDSceneManager} from "../../MMTDSceneManager";
import {MMAGameObject} from "../MMAGameObject";
import {MMEnemyManager} from "./MMEnemyManager";
import {MMTowerManager} from "../tower/MMTowerManager";

export class MMAEnemy extends MMAGameObject {
    mesh!: THREE.Mesh;
    healthBarMesh!: THREE.Mesh;
    path!: MMNode[] | null;
    calculateNewPath: boolean = true;

    health: number = 100;
    speed: number = 50;

    constructor() {
        super();
        if (new.target === MMAEnemy) {
            throw new Error("Cannot instantiate abstract class MMAEnemy");
        }
    }

    addForce(force: Vector3){
        this.mesh.position.add(force);
        this.healthBarMesh.position.add(force);
        //FIXME this is not a good idea
        this.calculateNewPath = true;
    }

    takeDamage(damage: number) {
        this.health -= damage;
        if (this.health <= 0) {
            this.destroy();
        }
    }

    destroy() {
        this.removeMeFromScene();
        //don't know if this does something
        this.mesh.geometry.dispose();
        this.healthBarMesh.geometry.dispose();
        MMEnemyManager.getInstance().deleteEnemy(this);
        MMTowerManager.getInstance().targetDead(this);
    }

    update(deltaTime: number) {
        if (this.calculateNewPath) {
            this.path = MMPathFinder.getInstance().findPathByPosition(this.mesh.position);
            this.calculateNewPath = false;
        }


        if (!this.path || this.path.length === 0) return;

        const enemyPosition: Vector3 = this.mesh.position;
        const closestNodePosition: Vector3 = this.path[0].center;

        if (enemyPosition.distanceTo(closestNodePosition) < CELL_HEIGHT / 2) {
            this.path.shift();
            return;
        }

        const direction = new THREE.Vector3().subVectors(closestNodePosition, enemyPosition).normalize();
        direction.multiplyScalar(this.speed * deltaTime);

        this.mesh.position.add(direction);
        this.updateHealthBar();
    }

    addMeToScene() {
        MMTDSceneManager.getInstance().addToScene(this.mesh);
        MMTDSceneManager.getInstance().addToScene(this.healthBarMesh);
    }

    removeMeFromScene() {
        MMTDSceneManager.getInstance().removeFromScene(this.mesh);
        MMTDSceneManager.getInstance().removeFromScene(this.healthBarMesh);
    }

    updateHealthBar() {
        this.healthBarMesh.scale.x = this.health / 100;
        const position = this.mesh.position;
        this.healthBarMesh.position.set(position.x, position.y + 30, position.z);
    }
}