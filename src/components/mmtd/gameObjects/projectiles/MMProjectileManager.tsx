import {MMAProjectile} from "./MMAProjectile";
import {Vector3} from "three";
import {MMBasicProjectile} from "./projectiles/MMBasicProjectile";
import {MMSlowingProjectile} from "./projectiles/MMSlowingProjectile";
import {MMAEnemy} from "../enemies/MMAEnemy";
import {MMGravityShaperProjectile} from "./projectiles/MMGravityShaperProjectile";
import {MMLightingStrikeProjectile} from "./projectiles/MMLightingStrikeProjectile";

export enum MMProjectileType {
    BasicBullet,
    SlowingLaser,
    GravityShaper,
    LightingStrike
}

export class MMProjectileManager {
    private static instance: MMProjectileManager;

    projectiles: MMAProjectile[] = [];

    private constructor() {
    }

    public static getInstance(): MMProjectileManager {
        if (!this.instance) {

            this.instance = new MMProjectileManager();
        }
        return this.instance;
    }

    createProjectile(projectileType: number, position: Vector3, target?: MMAEnemy): MMAProjectile | undefined {
        let projectile;
        switch (projectileType) {
            case MMProjectileType.BasicBullet:
                projectile = new MMBasicProjectile(position, target!.mesh.position);
                break;
            case MMProjectileType.SlowingLaser:
                projectile = new MMSlowingProjectile(position, target!);
                break;
            case MMProjectileType.GravityShaper:
                projectile = new MMGravityShaperProjectile(position, target!.mesh.position);
                break;
            case MMProjectileType.LightingStrike:
                projectile = new MMLightingStrikeProjectile(position, target!);
                break;
            default:
                projectile = new MMBasicProjectile(position, target!.mesh.position);
                break;
        }
        if (projectile) this.addProjectile(projectile);
        return projectile;
    }

    deleteProjectile(projectileToDelete: MMAProjectile) {
        this.projectiles = this.projectiles.filter((projectile: MMAProjectile) => projectile.projectileMesh.id !== projectileToDelete.projectileMesh.id);
    }

    updateProjectiles(deltaTime: number) {
        this.projectiles.forEach((projectile: MMAProjectile) => {
            projectile.update(deltaTime);
        })
    }

    private addProjectile(projectile: MMAProjectile) {
        this.projectiles.push(projectile);
    }
}
