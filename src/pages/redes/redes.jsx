import React from 'react';
import { useEffect } from 'react';
import { Box } from '@mui/material';
import { InformativeCard, InformativeCardContainer } from '../../components/informativeCard/informativeCard';
import Line from '../../components/line/line';

export const Redes = () => {
    useEffect(() => {}, []);
    let loading = true;
    return (    
        loading ? 
        <Box>
            <h1>Redes</h1>
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