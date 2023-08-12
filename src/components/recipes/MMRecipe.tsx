import React, {useState, useEffect} from "react";
import MMModal from "./../MMModal";
import MMAddRecipe from "./MMAddRecipe";
import {deleteRecipe, getRecipes} from "../api/MMApiServices";

export interface Recipe {
    recipeName: string,
    recipeTemperature: string,
    recipeDuration: string,
    recipeNote: string,
    id: number
}

const MMRecipe: React.FC = () => {

    const [inputFormShow, setInputFormShow] = useState(false);
    const handleInputFormClose = () => {
        setInputFormShow(false);
        getRecipes(setItems);
    }
    const handleInputFormShow = () => setInputFormShow(true);

    const [items, setItems] = useState<Recipe[]>([]);

    const handleRemoveClick = (i: number) => {
        deleteRecipe(items[i].id)
            .then(() => {
                return getRecipes(setItems);
            })
            .catch(error => {
                console.error("Error deleting recipe:", error);
            });
    }

    useEffect(() => {
        getRecipes(setItems);
    }, []);

    return (
        <div className="mmContainerWrapper">
            <h1 className="mmBodyHeader"> Air fryer recipes </h1>
            <div className="mmContainer">
                <div className="mmRecipeContainerTop">
                    {items.map((item, idx) => (
                        <div key={idx} className="mmRecipeItems">
                            <div className="mmRecipeItem">{item.recipeName}</div>
                            <div className="mmRecipeItem">{item.recipeTemperature} °C</div>
                            <div className="mmRecipeItem">{item.recipeDuration} min</div>
                            <div className="mmRecipeItem">{item.recipeNote}</div>
                            <button
                                onClick={() => handleRemoveClick(idx)}
                                className="button mmDeleteButton"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
                <div className="mmContainerDown">
                    <button className="mmAddRecipeButton" onClick={handleInputFormShow}> Add recipe</button>
                    <MMModal show={inputFormShow} handleClose={handleInputFormClose}>
                        <MMAddRecipe/>
                    </MMModal>
                </div>
            </div>
        </div>
    );
};
export default MMRecipe;