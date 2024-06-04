import React, { useState, useEffect } from 'react';
import { InformativeCard, InformativeCardContainer } from '../../components/informativeCard/informativeCard';
import Line from '../../components/line/line';
import { Box } from '@mui/material';
import CircularProgressLoading from '../../components/circularProgressLoading/circularProgressLoading'
import { StationPresenter } from '../../presenters/stationPresenter';
import { getConfigurationID } from '../../utils/storage';
import { CurrentConfiguration } from '../../components/currentConfiguration/currentConfiguration';
import PaginationComponent from '../../components/pagination/paginationComponent';
import { notifyError } from '../../utils/notification';
import NoConectionSplash from '../../components/noConection/noConection';

function formatDate(isoDate) {
    const date = new Date(isoDate);
    const offset = -3 * 60 * 60 * 1000; // GMT-3 offset in milliseconds
    const gmt3Date = new Date(date.getTime() + offset);
    const day = gmt3Date.getDate().toString().padStart(2, '0');
    const month = (gmt3Date.getMonth() + 1).toString().padStart(2, '0');
    const year = gmt3Date.getFullYear();
    const hours = gmt3Date.getHours().toString().padStart(2, '0');
    const minutes = gmt3Date.getMinutes().toString().padStart(2, '0');
    const seconds = gmt3Date.getSeconds().toString().padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

export const Stations = () => {
    const presenter = new StationPresenter();
    const [error, setError] = useState(false)

    const [stations, setStations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const getStations = async() => {
        try{
            const response = await presenter.getStations(page);
            setStations(response.Stations);
            setTotalPages(response.Pageable.Pages);
        } catch(error) {
            notifyError(error)
            setError(true)
        }
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
            {isLoading ? <CircularProgressLoading/>
            :(error? <NoConectionSplash/> : 
                stations.map(station => 
                <InformativeCard 
                    title={station.StationName+' | '+station.StationId}
                    subtitle={`${station.StreamsCount + (Number(station.StreamsCount) > 1 ? ' series' : ' serie')} ${station.MainStreamId ? (' | Serie principal: ' + station.MainStreamId) :"" }`}
                    heading1={station.LastUpdate && formatDate(station.LastUpdate)}
                    heading2={station.ErrorCount}
                    heading3={station.TotalWaterLevels>0? (station.AlertWaterLevels / station.TotalWaterLevels)*100 : 0}
                    subheading1={'Última actualización'}
                    subheading2={'Errores'}
                    subheading3={'Nivel'}
                    id={station.StationId}
                />
                
            ))}    
            </InformativeCardContainer>
            <PaginationComponent totalPages={totalPages} func={ presenter.getStations} params={null} setterData={setStations} isStation={true} setLoading={setIsLoading}/>
        </Box>
    );
}