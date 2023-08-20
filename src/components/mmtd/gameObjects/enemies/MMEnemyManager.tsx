import {MMBasicEnemy} from "./enemies/MMBasicEnemy";
import {Vector3} from "three";
import {MMAEnemy} from "./MMAEnemy";

export class MMEnemyManager {
    private static instance: MMEnemyManager;

    enemies: MMAEnemy[] = [];

    private constructor() {
    }

    public static getInstance(): MMEnemyManager {
        if (!this.instance) {

            this.instance = new MMEnemyManager();
        }
        return this.instance;
    }

    createEnemy(position: Vector3){
        const enemy = new MMBasicEnemy(position);
        this.addEnemy(enemy);
    }

    deleteEnemy(enemyToDelete: MMAEnemy) {
        this.enemies = this.enemies.filter((enemy: MMAEnemy) => enemy.mesh.id !== enemyToDelete.mesh.id);
    }

    updateEnemies(deltaTime: number){
        this.enemies.forEach((enemy: MMBasicEnemy) =>{
            enemy.update(deltaTime);
        })
    }

    calculateNewPath(){
        this.enemies.forEach((entity: any) => {
            entity.calculateNewPath = true;
        })
    }

    private addEnemy(enemy: MMBasicEnemy) {
        this.enemies.push(enemy);
    }
}
