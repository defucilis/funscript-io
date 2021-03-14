import React, { useState, useContext, createContext, ReactNode } from "react";
import Handy from ".";

const handyContext = createContext<{ handy: Handy }>(null);

const useProvideHandy = () => {
    const [handy] = useState<Handy>(new Handy());
    return { handy };
};

const HandyProvider = ({ children }: { children: ReactNode }) => {
    const context = useProvideHandy();
    return <handyContext.Provider value={context}>{children}</handyContext.Provider>;
};

const useHandy = () => {
    return useContext(handyContext);
};

export { HandyProvider };
export default useHandy;
