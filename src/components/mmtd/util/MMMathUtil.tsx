import {Vector2, Vector3} from "three";
import {CANVAS_HEIGHT, CANVAS_WIDTH, CELL_HEIGHT, CELL_WIDTH} from "../MMTDGame";

export const gridPositionFromVector = (position: Vector3): Vector2 => {
    return new Vector2(
        Math.round((position.x + CANVAS_WIDTH / 2 - CELL_WIDTH / 2) / CELL_WIDTH),
        Math.round((-position.y + CANVAS_HEIGHT / 2 - CELL_HEIGHT / 2) / CELL_HEIGHT));
}