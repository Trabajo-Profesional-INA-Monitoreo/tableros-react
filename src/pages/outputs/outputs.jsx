import React, {useEffect, useState, useCallback} from 'react';
import { Box } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Line from '../../components/line/line';

import { DatePicker } from '@mui/x-date-pickers';

import { TextField, Button, Typography} from '@mui/material';
import { CircularProgress } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import OutputService from '../../services/outputsService';
import CircularProgressWithLabel from '../../components/circularProgressWithLabel/circularProgressWithLabel';
import dayjs from 'dayjs';
import { getConfigurationID } from '../../utils/storage';
import { CurrentConfiguration } from '../../components/currentConfiguration/currentConfiguration';
import { ErrorModal, NoErrorModal } from './errorModal';
import { OutputsPresenter } from '../../presenters/outputsService';

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

function calcularDias(desde, hasta){
    const days = [];
    for (let day = desde; day <= hasta; day.setDate(day.getDate() + 1)) {
        days.push(new Date(day).toISOString().split('T')[0]);
    }
    return days
}

function formatDates(arr) {
    arr.forEach(obj => {
        obj.Date = obj.Date.substring(0, 10);
    });
    return arr;
}

function groupErrors(dates, desde, hasta) {
    dates = formatDates(dates)
    const grouped = Object.groupBy(dates, ({ ErrorType }) => ErrorType);
    const errorsGrouped = {}
    for (const [ErrorType, errors] of Object.entries(grouped)) {
        errorsGrouped[ErrorType] = []
        const byDate = new Map(errors.map((obj) => [obj.Date, obj]));
        for (let day = new Date(desde); day <= hasta; day.setDate(day.getDate() + 1)) {
            const parsedDate = day.toISOString().split('T')[0];
            const dateErrors = byDate.get(parsedDate);
            if (dateErrors) {
                errorsGrouped[ErrorType].push(dateErrors.Total);
            } else {
                errorsGrouped[ErrorType].push(0);
            }
        }
    }
    return errorsGrouped;
}

const map_metrics = (metrics, errores) => {
    if(errores?.length === 0){
        updateObjectInArray(metrics, "Valores nulos", { value: 0 }  )
        updateObjectInArray(metrics, "Errores de falta de horizonte a 4 dias", { value: 0}  )
        updateObjectInArray(metrics, "Valores fuera de banda de errores", { value: 0 }  )
        updateObjectInArray(metrics, "Errores de falta de pronostico", { value: 0 }  )
        updateObjectInArray(metrics, "Outliers observados", { value: 0 }  )
        updateObjectInArray(metrics, "Pronosticos fuera de umbrales", { value: 0 }  )
    }
    for (const errorobj of errores) {
        if(errorobj.ErrorType === 'NullValue'){
            updateObjectInArray(metrics, "Valores nulos", { value: errorobj.Count })
            updateObjectInArray(metrics, "Valores nulos", { id: errorobj.ErrorId })
        }else if(errorobj.ErrorType === 'Missing4DaysHorizon'){
            updateObjectInArray(metrics, "Errores de falta de horizonte a 4 dias", { value: errorobj.Count })
            updateObjectInArray(metrics, "Errores de falta de horizonte a 4 dias", { id: errorobj.ErrorId })
        }else if(errorobj.ErrorType === 'OutsideOfErrorBands'){
            updateObjectInArray(metrics, "Valores fuera de banda de errores", { value: errorobj.Count })
            updateObjectInArray(metrics, "Valores fuera de banda de errores", { id: errorobj.ErrorId })
        }else if(errorobj.ErrorType === "ForecastMissing"){
            updateObjectInArray(metrics, "Errores de falta de pronostico", { value: errorobj.Count })
            updateObjectInArray(metrics, "Errores de falta de pronostico", { id: errorobj.ErrorId })
        }else if(errorobj.ErrorType === "ObservedOutlier"){
            updateObjectInArray(metrics, "Outliers observados", { value: errorobj.Count })
            updateObjectInArray(metrics, "Outliers observados", { id: errorobj.ErrorId })
        }else if(errorobj.ErrorType === "ForecastOutOfBounds"){
            updateObjectInArray(metrics, "Pronosticos fuera de umbrales", { value: errorobj.Count })
            updateObjectInArray(metrics, "Pronosticos fuera de umbrales", { id: errorobj.ErrorId })
        }
    }
}

const updateObjectInArray = (arr, nameValue, updatedValue) => {
    const index = arr.findIndex(obj => obj.name === nameValue);
    if (index !== -1) {
        arr[index] = { ...arr[index], ...updatedValue };
    }
    return arr;
};

export const Outputs = () => {
    const service = new OutputService()
    const presenter = new OutputsPresenter()
    const [currentConfigId, setCurrentConfigId] = useState('');
    const [loading, setLoading] = useState(true);

    const currentDate = dayjs()
    const defaultDesdeDate = dayjs().subtract(7, 'day')

    const [desde, setDesde] = useState(defaultDesdeDate);
    const [hasta, setHasta] = useState(currentDate);

    const [graficoDesde, setGraficoDesde] = useState(defaultDesdeDate);
    const [graficohasta, setGraficoHasta] = useState(currentDate);

    const [indicadores, setIndicadores] =  useState([]);

    const [openMetric, setOpenMetric] = useState(null);

    const [metrics, setMetrics] = useState([
        {name: "Valores nulos", value: 0, id: -1},
        {name: "Errores de falta de horizonte a 4 dias", value: 0, id: -1},
        {name: "Valores fuera de banda de errores", value: 0, id: -1},
        {name: "Errores de falta de pronostico", value: 0, id: -1},
        {name: "Outliers observados", value: 0, id: -1},
        {name: "Pronosticos fuera de umbrales", value: 0, id: -1},
    ]);
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
        const configId = getConfigurationID();
        setCurrentConfigId(configId)
        let indicadoresResponse = await service.getIndicatorsbyConfigID(configId)
        setIndicadores(indicadoresResponse)
        map_metrics(metrics, indicadoresResponse)
        setMetrics(metrics)
    },[])

    const loadBehavior = useCallback (async()=>{
        const configId = getConfigurationID();
        const behaviorResponse = await service.getBehaviorByConfigId(configId)
        setNivelAlertaPorcentaje(behaviorResponse.TotalValuesCount? (behaviorResponse.CountAlertLevel*100)/behaviorResponse.TotalValuesCount:0)
        setevacuacionPorcentaje(behaviorResponse.TotalValuesCount? (behaviorResponse.CountEvacuationLevel*100)/behaviorResponse.TotalValuesCount:0)
        setAguasBajasPorcentaje(behaviorResponse.TotalValuesCount? (behaviorResponse.CountLowWaterLevel*100)/behaviorResponse.TotalValuesCount:0)
    },[])

    async function aplicarFiltros(){
        const params = {
            configurationId: currentConfigId,
            ...(desde) && {timeStart: dateParser(desde.toDate())},
            ...(hasta) && {timeEnd: dateParser(hasta.toDate())},
        }
        const fetchDataFiltered = async () => {
            setLoading(true);
            const filteredIndicators = await service.getFilteredIndicators(params)
            map_metrics(metrics, filteredIndicators)
            setMetrics(metrics)

            const filteredErrorsPerDayResponse = await service.getErroresPorDia(params)
            const erroresAgrupados = groupErrors(filteredErrorsPerDayResponse, desde.toDate(), hasta.toDate());
            setErroresPorDias(erroresAgrupados);

            const filteredBehavior = await service.getBehaviorFilterd(params)
            setNivelAlertaPorcentaje(filteredBehavior.TotalValuesCount? (filteredBehavior.CountAlertLevel *100)/ filteredBehavior.TotalValuesCount :0)
            setevacuacionPorcentaje(filteredBehavior.TotalValuesCount? (filteredBehavior.CountEvacuationLevel *100)/ filteredBehavior.TotalValuesCount:0)
            setAguasBajasPorcentaje(filteredBehavior.TotalValuesCount? (filteredBehavior.CountLowWaterLevel*100)/ filteredBehavior.TotalValuesCount:0)
            setGraficoDesde(desde)
            setGraficoHasta(hasta)
            setLoading(false);
        }
        fetchDataFiltered();
    }

    useEffect(() => {
        loadIndicators()
        map_metrics(metrics, indicadores)
        setMetrics(metrics)
        const configId = getConfigurationID();
        setCurrentConfigId(configId)
        const fetchDataPorDia = async () => {
            let dataPorDia = await presenter.getErroresPorDia(configId)
            const erroresAgrupados = groupErrors(dataPorDia, desde.toDate(), hasta.toDate());
            setErroresPorDias(erroresAgrupados);
            setLoading(false);
        };
        fetchDataPorDia();
        loadBehavior()
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
                        xAxis={[{ scaleType: 'band', data: calcularDias(graficoDesde.toDate(),graficohasta.toDate()) }]}
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
