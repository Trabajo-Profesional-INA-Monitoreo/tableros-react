import React from 'react';
import Box from '@mui/material/Box';
import { CreateConfigurations } from './createConfigurations/createConfigurations';

export const Configurations = () => {

    return (
        <Box>
            <h1> Configuraciones </h1>            
            <CreateConfigurations></CreateConfigurations>
        </Box>
    );
}