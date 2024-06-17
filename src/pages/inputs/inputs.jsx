import React, {useState, useCallback, useMemo} from 'react';
import { Box, CircularProgress, Button, Grid, TextField } from '@mui/material';
import { useEffect } from 'react';
import { InputsPresenter } from '../../presenters/inputsPresenter';
import { CurrentConfiguration } from '../../components/currentConfiguration/currentConfiguration';
import { getConfigurationID } from '../../utils/storage';
import { DatePicker } from '@mui/x-date-pickers';
import { useNavigate } from "react-router-dom";
import { notifyError } from '../../utils/notification';
import { ListModal } from './listModal/listModal';
import Line from '../../components/line/line';
import NoConectionSplash from '../../components/noConection/noConection';
import CircularProgressWithLabel from '../../components/circularProgressWithLabel/circularProgressWithLabel';
import dayjs from 'dayjs';
import './styles.css';

function dateParser(date){
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2, '0');
    return`${year}-${month}-${day}`;
}

export const Inputs = () => {
    const presenter = useMemo(() => new InputsPresenter(), []);
    const [error, setError] = useState(false)

    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true);
    const [retardos, setRetardos] = useState({})
    const [nulos, setNulos] = useState({});
    const [outliers, setOutliers] = useState({});

    const currentDate = dayjs()
    const defaultDesdeDate = dayjs().subtract(7, 'day')

    const [desde, setDesde] = useState(defaultDesdeDate);
    const [hasta, setHasta] = useState(currentDate);
    const [metrics, setMetrics] = useState({});

    const [openDelaysModal, setOpenDelaysModal] = useState(false);
    const [seriesWithDelays, setSeriesWithDelays] = useState([]);

    const [openNullsModal, setOpenNullsModal] = useState(false);
    const [seriesWithNulls, setSeriesWithNulls] = useState([]);

    const [openThresholdModal, setOpenThresholdModal] = useState(false);
    const [seriesOutOfThresholds, setSeriesOutOfThresholds] = useState([]);

    const getSerieMetadataAndValues = useCallback(async() => {
        const confID = getConfigurationID()
        const params = {
            configurationId: confID,
            ...(desde) && {timeStart: dateParser(desde.toDate())},
            ...(hasta) && {timeEnd: dateParser(hasta.toDate())},
        }
        try{
            let retardados = await presenter.getRetardados(params);
            let nulls = await presenter.getNulosEnSeries(params);
            const outliersData = await presenter.getOutliers(params)
            const metricsRes = await presenter.getMetricas(confID)
            retardados.percentage= (retardados.TotalStreamsWithDelay*100)/retardados.TotalStreams 
            setRetardos(retardados)
            setSeriesWithDelays(retardados.Streams);
            setSeriesWithNulls(nulls.Streams);
            setSeriesOutOfThresholds(outliersData.Streams);
            nulls.percentage = (nulls.TotalStreamsWithNull*100)/nulls.TotalStreams 
            setNulos(nulls);
            outliersData.percentage = (outliersData.TotalStreamsWithObservedOutlier *100)/outliersData.TotalStreams
            setOutliers(outliersData)
            setMetrics(metricsRes)
        } catch(error){
            notifyError(error)
            setError(true)
        } finally{
            setIsLoading(false);

        }        
    }, [desde, hasta, presenter]) 

    useEffect( () => {
        getSerieMetadataAndValues()
    }, [getSerieMetadataAndValues]);

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
                : (error? <NoConectionSplash/> : <>
                    <Box sx={{ display:"flex", flexDirection: 'row', justifyContent:"space-around", alignContent:"center", alignItems:"center", marginBottom:"5%"}}>
                        <Box sx={{display:"flex", flexDirection: 'column', alignItems:"center"}}>
                            <h3>Actualizaciones</h3>
                            <Box borderRadius={5} padding={5} onClick={() => setOpenDelaysModal(true)} className="clickable">
                                <CircularProgressWithLabel text="series tuvieron retrasos" percentage={retardos?.percentage?.toFixed(1)} color={retardos.percentage<30? "success": (retardos.percentage<60?"warning":"error")}/>
                            </Box>
                        </Box>
                        <ListModal
                            title={'Series con retrasos'}
                            open={openDelaysModal} 
                            onClose={() => setOpenDelaysModal(false)}
                            list={seriesWithDelays}>
                        </ListModal>
                        <Box sx={{display:"flex", flexDirection: 'column', alignItems:"center"}}>
                            <h3>Datos Nulos</h3>
                            <Box borderRadius={5} padding={5} onClick={() => setOpenNullsModal(true)} className="clickable">
                                <CircularProgressWithLabel text="series no tuvieron datos nulos" percentage={nulos?.percentage?.toFixed(1)} color={nulos.percentage<30? "success": (nulos.percentage<60?"warning":"error")}/>
                            </Box>
                        </Box>
                        <ListModal
                            title={'Series con datos nulos'}
                            open={openNullsModal} 
                            onClose={() => setOpenNullsModal(false)}
                            list={seriesWithNulls}>
                        </ListModal>
                        <Box sx={{display:"flex", flexDirection: 'column', alignItems:"center"}}>
                            <h3>Datos fuera de umbrales</h3>
                            <Box borderRadius={5} padding={5} onClick={() => setOpenThresholdModal(true)} className="clickable">
                                <CircularProgressWithLabel text="series fuera de umbrales" percentage={outliers?.percentage?.toFixed(1)} color={outliers.percentage<30? "success": (outliers.percentage<60?"warning":"error")}/>
                            </Box>
                        </Box>
                        <ListModal
                            title={'Series con datos fuera de umbrales'}
                            open={openThresholdModal} 
                            onClose={() => setOpenThresholdModal(false)}
                            list={seriesOutOfThresholds}>
                        </ListModal>
                    </Box>
            <Line/>
            
            <h2> Informacion General </h2>
            <box style={{display:"flex", justifyContent: "space-around", margin: "5%" }}>
                <Button
                    variant="contained"
                    size="large"
                    onClick={()=>presenter.onClickStreams(navigate)}
                >
                    {metrics["TotalStreams"] + " Series"}
                </Button>
                <Button
                    variant="contained"
                    size="large"
                    onClick={()=>presenter.onClickStations(navigate)}
                >
                    {metrics["TotalStations"] + " Estaciones"}
                </Button>
            </box>
        </>)
        }
        </div>
        )
}