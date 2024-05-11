const CONFIGURATION_ID = 'CONFIGURATION_ID'
const CONFIGURATION_NAME = 'CONFIGURATION_NAME'

export const getConfigurationName = () => {
    return localStorage.getItem(CONFIGURATION_NAME);
}

export const getConfigurationID = () => {
    const currentId = localStorage.getItem(CONFIGURATION_ID)
    if (!currentId){
        return null
    }
    
    return parseInt(currentId);
}

export const setConfigurationName = (name) => {
    localStorage.setItem(CONFIGURATION_NAME, name.toString());
}

export const setConfigurationID = (id) => {
    localStorage.setItem(CONFIGURATION_ID, id.toString());
}    