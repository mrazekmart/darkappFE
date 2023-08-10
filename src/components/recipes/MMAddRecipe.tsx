import React, {useState} from "react";
import axios from 'axios';

const MMAddRecipe = () => {

    const [recipeName, setRecipeName] = useState<string>("");
    const [recipeTemperature, setRecipeTemperature] = useState<number>();
    const [recipeDuration, setRecipeDuration] = useState<number>();
    const [recipeNote, setRecipeNote] = useState<string>("");
    const [isPrivate, setIsPrivate] = useState<any>(false);

    const [errorAddRecipe, setErrorAddRecipe] = useState<string | null>(null);
    const [successfulAddRecipe, setSuccessfulAddRecipe] = useState<string | null>(null);

    const handleIsPrivateChange = (event:any) => {
        setIsPrivate(event.target.checked);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>
    {
        e.preventDefault();
        setErrorAddRecipe(null);
        setSuccessfulAddRecipe(null);

        const token = localStorage.getItem('jwt');

        try {
            await axios.post("/api/recipes",
                {
                    recipeName: recipeName,
                    recipeTemperature: recipeTemperature,
                    recipeDuration: recipeDuration,
                    recipeNote: recipeNote,
                    isPrivate: isPrivate
                },
                {headers: {"Authorization": `Bearer ${token}`}});

            setSuccessfulAddRecipe('Recipe added');
        } catch (error: any) {
            console.log(error);
            if (error.response && error.response.status === 409) {
                setErrorAddRecipe(error.response.data);
            } else {
                setErrorAddRecipe('Something went wrong');
            }
        }
    };

    return(
        <form onSubmit={handleSubmit} className="mmRegisterForm">
            <h2>Recipe</h2>
            <input
                type="text"
                value={recipeName}
                onChange={e => setRecipeName(e.target.value)}
                placeholder="Name"
            />
            <input
                type="number"
                value={recipeTemperature}
                onChange={e => setRecipeTemperature(Number(e.target.value))}
                placeholder="Temperature"
            />
            <input
                type="text"
                value={recipeDuration}
                onChange={e => setRecipeDuration(Number(e.target.value))}
                placeholder="Duration in minutes"
            />
            <input
                type="text"
                value={recipeNote}
                onChange={e => setRecipeNote(e.target.value)}
                placeholder="Add note if needed"
            />
            <div>
                <input
                    type="checkbox"
                    id="isPrivateCheckbox"
                    checked={isPrivate}
                    onChange={handleIsPrivateChange}
                />
                <label htmlFor="isPrivateCheckbox" className="mmIsPrivateCheckbox">Is private</label>
            </div>
            <button type="submit">Add recipe</button>
            {errorAddRecipe && <p className="error">{errorAddRecipe}</p>}
            {successfulAddRecipe && <p className="success">{successfulAddRecipe}</p>}
        </form>
    );
};
export default MMAddRecipe;