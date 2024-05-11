import React, {createContext, useState} from 'react';
import { getConfigurationID, getConfigurationName } from '../utils/storage';

export const ConfigurationContext = createContext();

function ConfigurationProvider(props){
    const [currentConfigID, setCurrentConfigID] = useState(getConfigurationID());
    const [currentConfigName, setCurrentConfigName] = useState(getConfigurationName());
    
    const selectConfig = ( configId, configName ) => {
        setCurrentConfigID(configId)
        setCurrentConfigName(configName)
        console.log(currentConfigID, currentConfigName)

    };
    return (
        <div>  
            <ConfigurationContext.Provider value={{currentConfigID, currentConfigName, selectConfig}}>
                {props.children}
            </ConfigurationContext.Provider>
        </div>
    )
};

export default(ConfigurationProvider);