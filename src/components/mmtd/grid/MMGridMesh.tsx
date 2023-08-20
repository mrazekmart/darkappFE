import * as THREE from "three";

const groundMaterial = new THREE.MeshBasicMaterial({color: 0x643506, side: THREE.DoubleSide});
const roadMaterial = new THREE.MeshBasicMaterial({color: 0xAAAAAA, side: THREE.DoubleSide});
const stoneMaterial = new THREE.MeshBasicMaterial({color: 0x011d2c, side: THREE.DoubleSide});
const startMaterial = new THREE.MeshBasicMaterial({color: 0xE70736, side: THREE.DoubleSide});
const endMaterial = new THREE.MeshBasicMaterial({color: 0x000000, side: THREE.DoubleSide});

export enum MMGridType {
    Ground,
    Road,
    Stone,
    Start,
    End
}

export class MMGridMesh {
    mesh: THREE.Mesh;
    lineMesh: THREE.LineSegments;
    gridType: MMGridType;
    walkable: boolean;

    constructor(mesh: THREE.Mesh, lineMesh: THREE.LineSegments, gridType: MMGridType, walkable: boolean) {
        this.mesh = mesh;
        this.lineMesh = lineMesh;
        this.gridType = gridType;
        this.walkable = walkable;
    }

    applyMaterial() {
        switch (this.gridType) {
            case MMGridType.Ground:
                this.mesh.material = groundMaterial;
                this.walkable = false;
                break;
            case MMGridType.Road:
                this.mesh.material = roadMaterial;
                this.walkable = true;
                break;
            case MMGridType.Stone:
                this.mesh.material = stoneMaterial;
                this.walkable = false;
                break;
            case MMGridType.Start:
                this.mesh.material = startMaterial;
                this.walkable = true;
                break;
            case MMGridType.End:
                this.mesh.material = endMaterial;
                this.walkable = true;
                break;
            default:
                this.mesh.material = groundMaterial;
                this.walkable = false;
                break;
        }
    }
}