import React, { useState, useEffect } from 'react';
import { InformativeCard, InformativeCardContainer } from '../../components/informativeCard/informativeCard';
import Line from '../../components/line/line';
import { Box } from '@mui/material';
import { StationPresenter } from '../../presenters/stationPresenter';

export const Stations = () => {
    
    const presenter = new StationPresenter;
    
    const [stations, setStations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const configurationId = localStorage.getItem("configId");
    
    const getStations = async() => {
        const response = await presenter.getStations(configurationId);
        setStations(response.Stations);
        setIsLoading(false);
    }

    useEffect(() => {
        getStations();
    }, []);

    return (    
        <Box>
            <h1>Estaciones</h1>
            <Line/>
            <InformativeCardContainer>
            {isLoading ? null : stations.map(station => 
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