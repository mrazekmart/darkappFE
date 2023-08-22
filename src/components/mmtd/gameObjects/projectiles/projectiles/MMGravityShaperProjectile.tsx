import {MMAProjectile} from "../MMAProjectile";
import * as THREE from "three";
import {Vector3} from "three";
import {MMEnemyManager} from "../../enemies/MMEnemyManager";
import {MMAEnemy} from "../../enemies/MMAEnemy";
import {MMTDSceneManager} from "../../../MMTDSceneManager";
import {MMProjectileManager} from "../MMProjectileManager";

export class MMGravityShaperProjectile extends MMAProjectile {

    discMesh!: THREE.Mesh;
    range: number = 200;
    gravityForce: number = 200;
    damage = 0.1;

    constructor(position: Vector3, target: Vector3) {
        super();
        this.position = position;
        this.target = target

        const projectileGeometry = new THREE.SphereGeometry(10, 10, 10);
        const projectileMaterial = new THREE.MeshBasicMaterial({color: 0x000000});
        this.projectileMesh = new THREE.Mesh(projectileGeometry, projectileMaterial);
        this.projectileMesh.position.set(position.x, position.y, position.z);

        // const discGeometry = new THREE.CircleGeometry(this.range, 32);
        // const discMaterial = new THREE.MeshBasicMaterial({
        //     color: 0xFFB6C1,
        //     transparent: true,
        //     opacity: 0.5
        // });
        // this.discMesh = new THREE.Mesh(discGeometry, discMaterial);
        // this.discMesh.rotation.z = -Math.PI / 2;
        // this.discMesh.position.set(position.x, position.y, position.z)

        const vertexShader = `
          uniform float time;
          varying vec2 vUv;
          
          void main() {
            vUv = uv;
            
            float distFromCenter = distance(vUv, vec2(0.5, 0.5));
            
            float ripple = sin(3.0 * distFromCenter + (time)) * 10.0;
            
            vec3 newPosition = position;
            newPosition.z += ripple;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
          }
        `;

        const fragmentShader = `
          varying vec2 vUv;
          
          void main() {
            float distFromCenter = distance(vUv, vec2(0.5, 0.5));
            
        
            float intensity = 1.0 - distFromCenter;
            vec3 pinkColor = vec3(1.0, 0.71, 0.76);
            vec3 blendedColor = mix(vec3(1.0, 1.0, 1.0), pinkColor, intensity);
        
            gl_FragColor = vec4(blendedColor, 0.4);
          }
        `;


        const gravityFieldGeometry = new THREE.RingGeometry(0, this.range, 64);
        const gravityFieldMaterial = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                time: {value: 0}
            },
            side: THREE.DoubleSide,
            transparent: true
        });
        this.discMesh = new THREE.Mesh(gravityFieldGeometry, gravityFieldMaterial);
        this.discMesh.rotation.z = -Math.PI / 2;
        this.discMesh.position.set(position.x, position.y, position.z)
        this.direction = new THREE.Vector3().subVectors(target, this.position).normalize();

        this.addMeToScene();
    }

    update(deltaTime: number) {
        //TODO: consider adding gravity effect also on other bullets
        MMEnemyManager.getInstance().enemies.forEach((enemy: MMAEnemy) => {
            if (this.projectileMesh.position.distanceTo(enemy.mesh.position) < this.range) {

                const forceInDirection = new Vector3().subVectors(this.projectileMesh.position, enemy.mesh.position).normalize().multiplyScalar(this.gravityForce * deltaTime);
                // const forceInDirection = new Vector3().subVectors(this.position, enemy.mesh.position).multiplyScalar(this.gravityForce * deltaTime);
                enemy.addForce(forceInDirection);
                enemy.takeDamage(this.damage);
            }
        });
        this.gravityForce -= 100 * (deltaTime / 1.5);
        if (this.gravityForce < 0) {
            this.destroy();
        }

        (this.discMesh.material as THREE.ShaderMaterial).uniforms.time.value += deltaTime;

        const step = this.direction.clone().multiplyScalar(this.speed * deltaTime);
        this.projectileMesh.position.add(step);
        this.discMesh.position.add(step);

    }

    destroy() {
        this.removeMeFromScene();
        //don't know if this does something
        this.projectileMesh.geometry.dispose();
        this.discMesh.geometry.dispose();
        MMProjectileManager.getInstance().deleteProjectile(this);
    }

    addMeToScene() {
        super.addMeToScene();
        MMTDSceneManager.getInstance().addToScene(this.discMesh);
    }

    removeMeFromScene() {
        super.removeMeFromScene();
        MMTDSceneManager.getInstance().removeFromScene(this.discMesh);
    }
}