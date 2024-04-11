import React, {useEffect, useState} from 'react';
import {Container, TextField, Button, Select, FormControl, InputLabel, MenuItem} from '@mui/material';
import Line from '../../components/line/line';
import { SerieModal } from './serieModal/serieModal';
import Grid from '@mui/material/Unstable_Grid2';
import SeriesCard from '../../components/seriesCard/seriesCard';
import { CircularProgress } from '@mui/material';
import PaginationComponent from '../../components/pagination/paginationComponent';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const getConfigId = () => {
    return parseInt(localStorage.getItem("configId"), 10);
};

const getConfigName = () => {
    return localStorage.getItem("configName");
};

function dateParser(dateString){
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based, so add 1 and pad with leading zero if necessary
    const day = date.getDate().toString().padStart(2, '0'); // Pad day with leading zero if necessary

    return`${year}-${month}-${day}`;
}

export const Series = () => {
    const [desde, setDesde] = useState('');
    const [hasta, setHasta] = useState('');
    const [procedimientoSeleccionado, setProcedimiento] = useState('');
    const [estacionSeleccionada, setIdEstacion] = useState('');
    const [variableSeleccionada, setVariable] = useState('');

    const [currentConfigName, setCurrentConfigName] = useState('');
    const [currentConfigId, setCurrentConfigId] = useState('');

    const [configuredStreamIdModalOpen, setConfiguredStreamIdModalOpen] = useState(null);
    const handleOpenModal = (configuredStreamId) => setConfiguredStreamIdModalOpen(configuredStreamId);
    const handleCloseModal = () => setConfiguredStreamIdModalOpen(null);
    const [data, setData] = useState(null);
    const [estacionesDisponibles, setEstacionesDisponibles] = useState(null);
    const [procedimientosDisponibles, setProcedimientosDisponibles] = useState(null);
    const [variablesDisponibles, setVariablesDisponibles] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const configName = getConfigName();
        if (configName) {
            setCurrentConfigName(configName);
        }
        const configId = getConfigId()
        setCurrentConfigId(configId)
        const fetchDataForPosts = async () => {
            try {
                const response = await fetch(
                `http://localhost:8081/api/v1/series?page=${page}&configurationId=${configId}`
                );
                if (!response.ok) {
                throw new Error(`HTTP error: Status ${response.status}`);
                }
                let data = await response.json();
                setData(data.Content);
                setTotalPages(data.Pageable.Pages)
                setError(null);

                const estaciones = await fetch(
                    'http://localhost:8081/api/v1/filtro/estaciones'
                    );
                const procedimientos = await fetch(
                    'http://localhost:8081/api/v1/filtro/procedimientos'
                    );
                const variables = await fetch(
                    'http://localhost:8081/api/v1/filtro/variables'
                    );
                let responseEstaciones = await estaciones.json()
                    setEstacionesDisponibles(responseEstaciones)
                let responseProcedimientos = await procedimientos.json()
                    setProcedimientosDisponibles(responseProcedimientos)
                let responseVariables = await variables.json()
                    setVariablesDisponibles(responseVariables)
            } catch (err) {
                setError(err.message);
                setData(null);
            } finally {
                setLoading(false);
            }
            };
            fetchDataForPosts();
    }, []);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };
    
    async function aplicarFiltros(){
        const params = {
            configurationId: currentConfigId,
            ...(desde) && {timeStart: dateParser(desde)},
            ...(hasta) && {timeEnd: dateParser(hasta)},
            ...(estacionSeleccionada) && {stationId:estacionSeleccionada},
            ...(procedimientoSeleccionado) && {procId: procedimientoSeleccionado},
            ...(variableSeleccionada) && {varId: variableSeleccionada},
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
                setTotalPages(data.Pageable.Pages)
                setError(null);
        } catch (err) {
            setError(err.message);
            setData(null);
        } finally {
            setLoading(false);
        }
        };
        fetchDataFiltered();
    }

    return (
        <div style={{maxWidth: "100%"}}>
            <h1> Series </h1>
            <h4>Configuración actual: {currentConfigName}</h4>
            <Line/>
            {loading?
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
                :<>
                    <Container sx={{display:"flex", flexFlow:"wrap", justifyContent:"center"}}>
                        <Grid items>
                            <LocalizationProvider  dateAdapter={AdapterDayjs } >
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
                            </LocalizationProvider>
                            <FormControl sx={{ m: 1, minWidth: 200, marginInline: 2, marginTop:2}}>
                                <InputLabel id="estacion">Variable</InputLabel>
                                <Select
                                    labelId="Variable"
                                    id="demo-simple-select"
                                    value={variableSeleccionada}
                                    label="Variable"
                                    onChange={(event) => setVariable(event.target.value)}
                                >
                                    {variablesDisponibles.map((variable) => (
                                        <MenuItem value={variable.Id}>{variable.Name}</MenuItem>
                                        ))}
                                </Select>
                            </FormControl>
                            <FormControl sx={{ m: 1, minWidth: 200, marginInline: 2, marginTop:2}}>
                                <InputLabel id="estacion">Procedimiento</InputLabel>
                                <Select
                                    labelId="Procedimiento"
                                    id="demo-simple-select"
                                    value={procedimientoSeleccionado}
                                    label="Procedimiento"
                                    onChange={(event) => setProcedimiento(event.target.value)}
                                >
                                    {procedimientosDisponibles.map((procedimiento) => (
                                        <MenuItem value={procedimiento.Id}>{procedimiento.Name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl sx={{ m: 1, minWidth: 200, marginInline: 2, marginTop:2}}>
                                <InputLabel id="estacion">Estacion</InputLabel>
                                <Select
                                    labelId="estacion"
                                    id="demo-simple-select"
                                    value={estacionSeleccionada}
                                    label="Estacion"
                                    onChange={(event) => setIdEstacion(event.target.value)}
                                >
                                    {estacionesDisponibles.map((estacion) => (
                                        <MenuItem value={estacion.Id}>{estacion.Name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <div>
                            <Button variant="contained" onClick={aplicarFiltros} sx={{margin: 2, marginInline:5}}>
                                Aplicar filtros
                            </Button>
                            <Button variant="contained" onClick={()=>{
                                setDesde(null)
                                setHasta(null)
                                setIdEstacion(null)
                                setProcedimiento('')
                                setVariable('')
                                aplicarFiltros()
                            }} sx={{margin: 2, marginInline:5}}>
                                Borrar filtros
                            </Button>
                        </div>
                    </Container>
                    <Container>
                        <Grid
                            container
                            spacing={5}
                            style={{justifyContent: "center", alignItems:"center"}}
                        >
                            {data.map((serie, index) => (
                                <Grid item key={index}>
                                    <SeriesCard serieData={serie} onClick={() => handleOpenModal(serie.ConfiguredStreamId)}/>  
                                </Grid>
                                ))
                            }
                        </Grid>
                    
                    </Container>
                    {data.map((serie) => (
                        <SerieModal 
                            open={serie.ConfiguredStreamId === configuredStreamIdModalOpen} 
                            handleClose={handleCloseModal} 
                            serieId={serie.StreamId} 
                            configuredSerieId={serie.ConfiguredStreamId} 
                            serieType={serie.StreamType} 
                            calibrationId={serie.CalibrationId}/>
                    ))}
            
                <PaginationComponent page={page} totalPages={totalPages} setPage={setPage}/>
            </>
            }
        </div>
    );
}            