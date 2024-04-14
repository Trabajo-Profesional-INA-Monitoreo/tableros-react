import React, {useEffect, useState, useCallback} from 'react';
import { Box } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Line from '../../components/line/line';
import { DatePicker } from '@mui/x-date-pickers';

import { TextField, Button, Typography} from '@mui/material';
import { CircularProgress } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import OutputService from '../../services/outputsService';

const getConfigId = () => {
    return parseInt(localStorage.getItem("configId"), 10);
};

const getConfigName = () => {
    return localStorage.getItem("configName");
};


function dateParser(dateString){
    const date = new Date(dateString);
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
    //const currentDate = new Date();
    //if(!desde){
    //    desde = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7);
    //}
    const days = [];
    for (let day = new Date(desde); day <= hasta; day.setDate(day.getDate() + 1)) {
        days.push(new Date(day).toISOString().split('T')[0]);
    }
    console.log(days)
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
    if(errores?.length === 0) return
    for (const errorobj of errores) {
        if(errorobj.ErrorType === 'NullValue'){
            updateObjectInArray(metrics, "Valores nulos", { value: errorobj.Count }  )
        }else if(errorobj.ErrorType === 'Missing4DaysHorizon'){
            updateObjectInArray(metrics, "Errores de falta de horizonte a 4 dias", { value: errorobj.Count }  )
        }else if(errorobj.ErrorType === 'OutsideOfErrorBands'){
            updateObjectInArray(metrics, "Valores fuera de banda de errores", { value: errorobj.Count }  )
        }else if(errorobj.ErrorType === "ForecastMissing"){
            updateObjectInArray(metrics, "Errores de falta de pronostico", { value: errorobj.Count }  )
        }else{ 
            updateObjectInArray(metrics, "Errores desconocidos", { value: errorobj.Count }  )
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
    //const currentDate = new Date();
    //const [desde, setDesde] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7));
    //const [hasta, setHasta] = useState(currentDate);
    const [desde, setDesde] = useState('');
    const [hasta, setHasta] = useState('');
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState([
        {name: "Valores nulos", value: 0},
        {name: "Errores de falta de horizonte a 4 dias", value: 0},
        {name: "Valores fuera de banda de errores", value: 0},
        {name: "Errores de falta de pronostico", value: 0},
        {name: "Errores desconocidos", value: 0},
    ]);
    const [indicadores, setIndicadores] =  useState([]);
    const [erroresPorDias, setErroresPorDias] = useState({})
    const [currentConfigName, setCurrentConfigName] = useState('');
    const [currentConfigId, setCurrentConfigId] = useState('');

    const loadIndicators = useCallback (async() =>{
        const configName = getConfigName();
        if (configName) { setCurrentConfigName(configName) }
        const configId = getConfigId()
        setCurrentConfigId(configId)
        let indicadoresResponse = await service.getIndicatorsbyConfigID(configId)
        setIndicadores(indicadoresResponse)
        map_metrics(metrics, indicadoresResponse)
        setMetrics(metrics)
    },[])

    useEffect(() => {
        loadIndicators()
        map_metrics(metrics, indicadores)
        setMetrics(metrics)
        const configId = getConfigId()

        const fetchDataPorDia = async () => {
            try {
                const erorres_por_dia = await fetch(
                    `http://localhost:8081/api/v1/errores/por-dia?configurationId=${configId}`
                );
                if (!erorres_por_dia.ok) {
                throw new Error(`HTTP error: Status ${erorres_por_dia.status}`);
                }
                let dataPorDia = await erorres_por_dia.json();
                console.log(dataPorDia)
                const dates = [
                    {
                        "date": "2024-04-02T00:00:00Z",
                        "errorType": "1",
                        "total": 2
                    },
                    {
                        "date": "2024-04-02T00:00:00Z",
                        "errorType": "2",
                        "total": 3
                    },
                    {
                        "date": "2024-04-02T00:00:00Z",
                        "errorType": "3",
                        "total": 1
                    },
                    {
                        "date": "2024-04-04T00:00:00Z",
                        "errorType": "1",
                        "total": 1
                    },
                    {
                        "date": "2024-04-04T00:00:00Z",
                        "errorType": "2",
                        "total": 3
                    },
                    {
                        "date": "2024-04-05T00:00:00Z",
                        "errorType": "1",
                        "total": 1
                    },
                ]
                const _desde = new Date('2024-04-12')
                const _hasta = new Date('2024-04-14')
                const sarasa = groupErrors(dataPorDia, _desde, _hasta);
                console.log("final")
                console.log(sarasa)
                setErroresPorDias(sarasa);
            } finally {
                setLoading(false);
            }
        };
        fetchDataPorDia();
    }, [loadIndicators]);

    async function aplicarFiltros(){
        const params = {
            configurationId: currentConfigId,
            ...(desde) && {timeStart: dateParser(desde)},
            ...(hasta) && {timeEnd: dateParser(hasta)},
        }
        const fetchDataFiltered = async () => {
            setLoading(true);
            const response = await fetch('http://localhost:8081/api/v1/series?' + new URLSearchParams(params))
            let data = await response.json();
            //map_metrics(metrics, data)
        }
        fetchDataFiltered();
    }

    return (    
        <>
        <Box>
            <h1>Tablero Outputs</h1>
            <h4>Configuración actual: {currentConfigName}</h4>
            <Line/>
            <Grid items sx={{display:"flex", alignItems:"center"}}>
                    <DatePicker 
                        id="Desde"
                        label="Desde"
                        inputFormat="YYYY/MM/DD"
                        value={desde || null}
                        onChange = {(event) => setDesde(event)}
                        renderInput={(params) => <TextField {...params} />}
                        sx={{ m: 1, maxWidth: 200, marginInline: 2, marginTop:2}}
                        />
                    <DatePicker 
                        id="hasta"
                        label="Hasta"
                        inputFormat="YYYY/MM/DD"
                        value={hasta || null}
                        onChange = {(event) => setHasta(event)}
                        renderInput={(params) => <TextField {...params} />}
                        sx={{ m: 1, maxWidth: 200, marginInline: 2, marginTop:2}}
                    />
                <Button variant="contained" onClick={aplicarFiltros} sx={{ marginInline:5}}>
                    Aplicar filtros
                </Button>
                <Button variant="contained" onClick={()=>{
                    setDesde(null)
                    setHasta(null)
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

                <div style={{padding: 10, marginTop:"5%"}}>
                    <Box className='row space-around wrap'>
                        {metrics.map(metric => metricsBox(metric.name, metric.value, true))}
                    </Box>
                </div>
                <div style={{ display:"flex", justifyContent: "center", margin: "5%"}}>
                {erroresPorDias && Object.keys(erroresPorDias).length === 3 && <BarChart
                    width={600}
                    height={300}
                    xAxis={[{ scaleType: 'band', data: ['2024-04-12', '2024-04-13', '2024-04-14'] }]}
                    series={[
                        { data:erroresPorDias['ForecastMissing'], label:'Faltante de datos', stack: 'total' },
                        { data:erroresPorDias['Missing4DaysHorizon'], label:'Falta de horizonte', stack: 'total' },
                        { data:erroresPorDias['UnknownError'], label:'Fuera de rango', stack: 'total' },
                    ]}
                    />}
                </div>
            </>}
        </> 

    );
}
