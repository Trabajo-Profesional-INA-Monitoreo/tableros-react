import React from 'react';
import { useEffect } from 'react';
import { Box } from '@mui/material';
import { InformativeCard, InformativeCardContainer } from '../../components/informativeCard/informativeCard';
import Line from '../../components/line/line';
import { CurrentConfiguration } from '../../components/currentConfiguration/currentConfiguration';

export const Nodes = () => {
    useEffect(() => {}, []);
    let loading = true;
    return (    
        loading ? 
        <Box>
            <h1>Nodos</h1>
            <CurrentConfiguration/>
            <Line/>
            <InformativeCardContainer>
                <InformativeCard 
                    title={'Red Hidrológica Nacional'}
                    subtitle={'3 Series'}
                    heading1={'14-11-2023\n12:00 hs'}
                    heading2={'3'}
                    heading3={'Normal'}
                    subheading1={'Última actualización'}
                    subheading2={'Errores'}
                    subheading3={'Nivel'}
                />
                <InformativeCard 
                    title={'Red Hidrológica Nacional'}
                    subtitle={'3 Series'}
                    heading1={'14-11-2023\n12:00 hs'}
                    heading2={'3'}
                    heading3={'Normal'}
                    subheading1={'Última actualización'}
                    subheading2={'Errores'}
                    subheading3={'Nivel'}
                />
            </InformativeCardContainer>
        </Box>
        : null
    );
}