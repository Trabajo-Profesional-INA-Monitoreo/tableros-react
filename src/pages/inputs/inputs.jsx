import React, {useState} from 'react';
import { Box, CircularProgress, Button, Tooltip} from '@mui/material';
import { useEffect } from 'react';
import { InputsPresenter } from '../../presenters/inputsPresenter';
import { CurrentConfiguration } from '../../components/currentConfiguration/currentConfiguration';
import Line from '../../components/line/line';
import CircularProgressWithLabel from '../../components/circularProgressWithLabel/circularProgressWithLabel';
import { getConfigurationID } from '../../utils/storage';
import dayjs from 'dayjs';

function dateParser(date){
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2, '0');
    return`${year}-${month}-${day}`;
}

export const Inputs = () => {

    const presenter = new InputsPresenter();
    
    const [isLoading, setIsLoading] = useState(true);
    const [nulos, setNulos] = useState({});
    const currentDate = dayjs()
    const defaultDesdeDate = dayjs().subtract(7, 'day')

    const [desde, setDesde] = useState(defaultDesdeDate);
    const [hasta, setHasta] = useState(currentDate);
    const [metrics, setMetrics] = useState({})

    const getSerieMetadataAndValues = async () => {
        const confID = getConfigurationID()
        const params = {
            configurationId: confID,
            ...(desde) && {timeStart: dateParser(desde.toDate())},
            ...(hasta) && {timeEnd: dateParser(hasta.toDate())},
        }
        let nulls = await presenter.getNulosEnSeries(params);
        setNulos(nulls);

        const metricsRes = await presenter.getMetricas(confID)
        setMetrics(metricsRes)
        setIsLoading(false);
    }
    useEffect( () => {
        getSerieMetadataAndValues()
    }, []);

    return (    
        
        <div>
            <h1> Tablero de inputs </h1>
            <CurrentConfiguration/>
            <Line/>
            <h2> Metricas </h2>
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
                : <>
                    <Box sx={{ display:"flex", flexDirection: 'row', justifyContent:"space-around", alignContent:"center", alignItems:"center", marginBottom:"5%"}}>
                        <Box sx={{display:"flex", flexDirection: 'column', alignItems:"center"}}>
                            <h3>Actualizaciones</h3>
                            <CircularProgressWithLabel text="series no tuvieron retrasos" percentage={90} color="success"/>
                        </Box>
                        <Box sx={{display:"flex", flexDirection: 'column', alignItems:"center"}}>
                            <h3>Datos Nulos</h3>
                            <CircularProgressWithLabel text="series no tuvieron datos nulos" percentage={(nulos.TotalStreamsWithNull/nulos.TotalStreams).toFixed(1)} color="warning"/>
                        </Box>
                    </Box>
            <Line/>
            
            <h2> Informacion General </h2>
            <box style={{display:"flex", justifyContent: "space-around", margin: "5%" }}>
                <Button variant="contained" size="large">{metrics["TotalStreams"] + " Series"}</Button>
                <Button variant="contained" size="large" >{metrics["TotalStations"] + " Estaciones"}</Button>
            </box>
        </>
        }
        </div>
        )
}