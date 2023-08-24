import * as THREE from "three";
import {Vector3} from "three";
import {MMNode, MMPathFinder} from "../../grid/pathfinding/MMPathFinder";
import {CELL_HEIGHT} from "../../MMTDGame";
import {MMTDSceneManager} from "../../MMTDSceneManager";
import {MMAGameObject} from "../MMAGameObject";
import {MMEnemyManager} from "./MMEnemyManager";
import {MMTowerManager} from "../tower/MMTowerManager";
import {MMGridManager} from "../../grid/MMGridManager";

/**
 * Represents an enemy entity in the game with movement, health, and pathfinding capabilities.
 * The MMAEnemy is an abstract class that must be extended by specific enemy types.
 */
export abstract class MMAEnemy extends MMAGameObject {
    mesh!: THREE.Mesh;
    healthBarMesh!: THREE.Mesh;
    path!: MMNode[] | null;
    calculateNewPath: boolean = true;
    size!: Vector3;

    health: number = 100;
    speed: number = 50;

    private readonly gridManager = MMGridManager.getInstance();
    private readonly sceneManager = MMTDSceneManager.getInstance();

    protected constructor() {
        super();
    }

    /**
     * Apply a force to the enemy, modifying its position.
     * @param force - The vector direction and magnitude of the force.
     */
    addForce(force: Vector3) {
        //don't push it out of the road
        if (this.gridManager.outOfRoad(this.mesh.position, this.size, force)) return;

        this.mesh.position.add(force);
        this.healthBarMesh.position.add(force);
        //FIXME this is not a good idea
        this.calculateNewPath = true;
    }

    /**
     * Inflict damage on the enemy, reducing its health.
     * @param damage - Amount of damage to apply.
     */
    takeDamage(damage: number) {
        this.health -= damage;
        if (this.health <= 0) {
            this.destroy();
        }
    }

    /**
     * Destroy the enemy entity and perform necessary cleanup.
     */
    destroy() {
        this.removeMeFromScene();
        //don't know if this does something
        this.mesh.geometry.dispose();
        this.healthBarMesh.geometry.dispose();
        MMEnemyManager.getInstance().deleteEnemy(this);
        MMTowerManager.getInstance().targetDead(this);
    }

    /**
     * Update the enemy's state for each frame.
     * This includes pathfinding and movement logic.
     * @param deltaTime - The time elapsed since the last frame.
     */
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

    /**
     * Add the enemy and its associated health bar to the scene.
     */
    addMeToScene() {
        this.sceneManager.addToScene(this.mesh);
        this.sceneManager.addToScene(this.healthBarMesh);
    }

    /**
     * Remove the enemy and its associated health bar from the scene.
     */
    removeMeFromScene() {
        this.sceneManager.removeFromScene(this.mesh);
        this.sceneManager.removeFromScene(this.healthBarMesh);
    }

    
    /**
     * Update the visual representation of the enemy's health bar.
     */
    updateHealthBar() {
        this.healthBarMesh.scale.x = this.health / 100;
        const {x, y, z} = this.mesh.position;
        this.healthBarMesh.position.set(x, y + 30, z);
    }
}