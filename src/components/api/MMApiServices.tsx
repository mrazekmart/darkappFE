import axios from 'axios';
import {Recipe} from "../recipes/MMRecipe";
import {MMDiscordInterface} from "../discord/MMDiscord";

export const getUserProfileSettings = async (
    setColorFractal: (color: number[]) => void,
    setColorBackground: (color: number[]) => void,
    setPositionFractal: (position: number[]) => void,
    setZoomFractal: (zoom: number) => void,
    setProfilePicture: (imageDataUrl: string) => void
) => {
    const token = localStorage.getItem('jwt');
    try {
        const response = await axios.get(`/api/user/getUserProfileSettings`, {headers: {"Authorization": `Bearer ${token}`}});
        if (response.data) {
            setColorFractal(response.data.mmFractalInfo.colorFractal);
            setColorBackground(response.data.mmFractalInfo.colorBackground);
            setPositionFractal(response.data.mmFractalInfo.positionFractal);
            setZoomFractal(response.data.mmFractalInfo.zoomFractal);
            if (response.data.userProfilePicture) {
                const imageDataUrl = `data:image/png;base64,${response.data.userProfilePicture}`;
                setProfilePicture(imageDataUrl);
            }
        }
    } catch (error) {
        console.log(error);
    }
};

export const getRecipes = async (
    setItems: (item: Recipe[]) => void
) => {
    //const token = localStorage.getItem('jwt');
    try {
        const response = await axios.get(`/api/recipes`);
        if (response.data) {
            let recipes: Recipe[] = [];
            response.data.forEach(function (item: any) {
                let recipe: Recipe = {
                    recipeName: item.recipeName,
                    recipeTemperature: item.recipeTemperature,
                    recipeDuration: item.recipeDuration,
                    recipeNote: item.recipeNote,
                    id: item.id
                }
                recipes.push(recipe);
            });
            setItems(recipes);
        }
    } catch (error) {
        console.log(error);
    }
};


export const deleteRecipe = async (itemId: number) => {
    const token = localStorage.getItem('jwt');
    try {
        await axios.delete(`/api/recipes/${itemId}`, {headers: {"Authorization": `Bearer ${token}`}});
    } catch (error: any) {
        console.log(error);
        alert(`Error: ${error.response.data}`);
    }
};

export const getDiscordMembers = async (
    setItems: (item: MMDiscordInterface[]) => void
) => {
    //const token = localStorage.getItem('jwt');
    try {
        const response = await axios.get(`/api/discord`);
        if (response.data) {
            let mmDiscords: MMDiscordInterface[] = [];
            response.data.forEach(function (item: any) {
                let discordMember: MMDiscordInterface = {
                    discordName: item.discordName,
                    discordTime: item.discordTime
                }
                mmDiscords.push(discordMember);
            });
            setItems(mmDiscords);
        }
    } catch (error) {
        console.log(error);
    }
};
