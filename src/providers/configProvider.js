import React, {createContext, useState} from 'react';

export const ConfigurationContext = createContext();

function ConfigurationProvider(props){
    const [currentConfigID, setCurrentConfigID] = useState(null);
    const [currentConfigName, setCurrentConfigName] = useState("");
    
    const selectConfig = ( configId, configName ) => {
        setCurrentConfigID(configId);
        setCurrentConfigName(configName)
        console.log(currentConfigID, currentConfigName)

    };
    return (
        <div>  
            <ConfigurationContext.Provider value={{currentConfigID, selectConfig}}>
                {props.children}
            </ConfigurationContext.Provider>
        </div>
    )
};

export default(ConfigurationProvider);