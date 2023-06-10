import React, { createContext, useContext } from 'react';

interface BackgroundContextValue {
    backGroundZIndex: number;
    setBackGroundZIndex: React.Dispatch<React.SetStateAction<number>>;
    colorFractal: number[];
    setColorFractal: React.Dispatch<React.SetStateAction<number[]>>;
    colorBackground: number[];
    setColorBackground: React.Dispatch<React.SetStateAction<number[]>>;
    positionFractal: number[];
    setPositionFractal: React.Dispatch<React.SetStateAction<number[]>>;
    zoomFractal: number;
    setZoomFractal: React.Dispatch<React.SetStateAction<number>>;
    resetLoginRegisterValue: boolean;
    setResetLoginRegisterValue: React.Dispatch<React.SetStateAction<boolean>>;
    userNameProfile: string;
    setUserNameProfile: React.Dispatch<React.SetStateAction<string>>;
    profilePicture: string;
    setProfilePicture: React.Dispatch<React.SetStateAction<string>>;
    isUserLoggedIn: boolean;
    setIsUserLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
    userLoggingOut: boolean;
    setUserLoggingOut: React.Dispatch<React.SetStateAction<boolean>>;
}

export const BackGroundContext = createContext<BackgroundContextValue>({} as BackgroundContextValue);