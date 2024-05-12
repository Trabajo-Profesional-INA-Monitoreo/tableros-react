import React, { useState, useEffect } from 'react';
import { InformativeCard, InformativeCardContainer } from '../../components/informativeCard/informativeCard';
import Line from '../../components/line/line';
import { Box, CircularProgress } from '@mui/material';
import { StationPresenter } from '../../presenters/stationPresenter';
import { getConfigurationID } from '../../utils/storage';
import { CurrentConfiguration } from '../../components/currentConfiguration/currentConfiguration';

export const Stations = () => {
    const presenter = new StationPresenter();
    
    const [stations, setStations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const getStations = async() => {
        const response = await presenter.getStations(getConfigurationID());
        setStations(response.Stations);
        setIsLoading(false);
    }

    useEffect(() => {
        getStations();
    }, []);

    return (    
        <Box>
            <h1>Estaciones</h1>
            <CurrentConfiguration/>
            <Line/>
            <InformativeCardContainer>
            {isLoading ?
                <CircularProgress 
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100vh',
                        margin: 'auto',
                        width: '10vw'
                    }}
                />
                :
                stations.map(station => 
                <InformativeCard 
                    title={station.StationName+' | '+station.StationId}
                    subtitle={station.StreamsCount + (Number(station.StreamsCount) > 1 ? ' series' : ' serie')}
                    heading1={'XXXXX'}
                    heading2={station.ErrorCount}
                    heading3={'XXXXX'}
                    subheading1={'Última actualización'}
                    subheading2={'Errores'}
                    subheading3={'Nivel'}
                />
            )}    
            </InformativeCardContainer>
        </Box>
    );
}