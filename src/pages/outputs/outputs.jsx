import React, {useEffect, useState, useCallback} from 'react';
import { Box } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Line from '../../components/line/line';
import { DatePicker } from '@mui/x-date-pickers';
import { TextField, Button, Typography} from '@mui/material';
import { CircularProgress } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import CircularProgressWithLabel from '../../components/circularProgressWithLabel/circularProgressWithLabel';
import dayjs from 'dayjs';
import { CurrentConfiguration } from '../../components/currentConfiguration/currentConfiguration';
import { ErrorModal, NoErrorModal } from './errorModal';
import { OutputsPresenter } from '../../presenters/outputsPresenter';

function dateParser(date){
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2, '0');
    return`${year}-${month}-${day}`;
}

const metricsBox = (title, subtitle) => {
    return (
        <Box sx={{height: 100, width: 200, border: '1.5px solid #E0E6ED', padding:1, alignContent:"center"}}>
            <Typography align='center' sx={{fontWeight:"bold"}}> {title} </Typography>
            <Typography align='center' variant='h5' sx={{mt: 2, fontWeight:"bold", color: (subtitle > 0? "#E53E3E" : "#38A169")}}> {subtitle} </Typography>
        </Box>
    )
}

export const Outputs = () => {
    const presenter = new OutputsPresenter()
    const [loading, setLoading] = useState(true);

    const currentDate = dayjs()
    const defaultDesdeDate = dayjs().subtract(7, 'day')

    const [desde, setDesde] = useState(defaultDesdeDate);
    const [hasta, setHasta] = useState(currentDate);

    const [graficoDesde, setGraficoDesde] = useState(defaultDesdeDate);
    const [graficohasta, setGraficoHasta] = useState(currentDate);

    const [openMetric, setOpenMetric] = useState(null);

    const [metrics, setMetrics] = useState(presenter.getInitialMetrics());
    const [erroresPorDias, setErroresPorDias] = useState({})

    const [nivelAlertaPorcentaje, setNivelAlertaPorcentaje] = useState(0)
    const [aguasBajasPorcentaje, setAguasBajasPorcentaje] = useState(0)
    const [evacuacionPorcentaje, setevacuacionPorcentaje] = useState(0)


    const cargarDataGrafico = () => {
        const dataGraficos = []
        if(erroresPorDias["NullValue"]){
            dataGraficos.push({data:erroresPorDias['NullValue'], label:'Valores Nulos', stack: 'total'})
        }
        if(erroresPorDias["ForecastMissing"]){
            dataGraficos.push({data:erroresPorDias['ForecastMissing'], label:'Falta de pronostico', stack: 'total'})
        }
        if(erroresPorDias["Missing4DaysHorizon"]){
            dataGraficos.push({data:erroresPorDias['Missing4DaysHorizon'], label:'Falta de horizonte a 4 dias', stack: 'total'})
        }
        if(erroresPorDias["ForecastOutOfBounds"]){
            dataGraficos.push({data:erroresPorDias['ForecastOutOfBounds'], label:'Fuera de rango', stack: 'total'})
        }
        if(erroresPorDias["ObservedOutlier"]){
            dataGraficos.push({data:erroresPorDias['ObservedOutlier'], label:'Outliers observados', stack: 'total'})
        }
        return dataGraficos
    }

    const loadIndicators = useCallback (async() =>{
        await presenter.getIndicators(metrics)
        setMetrics(metrics)
    },[])

    const loadBehavior = useCallback ( async ( params )=>{
        const behaviors = await presenter.getBehaviors(params)
        setNivelAlertaPorcentaje(behaviors["alertLevel"])
        setevacuacionPorcentaje(behaviors["evacuationLevel"])
        setAguasBajasPorcentaje(behaviors["lowWaterLevel"])
    },[])

    const fetchDataPorDia = async ( params ) => {
        let dataPorDia = await presenter.getErroresPorDia(params)
        const erroresAgrupados = presenter.groupErrors(dataPorDia, desde.toDate(), hasta.toDate());
        setErroresPorDias(erroresAgrupados);
    };
    async function aplicarFiltros(){
        const params = {
            ...(desde) && {timeStart: dateParser(desde.toDate())},
            ...(hasta) && {timeEnd: dateParser(hasta.toDate())},
        }
        const fetchDataFiltered = async () => {
            setLoading(true);
            await presenter.getFilteredIndicators(params, metrics)
            loadBehavior(params)
            fetchDataPorDia(params)
            setGraficoDesde(desde)
            setGraficoHasta(hasta)
            setLoading(false);
        }
        fetchDataFiltered();
    }

    useEffect(() => {
        loadIndicators()
        fetchDataPorDia();
        loadBehavior()
        setLoading(false);
    }, [loadIndicators, loadBehavior]);


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
                <Button variant="contained" onClick={aplicarFiltros} sx={{ marginInline:5}}>
                    Aplicar filtros
                </Button>
                <Button variant="contained" onClick={async ()=>{
                    setDesde(defaultDesdeDate)
                    setHasta(currentDate)
                    aplicarFiltros()
                }} sx={{marginInline:5}}>
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
            : <>

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
                        <CircularProgressWithLabel text="observaciones por debajo del nivel de alerta " percentage={nivelAlertaPorcentaje.toFixed(1)} color={nivelAlertaPorcentaje<30? "success": (nivelAlertaPorcentaje<60?"warning":"error")}/>
                        </Box>
                        <Box sx={{display:"flex", flexDirection: 'column', alignItems:"center"}}>

                        <h3>Nivel de evacuación</h3>
                        <CircularProgressWithLabel text="observaciones debajo del nivel de evacuacion" percentage={evacuacionPorcentaje.toFixed(1)} color={evacuacionPorcentaje<30? "success": (evacuacionPorcentaje<60?"warning":"error")}/>
                        </Box>
                        <Box sx={{display:"flex", flexDirection: 'column', alignItems:"center"}}>

                        <h3>Nivel de aguas bajas</h3>
                        <CircularProgressWithLabel text="observaciones supera el nivel de aguas bajas" percentage={aguasBajasPorcentaje.toFixed(1)} color={aguasBajasPorcentaje<30? "success": (aguasBajasPorcentaje<60?"warning":"error")}/>
                        </Box>
                    </Box>
            <Line/>
            </>}
        </>
    );
}
