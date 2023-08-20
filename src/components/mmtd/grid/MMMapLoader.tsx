import {MMGridManager} from "./MMGridManager";
import {MMGridCell} from "./MMGridCell";
import {Vector2} from "three";
import {MMCellJson} from "./maker/MMGridMaker";

export async function fetchMMGrid(divisionsX: number, divisionsY: number, cellWidth: number, cellHeight: number, scene: any) {
    try {
        const response = await fetch('mmmap.json');
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        const jsonData = await response.json();

        const mmCells: MMGridCell[][] = [];
        let currentRow: MMGridCell[] = [];
        let x = 0;

        jsonData.forEach((cell: MMCellJson) => {
            const gridCell = new MMGridCell(cell.gridPosition, cell.cellSize, cell.gridType, cell.gridWalkable)
            if (cell.gridPosition.x === x) {
                currentRow.push(gridCell);
            } else {
                mmCells.push(currentRow);
                currentRow = [gridCell];
                x++;
            }
        });
        mmCells.push(currentRow);

        MMGridManager.build(new Vector2(divisionsX, divisionsY), new Vector2(cellWidth, cellHeight), mmCells).addMeToScene();

    } catch (error) {
        console.error('Error fetching or parsing the JSON:', error);
        throw error;
    }
}
