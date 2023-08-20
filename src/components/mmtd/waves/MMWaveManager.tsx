import {MMBasicEnemy} from "../gameObjects/enemies/enemies/MMBasicEnemy";
import {MMPathFinder} from "../grid/pathfinding/MMPathFinder";
import {MMEnemyManager} from "../gameObjects/enemies/MMEnemyManager";

export class MMWaveManager {
    private static instance: MMWaveManager;

    waves: number[][] = [
        [20, 2], [10, 1], [30, 3]
    ]
    wave: number = 0;

    private constructor() {
    }

    public static getInstance(): MMWaveManager {
        if (!this.instance) {

            this.instance = new MMWaveManager();
        }
        return this.instance;
    }

    nextWave() {
        this.startWave(this.wave);
        this.wave++;
    }

    startWave(wave: number) {
        const currentWave: number[] = this.waves[wave];

        let counter = 0;
        const maxSpawns = currentWave[0];
        const delaySec = currentWave[1];

        const spawnEnemies = setInterval(() => {

            MMEnemyManager.getInstance().createEnemy(MMPathFinder.getInstance().startNode.center);
            counter++;
            if (counter >= maxSpawns) {
                clearInterval(spawnEnemies);
            }
        }, delaySec * 1000)
    }

}