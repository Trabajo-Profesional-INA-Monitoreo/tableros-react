import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { ConfigurationsList } from './ConfigurationsList/configurationList';
import { CreateConfigurations } from './createConfigurations/createConfigurations';

export const CONFIGURATION_VIEWS = {
    'LIST': 0,
    'CREATE': 1,
    'VIEW': 2,
    'EDIT': 3
}

export const Configurations = () => {

    const [currentView, setCurrentView] = useState(CONFIGURATION_VIEWS.LIST);
    const [selectedConfigurationID, setSelectedConfigurationID] = useState();

    return (
        <Box>
            <h1> Configuraciones </h1>   
            {currentView === CONFIGURATION_VIEWS.LIST ? <ConfigurationsList setCurrentView={setCurrentView} setSelectedConfigurationID={setSelectedConfigurationID}/> : null}
            {currentView === CONFIGURATION_VIEWS.CREATE ? <CreateConfigurations setCurrentView={setCurrentView} editable={true}/> : null}
            {currentView === CONFIGURATION_VIEWS.VIEW ? <CreateConfigurations setCurrentView={setCurrentView} configurationID={selectedConfigurationID} editable={false}/> : null}
            {currentView === CONFIGURATION_VIEWS.EDIT ? <CreateConfigurations setCurrentView={setCurrentView} configurationID={selectedConfigurationID} editable={true}/> : null}
        </Box>
    );
}