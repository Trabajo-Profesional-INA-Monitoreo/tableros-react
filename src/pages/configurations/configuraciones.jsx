import React from 'react';
import Box from '@mui/material/Box';
import { ConfigurationsList } from './ConfigurationsList/configurationList';

export const Configurations = () => {

    return (
        <Box>
            <h1> Configuraciones </h1>        
            <ConfigurationsList></ConfigurationsList>
        </Box>
    );
}