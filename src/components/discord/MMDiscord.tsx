import React, {useState, useEffect} from "react";
import {getDiscordMembers, getRecipes} from "../api/MMApiServices";

export interface MMDiscordInterface {
    discordName: string,
    discordTime: number
}

const MMDiscord: React.FC = () => {

    const [items, setItems] = useState<MMDiscordInterface[]>([]);

    useEffect(() => {
        getDiscordMembers(setItems);
    }, []);

    function formatTime(ms: number) {
        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((ms % (1000 * 60)) / 1000);
        const remainingMilliseconds = Math.floor(ms % 1000);
        return `${hours}h ${minutes}m ${seconds}s ${remainingMilliseconds}ms`;
    }

    return (
        <div className="mmContainerWrapper">
            <h1 className="mmBodyHeader"> Discord Nerds </h1>
            <div className="mmContainer">
                <div className="mmRecipeContainerTop">
                    {items.map((item, idx) => (
                        <div key={idx} className="mmRecipeItems">
                            <div className="mmRecipeItem">{item.discordName}</div>
                            <div className="mmRecipeItem">{formatTime(item.discordTime)}</div>
                        </div>
                    ))}
                </div>
                <div className="mmContainerDown">
                </div>
            </div>
        </div>
    );
}

export default MMDiscord;