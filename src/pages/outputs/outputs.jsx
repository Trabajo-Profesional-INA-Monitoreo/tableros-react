import React, {useEffect, useState} from 'react';
import { Box } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Line from '../../components/line/line';
import { DatePicker } from '@mui/x-date-pickers';

import { TextField, Button, Typography} from '@mui/material';
import { CircularProgress } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';

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

function calcularDias(desde){
    const currentDate = new Date();
    if(!desde){
        desde = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7);
    }
    const days = [];
    for (let day = new Date(desde); day <= currentDate; day.setDate(day.getDate() + 1)) {
        days.push(new Date(day).toISOString().split('T')[0]);
    }
}

function groupErrors(dates, desde, hasta) {
    const grouped = Object.groupBy(dates, ({ errorType }) => errorType);
    const errorsGrouped = {}

    for (const [errorType, errors] of Object.entries(grouped)) {
        errorsGrouped[errorType] = []
        const byDate = new Map(errors.map((obj) => [obj.date, obj]));
        for (let day = new Date(desde); day <= hasta; day.setDate(day.getDate() + 1)) {

            const parsedDate = day.toISOString().split('T')[0];
            const dateErrors = byDate.get(parsedDate);
            if (dateErrors) {
                errorsGrouped[errorType].push(dateErrors.total);
            } else {
                errorsGrouped[errorType].push(0);
            }
        }
    }
    console.log('errores', errorsGrouped);
    return errorsGrouped;
}



export const Outputs = () => {
    //const currentDate = new Date();
    //const [desde, setDesde] = useState(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7));
    //const [hasta, setHasta] = useState(currentDate);
    const [desde, setDesde] = useState('');
    const [hasta, setHasta] = useState('');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [erroresPorDias, setErroresPorDias] = useState({})
    const [currentConfigName, setCurrentConfigName] = useState('');
    const [currentConfigId, setCurrentConfigId] = useState('');
    const metrics = [
        {name: "Errores de falta de horizonte a 4 dias", value: 0},
        {name: "Errores de falta de pronostico", value: 0},
        {name: "Valores fuera de banda de errores", value: 0},
        {name: "Pronosticos fuera de rango", value: 0},
        {name: "Faltantes de datos", value: 0},
    ]

    useEffect(() => {
        const configName = getConfigName();
        if (configName) {
            setCurrentConfigName(configName);
        }
        const configId = getConfigId()
        setCurrentConfigId(configId)
        const fetchData = async () => {
            try {
                const response = await fetch(
                `http://localhost:8081/api/v1/errores/indicadores?configurationId=${configId}`
                );
                if (!response.ok) {
                throw new Error(`HTTP error: Status ${response.status}`);
                }
                let data = await response.json();
                
                setData(data.Content);
            } finally {
                setLoading(false);
            }
            };
        fetchData();

        const fetchDataPorDia = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8081/api/v1/errores/por-dia?configurationId=${configId}`
                );
                if (!response.ok) {
                throw new Error(`HTTP error: Status ${response.status}`);
                }
                let dataPorDia = await response.json();
                //pasar a un mapa
                //guardar las cosas desde el mapa
                const dates = [
                    {
                        "date": "2024-04-02",
                        "errorType": "1",
                        "total": 2
                    },
                    {
                        "date": "2024-04-02",
                        "errorType": "2",
                        "total": 3
                    },
                    {
                        "date": "2024-04-02",
                        "errorType": "3",
                        "total": 1
                    },
                    {
                        "date": "2024-04-04",
                        "errorType": "1",
                        "total": 1
                    },
                    {
                        "date": "2024-04-04",
                        "errorType": "2",
                        "total": 3
                    },
                    {
                        "date": "2024-04-05",
                        "errorType": "1",
                        "total": 1
                    },
                ]
                const _desde = new Date('2024-04-02')
                const _hasta = new Date('2024-04-05')
                const sarasa = groupErrors(dates, _desde, _hasta);
                setErroresPorDias(sarasa);
            } finally {
                setLoading(false);
            }
        };
        fetchDataPorDia();
    }, []);

    async function aplicarFiltros(){
        const params = {
            configurationId: currentConfigId,
            ...(desde) && {timeStart: dateParser(desde)},
            ...(hasta) && {timeEnd: dateParser(hasta)},
        }
        const fetchDataFiltered = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:8081/api/v1/series?' + new URLSearchParams(params))
            if (!response.ok) {
                throw new Error(`HTTP error: Status ${response.status}`);
                }
                let data = await response.json();
                setData(data.Content);
        } finally {
            setLoading(false);
        }
        };
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
                    xAxis={[{ scaleType: 'band', data: ['2024-04-02', '2024-04-03', '2024-04-04', '2024-04-05'] }]}
                    series={[
                        { data:erroresPorDias['1'], label:'Faltante de datos', stack: 'total' },
                        { data:erroresPorDias['2'], label:'Falta de horizonte', stack: 'total' },
                        { data:erroresPorDias['3'], label:'Fuera de rango', stack: 'total' },
                    ]}
                    />}
                </div>
            </>}
        </> 

    );
}