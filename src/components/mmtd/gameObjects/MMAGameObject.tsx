export enum MMGameObjectType {
    MMTower,
    MMEnemy,
    MMProjectile,
}

/**
 * Represents an abstract game object for a MMTD game.
 * This class should not be instantiated directly but should be inherited by other specific game objects.
 */
export class MMAGameObject {

    /**
     * Constructs an instance of MMAGameObject.
     *
     * Throws an error if an attempt is made to instantiate this abstract class directly.
     */
    constructor() {
        if (new.target === MMAGameObject) {
            throw new Error("Cannot instantiate abstract class GameObject");
        }
    }

    /**
     * Updates the state of the game object given the elapsed time since the last update.
     *
     * @param {number} deltaTime - The elapsed time in milliseconds since the last update.
     * @throws {Error} If the method is not overridden in a derived class.
     */
    update(deltaTime: number) {
        throw new Error("Method 'someMethod' must be implemented");
    }

    /**
     * Adds the game object to the specified scene.
     *
     * @throws {Error} If the method is not overridden in a derived class.
     */
    addMeToScene() {
        throw new Error("Method 'addMeToScene' must be implemented");
    }

    /**
     * Removes the game object from the specified scene.
     *
     * @throws {Error} If the method is not overridden in a derived class.
     */
    removeMeFromScene() {
        throw new Error("Method 'removeMeFromScene' must be implemented");
    }
}
