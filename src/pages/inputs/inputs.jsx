import React, {useState} from 'react';
import { Box, CircularProgress, Button, Grid, TextField} from '@mui/material';
import { useEffect } from 'react';
import { InputsPresenter } from '../../presenters/inputsPresenter';
import { CurrentConfiguration } from '../../components/currentConfiguration/currentConfiguration';
import Line from '../../components/line/line';
import CircularProgressWithLabel from '../../components/circularProgressWithLabel/circularProgressWithLabel';
import { getConfigurationID } from '../../utils/storage';
import dayjs from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';

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
    const [outliers, setOutliers] = useState({});

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
        nulls.percentage= (nulls.TotalStreamsWithNull*100)/nulls.TotalStreams 
        setNulos(nulls);
        const outliersData = await presenter.getOutliers(params)
        outliersData.percentage = (outliersData.TotalStreamsWithObservedOutlier *100)/outliersData.TotalStreams
        setOutliers(outliersData)
        const metricsRes = await presenter.getMetricas(confID)
        setMetrics(metricsRes)
        setIsLoading(false);
    }
    useEffect( () => {
        getSerieMetadataAndValues()
    }, []);

    return (    
        
        <div>
            <h1> Descripción general </h1>
            <CurrentConfiguration/>
            <Line/>
            <h2> Metricas </h2>
            <Grid items sx={{display:"flex", alignItems:"center", marginBottom:5}}>
                    <DatePicker 
                        id="Desde"
                        label="Desde"
                        inputFormat="YYYY/MM/DD"
                        value={desde}
                        onChange = {(event) => setDesde(event)}
                        renderInput={(params) => <TextField {...params} />}
                        maxDate={dayjs()}
                        sx={{ m: 1, maxWidth: 200, marginInline: 2, marginTop:2}}
                        />
                    <DatePicker 
                        id="hasta"
                        label="Hasta"
                        inputFormat="YYYY/MM/DD"
                        value={hasta}
                        onChange = {(event) => setHasta(event)}
                        renderInput={(params) => <TextField {...params} />}
                        maxDate={dayjs()}
                        sx={{ m: 1, maxWidth: 200, marginInline: 2, marginTop:2}}
                    />
                <Button variant="contained" onClick={getSerieMetadataAndValues} sx={{ marginInline:5}}>
                    Aplicar filtros
                </Button>
            </Grid>
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
                            <CircularProgressWithLabel text="series no tuvieron datos nulos" percentage={nulos.percentage.toFixed(1)} color={nulos.percentage<30? "success": (nulos.percentage<60?"warning":"error")}/>
                        </Box>
                        <Box sx={{display:"flex", flexDirection: 'column', alignItems:"center"}}>
                            <h3>Datos fuera de umbrales</h3>
                            <CircularProgressWithLabel text="series con outliers" percentage={outliers.percentage.toFixed(1)} color={outliers.percentage<30? "success": (outliers.percentage<60?"warning":"error")}/>
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