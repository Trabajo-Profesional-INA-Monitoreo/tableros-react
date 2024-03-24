import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { ConfigurationsList } from './ConfigurationsList/configurationList';
import { CreateConfigurations } from './createConfigurations/createConfigurations';

export const CONFIGURATION_VIEWS = {
    'LIST': 0,
    'CREATE': 1,
}

export const Configurations = () => {

    const [currentView, setCurrentView] = useState(CONFIGURATION_VIEWS.LIST)

    return (
        <Box>
            <h1> Configuraciones </h1>   
            {currentView === CONFIGURATION_VIEWS.LIST ? <ConfigurationsList setCurrentView={setCurrentView}/> : null}
            {currentView === CONFIGURATION_VIEWS.CREATE ? <CreateConfigurations setCurrentView={setCurrentView}/> : null}
        </Box>
    );
}