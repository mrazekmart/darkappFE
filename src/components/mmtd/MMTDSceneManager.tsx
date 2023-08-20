import * as THREE from 'three';

export class MMTDSceneManager {
    private static instance: MMTDSceneManager;
    scene: THREE.Scene;

    private constructor() {
        this.scene = new THREE.Scene();
    }

    public static getInstance(): MMTDSceneManager {
        if (!this.instance) {
            this.instance = new MMTDSceneManager();
        }
        return this.instance;
    }

    addToScene(object: any){
        this.scene.add(object);
    }

    removeFromScene(object: any){
        this.scene.remove(object);
    }

}
