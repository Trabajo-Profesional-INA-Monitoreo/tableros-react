const CONFIGURATION_ID = 'CONFIGURATION_ID'
const CONFIGURATION_NAME = 'CONFIGURATION_NAME'

export const getConfigurationName = () => {
    return localStorage.getItem(CONFIGURATION_NAME);
}

export const getConfigurationID = () => {
    return parseInt(localStorage.getItem(CONFIGURATION_ID));
}

export const setConfigurationName = (name) => {
    localStorage.setItem(CONFIGURATION_NAME, name.toString());
}

export const setConfigurationID = (id) => {
    localStorage.setItem(CONFIGURATION_ID, id.toString());
}    