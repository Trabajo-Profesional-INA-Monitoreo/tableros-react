import React, {useEffect, useState, useCallback, useMemo} from 'react';
import { Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { TextField, Button, Typography} from '@mui/material';
import { CircularProgress } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { CurrentConfiguration } from '../../components/currentConfiguration/currentConfiguration';
import { ErrorModal, NoErrorModal } from './errorModal';
import { OutputsPresenter } from '../../presenters/outputsPresenter';
import { notifyError } from '../../utils/notification';
import { ListModal } from '../../components/listModal/listModal';
import NoConectionSplash from '../../components/noConection/noConection';
import CircularProgressWithLabel from '../../components/circularProgressWithLabel/circularProgressWithLabel';
import Grid from '@mui/material/Unstable_Grid2';
import Line from '../../components/line/line';
import dayjs from 'dayjs';

function dateParser(date){
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2, '0');
    return`${year}-${month}-${day}`;
}

export const Outputs = () => {
    const presenter = useMemo(() => new OutputsPresenter(), [])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false)

    const currentDate = dayjs()
    const defaultDesdeDate = dayjs().subtract(7, 'day')

    const [desde, setDesde] = useState(defaultDesdeDate);
    const [hasta, setHasta] = useState(currentDate);
    const [_desde, _setDesde] = useState(defaultDesdeDate);
    const [_hasta, _setHasta] = useState(currentDate);

    const [graficoDesde, setGraficoDesde] = useState(defaultDesdeDate);
    const [graficohasta, setGraficoHasta] = useState(currentDate);

    const [openMetric, setOpenMetric] = useState(null);

    const [metrics, setMetrics] = useState(presenter.getInitialMetrics());
    const [erroresPorDias, setErroresPorDias] = useState({})

    const [nivelAlertaPorcentaje, setNivelAlertaPorcentaje] = useState(0)
    const [aguasBajasPorcentaje, setAguasBajasPorcentaje] = useState(0)
    const [evacuacionPorcentaje, setevacuacionPorcentaje] = useState(0)

    const [streamLevels, setStreamLevels] = useState([]);

    const [openLowLevelModal, setOpenLowLevelModal] = useState(false);
    const [openAlertModal, setOpenAlertModal] = useState(false);
    const [openEvacuationModal, setOpenEvacuationModal] = useState(false);

    const cargarDataGrafico = () => {
        const dataGraficos = []
        if(erroresPorDias["NullValue"]){
            dataGraficos.push({data:erroresPorDias['NullValue'], label:'Valores Nulos', stack: 'total'})
        }
        if(erroresPorDias["ForecastMissing"]){
            dataGraficos.push({data:erroresPorDias['ForecastMissing'], label:'Falta de pronostico', stack: 'total'})
        }
        if(erroresPorDias["Missing4DaysHorizon"]){
            dataGraficos.push({data:erroresPorDias['Missing4DaysHorizon'], label:'Falta de horizonte', stack: 'total'})
        }
        if(erroresPorDias["ForecastOutOfBounds"]){
            dataGraficos.push({data:erroresPorDias['ForecastOutOfBounds'], label:'Fuera de rango', stack: 'total'})
        }
        if(erroresPorDias["ObservedOutlier"]){
            dataGraficos.push({data:erroresPorDias['ObservedOutlier'], label:'Outliers observados', stack: 'total'})
        }
        return dataGraficos
    }

    const loadIndicators = useCallback(async() => {
        try{
            await presenter.getFilteredIndicators(metrics)
        } catch(error) {
            notifyError(error)
            setError(true)
        }
        setMetrics(metrics)
    },[metrics, presenter])

    const loadBehavior = useCallback(async(params) => {
        try{
            const behaviors = await presenter.getBehaviors(params)
            console.log(behaviors)
            setNivelAlertaPorcentaje(behaviors["alertLevel"])
            setevacuacionPorcentaje(behaviors["evacuationLevel"])
            setAguasBajasPorcentaje(behaviors["lowWaterLevel"])
            setStreamLevels(behaviors["streamLevels"])
        } catch(error) {
            notifyError(error)
            setError(true)
        } finally {
            setLoading(false);
        }
    }, [presenter])

    const fetchDataPorDia = useCallback(async(params, fetchDesde, fetchHasta) => {
        try{
            let dataPorDia = await presenter.getErroresPorDia(params)
            let erroresAgrupados;
            if(fetchDesde && fetchHasta){   
                erroresAgrupados = presenter.groupErrors(dataPorDia, fetchDesde.toDate(), fetchHasta.toDate());
            } else {
                erroresAgrupados = presenter.groupErrors(dataPorDia, desde.toDate(), hasta.toDate());
            }
            setErroresPorDias(erroresAgrupados);
        } catch(error) {
            notifyError(error)
            setError(true)
        }
    }, [presenter]);

    async function borrarFiltros(){
        setDesde(defaultDesdeDate)
        setHasta(currentDate)
        setGraficoDesde(defaultDesdeDate)
        setGraficoHasta(currentDate)
        loadIndicators()
        fetchDataPorDia();
        loadBehavior()
        _setDesde(defaultDesdeDate)
        _setHasta(currentDate)
    }

    async function aplicarFiltros(){
        const params = {
            ...(_desde) && {timeStart: dateParser(_desde.toDate())},
            ...(_hasta) && {timeEnd: dateParser(_hasta.toDate())},
        }
        const fetchDataFiltered = async () => {
            setLoading(true);
            try{
                await presenter.getFilteredIndicators(metrics, params)
                loadBehavior(params)
                fetchDataPorDia(params, _desde, _hasta)
            } catch(error) {
                notifyError(error)
                setError(true)
            }
                setDesde(_desde)
                setHasta(_hasta)
                setGraficoDesde(_desde)
                setGraficoHasta(_hasta)
            setLoading(false);
        }
        fetchDataFiltered();
    }

    useEffect(() => {
        loadIndicators()
        fetchDataPorDia();
        loadBehavior()
    }, []);


    return (    
        <>
        <Box>
            <h1>Tablero de errores</h1>
            <CurrentConfiguration/>
            <Line/>
            <Grid items sx={{display:"flex", alignItems:"center"}}>
                    <DatePicker 
                        id="Desde"
                        label="Desde"
                        inputFormat="YYYY/MM/DD"
                        value={_desde}
                        onChange = {(event) => _setDesde(event)}
                        renderInput={(params) => <TextField {...params} />}
                        maxDate={_hasta}
                        sx={{ m: 1, maxWidth: 200, marginInline: 2, marginTop:2}}
                        />
                    <DatePicker 
                        id="hasta"
                        label="Hasta"
                        inputFormat="YYYY/MM/DD"
                        value={_hasta}
                        onChange = {(event) => _setHasta(event)}
                        renderInput={(params) => <TextField {...params} />}
                        maxDate={dayjs()}
                        sx={{ m: 1, maxWidth: 200, marginInline: 2, marginTop:2}}
                    />
                <Button variant="contained" onClick={aplicarFiltros} sx={{ marginInline:5}}>
                    Aplicar filtros
                </Button>
                <Button variant="contained" onClick={borrarFiltros} sx={{marginInline:5}}>
                    Borrar filtros
                </Button>
            </Grid>
        </Box>
        {loading ? 
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
            :(error? <NoConectionSplash/> : 
            <>
                <div style={{padding: 10, marginTop:5}}>
                    <Box className='row space-around wrap'>
                        {metrics.map(metric => 
                            <Box style={{cursor:'pointer'}} onClick={() => {console.log('m: ', metric); setOpenMetric(metric.id)}}>
                                {metricsBox(metric.name, metric.value, true)}
                            </Box>
                        )}
                    </Box>
                </div>
                {metrics.map(metric => 
                    <ErrorModal
                        open={metric.id === openMetric && metric.id !== -1} 
                        onClose={() => setOpenMetric(null)}
                        errorType={metric.id}>
                    </ErrorModal>)}
                    <NoErrorModal
                        open={openMetric === -1} 
                        onClose={() => setOpenMetric(null)}>
                    </NoErrorModal>
                {Object.keys(erroresPorDias).length > 0 &&
                    <div style={{ display:"flex", justifyContent: "center", margin: "5%"}}>
                        <BarChart
                        width={800}
                        height={400}
                        xAxis={[{ scaleType: 'band', data: presenter.calcularDias(graficoDesde.toDate(),graficohasta.toDate()) }]}
                        series={cargarDataGrafico()}
                        />
                    </div>
                }
                
                <Line/>
                    <h2> Monitoreo de comportamiento</h2>
                    <Box sx={{ display:"flex", flexDirection: 'row', justifyContent:"space-around", alignContent:"center", alignItems:"center", marginBottom:"5%"}}>
                        
                        <Box sx={{display:"flex", flexDirection: 'column', alignItems:"center"}}>
                            <h3>Nivel de alerta</h3>
                            <Box borderRadius={5} padding={5} onClick={() => setOpenAlertModal(true)} className="clickable">
                                <CircularProgressWithLabel text="observaciones superan el nivel de alerta " percentage={nivelAlertaPorcentaje.toFixed(1)} color={nivelAlertaPorcentaje<30? "success": (nivelAlertaPorcentaje<60?"warning":"error")}/>
                            </Box>
                        </Box>
                        <ListModal
                            title={'Series con datos sobre el nivel de alerta'}
                            open={openAlertModal} 
                            onClose={() => setOpenAlertModal(false)}
                            list={streamLevels.filter(x => x.Level === "Alerta").map(x => x.StreamId)}>
                        </ListModal>

                        <Box sx={{display:"flex", flexDirection: 'column', alignItems:"center"}}>
                            <h3>Nivel de evacuación</h3>
                            <Box borderRadius={5} padding={5} onClick={() => setOpenEvacuationModal(true)} className="clickable">
                                <CircularProgressWithLabel text="observaciones superan el nivel de evacuacion" percentage={evacuacionPorcentaje.toFixed(1)} color={evacuacionPorcentaje<30? "success": (evacuacionPorcentaje<60?"warning":"error")}/>
                            </Box>
                        </Box>
                        <ListModal
                            title={'Series con datos sobre el nivel de evacuación'}
                            open={openEvacuationModal} 
                            onClose={() => setOpenEvacuationModal(false)}
                            list={streamLevels.filter(x => x.Level === "Evacuación").map(x => x.StreamId)}>
                        </ListModal>

                        <Box sx={{display:"flex", flexDirection: 'column', alignItems:"center"}}>
                            <h3>Nivel de aguas bajas</h3>
                            <Box borderRadius={5} padding={5} onClick={() => setOpenLowLevelModal(true)} className="clickable">
                                <CircularProgressWithLabel text="observaciones por debajo del nivel de aguas bajas" percentage={aguasBajasPorcentaje.toFixed(1)} color={aguasBajasPorcentaje<30? "success": (aguasBajasPorcentaje<60?"warning":"error")}/>
                            </Box>
                        </Box>
                        <ListModal
                            title={'Series con datos debajo del nivel de aguas bajas'}
                            open={openLowLevelModal}
                            onClose={() => setOpenLowLevelModal(false)}
                            list={streamLevels.filter(x => x.Level === "Aguas Bajas").map(x => x.StreamId)}>
                        </ListModal>
                    </Box>
            <Line/>
            </>)}
        </>
    );
}

const metricsBox = (title, subtitle) => {
    return (
        <Box sx={{height: 110, width: 200, border: '1.5px solid #E0E6ED', padding:1, justifyContent:"center",alignContent:"center"}}>
            <Typography align='center' sx={{fontWeight:"bold"}}> {title} </Typography>
            <Typography align='center' variant='h5' sx={{mt:1, fontWeight:"bold", color: (subtitle > 0? "#E53E3E" : "#38A169")}}> {subtitle} </Typography>
        </Box>
    )
}