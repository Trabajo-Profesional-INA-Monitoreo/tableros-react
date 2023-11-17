import React from 'react';
import { useEffect } from 'react';
import { Box } from '@mui/material';
import InformativeCard from '../../components/informativeCard/informativeCard';
import Line from '../../components/line/line';

export const Estaciones = () => {
    useEffect(() => {}, []);
    let loading = true;
    return (    
        loading ? 
        <Box>
            <h1>Estaciones</h1>
            <Line/>
            <InformativeCard 
                title={'San Fernando'}
                subtitle={'3 Series'}
                heading1={'14-11-2023\n12:00 hs'}
                heading2={'3'}
                heading3={'Normal'}
                subheading1={'Última actualización'}
                subheading2={'Errores'}
                subheading3={'Nivel'}
            />
        </Box>
        : null
    );
}