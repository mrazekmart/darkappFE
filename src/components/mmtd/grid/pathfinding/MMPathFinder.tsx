import {MMGridManager} from "../MMGridManager";
import {MMGridType} from "../MMGridMesh";
import {Vector2, Vector3} from "three";
import {CANVAS_HEIGHT, CANVAS_WIDTH, CELL_HEIGHT, CELL_WIDTH, GRID_SIZE_HEIGHT, GRID_SIZE_WIDTH} from "../../MMTDGame";
import {MMGridCell} from "../MMGridCell";

/**
 * The MMPathFinder class provides functionalities to find the shortest path
 * between two nodes within a given grid using the A* pathfinding algorithm.
 *
 * The class can be initialized directly with a 2D array of MMNode objects,
 * or it can convert an MMGridManager instance into the required format for pathfinding.
 *
 * Key Features:
 * 1. Uses the Manhattan distance heuristic for efficient path estimation.
 * 2. Allows for easy conversion of an MMGridManager instance into pathfinding nodes.
 * 3. Offers a method to retrieve the shortest path between the start and end nodes.
 *
 * Example usage:
 * const pathFinder = MMPathFinder.ofGrid(myGridInstance);
 * const path = pathFinder.findPath();
 *
 * Note: It's important to ensure the MMGridManager instance contains both start and end nodes.
 */
export class MMPathFinder {

    private static instance: MMPathFinder;

    grid!: MMNode[][];
    startNode!: MMNode;
    endNode!: MMNode;

    private constructor() {
    }

    public static getInstance(): MMPathFinder {
        if (!this.instance) {

            this.instance = new MMPathFinder();
        }
        return this.instance;
    }

    /**
     * Converts a given MMGridManager to a 2D array of MMNode objects.
     *
     * @returns An instance of MMPathFinder initialized with the created node grid.
     * @param grid
     */
    static ofGrid(grid: MMGridCell[][]): MMPathFinder {
        const nodeGrid: MMNode[][] = [];
        let startNode: MMNode = {} as any;
        let endNode: MMNode = {} as any;

        grid.forEach(row => {
            let currentRow: MMNode[] = [];
            row.forEach(cell => {
                const node: MMNode =
                    {
                        x: cell.gridPosition.x,
                        y: cell.gridPosition.y,
                        g: 0,
                        h: 0,
                        f: 0,
                        walkable: cell.gridMesh.walkable,
                        center: new Vector3(
                            cell.gridPosition.x * CELL_WIDTH - (GRID_SIZE_WIDTH * CELL_WIDTH) / 2 + CELL_WIDTH / 2,
                            -cell.gridPosition.y * CELL_HEIGHT + (GRID_SIZE_HEIGHT * CELL_HEIGHT) / 2 - CELL_HEIGHT / 2,
                            0)
                    };

                if (cell.gridMesh.gridType === MMGridType.Start) startNode = node;
                if (cell.gridMesh.gridType === MMGridType.End) endNode = node;
                currentRow.push(node);
            });
            nodeGrid.push(currentRow);
        });
        this.getInstance().grid = nodeGrid;
        this.getInstance().startNode = startNode;
        this.getInstance().endNode = endNode;
        return this.getInstance();
    }

    /**
     * Searches for the shortest path between the provided start and target nodes, or
     * defaults to the initialized start and end nodes if not provided.
     *
     * @param start - The optional starting point for pathfinding. Defaults to the class's initialized start node.
     * @param target - The optional destination point for pathfinding. Defaults to the class's initialized end node.
     * @returns An array of nodes forming the path, or null if no path is found.
     */
    findPath(start?: MMNode, target?: MMNode): MMNode[] | null {
        const openList: MMNode[] = [];
        const closedList: MMNode[] = [];

        if (!start) start = this.startNode;
        if (!target) target = this.endNode;

        start.g = 0;
        start.h = this.heuristic(start, target);
        start.f = start.g + start.h;

        openList.push(start);

        while (openList.length > 0) {
            openList.sort((a, b) => a.f - b.f);
            const currentNode = openList.shift()!;

            if (currentNode === target) {
                return this.constructPath(currentNode);
            }

            closedList.push(currentNode);

            const neighbors = this.getNeighbors(currentNode);
            for (const neighbor of neighbors) {
                if (!neighbor.walkable || closedList.includes(neighbor)) {
                    continue;
                }

                const tentative_g = currentNode.g + 1;
                if (!openList.includes(neighbor) || tentative_g < neighbor.g) {
                    neighbor.parent = currentNode;
                    neighbor.g = tentative_g;
                    neighbor.h = this.heuristic(neighbor, target);
                    neighbor.f = neighbor.g + neighbor.h;

                    if (!openList.includes(neighbor)) {
                        openList.push(neighbor);
                    }
                }
            }
        }
        return null;
    }

    /**
     * Finds a path between two positions in a grid.
     *
     * This method computes the path by converting the 3D start and optional end positions to their respective grid node indices.
     * If the end position is not provided, it defaults to the center of the 'endNode'.
     * After obtaining the 2D grid node indices for the start and end positions, it calls the 'findPath' method to get the path between the two nodes.
     *
     * @param start {Vector3} - The 3D position representing the starting point of the path.
     * @param end {Vector3} [optional] - The 3D position representing the ending point of the path. If not provided, it defaults to the center of the 'endNode'.
     *
     * @returns {MMNode[] | null} - Returns an array of MMNode representing the path, or null if the path cannot be determined.
     */
    findPathByPosition(start: Vector3, end?: Vector3): MMNode[] | null {
        if (!this.endNode) return null;
        if (!this.endNode.center) return null;
        if (!end) end = this.endNode.center;

        const startNode = new Vector2(
            Math.round((start.x + CANVAS_WIDTH / 2 - CELL_WIDTH / 2) / CELL_WIDTH),
            Math.round((-start.y + CANVAS_HEIGHT / 2 - CELL_HEIGHT / 2) / CELL_HEIGHT));

        const endNode = new Vector2(
            Math.round((end.x + CANVAS_WIDTH / 2 - CELL_WIDTH / 2) / CELL_WIDTH),
            Math.round((-end.y + CANVAS_HEIGHT / 2 - CELL_HEIGHT / 2) / CELL_HEIGHT));

        return this.findPath(this.grid[startNode.x][startNode.y], this.grid[endNode.x][endNode.y]);
    }

    /**
     * Computes the heuristic value for a given node relative to a target node.
     * Uses Manhattan distance in this implementation.
     * @param node - The current node.
     * @param target - The target node.
     * @returns The heuristic value.
     */
    private heuristic(node: MMNode, target: MMNode): number {
        return Math.abs(node.x - target.x) + Math.abs(node.y - target.y);
    }

    /**
     * Gets the neighboring nodes of a given node.
     * This implementation gets the 4 immediate neighbors (no diagonals).
     * @param node - The current node.
     * @returns An array of neighboring nodes.
     */
    private getNeighbors(node: MMNode): MMNode[] {
        const neighbors: MMNode[] = [];
        const dx = [-1, 1, 0, 0];
        const dy = [0, 0, -1, 1];

        for (let i = 0; i < 4; i++) {
            const newX = node.x + dx[i];
            const newY = node.y + dy[i];

            if (newX >= 0 && newX < this.grid.length && newY >= 0 && newY < this.grid[0].length) {
                neighbors.push(this.grid[newX][newY]);
            }
        }

        return neighbors;
    }

    /**
     * Constructs the path from a given node backtracking through its parents.
     * @param node - The current node (usually the target node).
     * @returns An array of nodes representing the path.
     */
    private constructPath(node: MMNode): MMNode[] {
        const path: MMNode[] = [];
        const visited: Set<MMNode> = new Set();

        while (node) {
            if (visited.has(node)) {
                break;
            }

            path.unshift(node);
            visited.add(node);
            node = node.parent!;
        }
        //skipping first node seems to be much nicer behaviour
        path.shift();
        return path;
    }
}

export type MMNode = {
    x: number;
    y: number;
    g: number;
    h: number;
    f: number;
    walkable: boolean;
    parent?: MMNode;
    center: Vector3;
};
