import React, {useEffect, useState} from 'react';
import {Container, TextField, Button, Select, FormControl, InputLabel, MenuItem} from '@mui/material';
import Line from '../../components/line/line';
import { SerieModal } from './serieModal/serieModal';
import Grid from '@mui/material/Unstable_Grid2';
import SeriesCard from '../../components/seriesCard/seriesCard';
import { CircularProgress } from '@mui/material';
import PaginationComponent from '../../components/pagination/paginationComponent';

const getConfigId = () => {
    return parseInt(localStorage.getItem("configId"), 10);
};

const getConfigName = () => {
    return localStorage.getItem("configName");
};

export const Series = () => {
    const [idSerie, setIdSerie] = useState('');
    const [desde, setDesde] = useState('');
    const [hasta, setHasta] = useState('');
    const [procedimiento, setProcedimiento] = useState('');
    const [idEstacion, setIdEstacion] = useState('');
    const [tipoSerie, setTipoSerie] = useState('');
    const [variable, setVariable] = useState('');
    const [currentConfigName, setCurrentConfigName] = useState('');

    const [openModal, setOpenModal] = useState(false);
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const configName = getConfigName();
        if (configName) {
            setCurrentConfigName(configName);
        }
        const configId = getConfigId()
        const fetchDataForPosts = async () => {
            try {
                const response = await fetch(
                `http://localhost:5000/api/v1/series?page=${page}&configurationId=${configId}`
                );
                if (!response.ok) {
                throw new Error(`HTTP error: Status ${response.status}`);
                }
                let postsData = await response.json();
                setData(postsData.Content);
                setTotalPages(postsData.Pageable.Pages)
                setError(null);
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
    
    async function aplicarFiltros(){}

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
                                    <TextField 
                                        label = "ID Serie"
                                        type = "text"
                                        placeholder = "Seleccione un ID de serie"
                                        name = "IdSerie"
                                        className={"inputStyle"}
                                        value={idSerie}
                                        onChange = {(event) => setIdSerie(event.target.value)}
                                        sx={{margin:2}}
                                    />
                                    <TextField 
                                        label = "Desde"
                                        type = "text"
                                        placeholder = "Desde"
                                        name = "Desde"
                                        className={"inputStyle"}
                                        value={desde}
                                        onChange = {(event) => setDesde(event.target.value)}
                                        sx={{margin:2}}
                                    />
                                    <TextField 
                                        label = "Hasta"
                                        type = "text"
                                        placeholder = "Hasta"
                                        name = "Hasta"
                                        className={"inputStyle"}
                                        value={hasta}
                                        onChange = {(event) => setHasta(event.target.value)}
                                        sx={{margin:2}}
                                    />
                                    <TextField 
                                        label = "Variable"
                                        type = "text"
                                        placeholder = "Seleccione variable"
                                        name = "variable"
                                        className={"inputStyle"}
                                        value={variable}
                                        onChange = {(event) => setVariable(event.target.value)}
                                        sx={{margin:2}}
                                    />
                                    <TextField 
                                        label = "Procedimiento"
                                        type = "text"
                                        placeholder = "Procedimiento"
                                        name = "procedimiento"
                                        className={"inputStyle"}
                                        value={procedimiento}
                                        onChange = {(event) => setProcedimiento(event.target.value)}
                                        sx={{margin:2}}
                                    />
                                    <TextField 
                                        label = "Id estacion"
                                        type = "text"
                                        placeholder = "Id estacion"
                                        name = "idEstacion"
                                        className={"inputStyle"}
                                        value={idEstacion}
                                        onChange = {(event) => setIdEstacion(event.target.value)}
                                        sx={{margin: 2}}
                                    />
                                    <FormControl sx={{ m: 1, minWidth: 150, marginInline: 2, marginTop:2}}>
                                        <InputLabel id="idEstacion">Tipo de serie</InputLabel>
                                        <Select
                                            labelId="tipoDeSerie"
                                            id="demo-simple-select"
                                            value={tipoSerie}
                                            label="Tipo de serie"
                                            onChange={(event) => setTipoSerie(event.target.value)}
                                        >
                                            <MenuItem value={10}>Pronosticada</MenuItem>
                                            <MenuItem value={20}>Observada</MenuItem>
                                            <MenuItem value={30}>Simulada</MenuItem>
                                        </Select>
                                    </FormControl>
                        </Grid>
                        <div>
                            <Button variant="contained" onClick={aplicarFiltros} sx={{margin: 2, marginInline:5}}>
                                Aplicar filtros
                            </Button>
                            <Button variant="contained" onClick={aplicarFiltros} sx={{margin: 2, marginInline:5}}>
                                Descargar datos
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
                                    <SeriesCard serieData={serie} onClick={handleOpenModal}/>  
                                </Grid>
                                ))
                            }
                        </Grid>     
                </Container>
                </>
                }
            <PaginationComponent page={page} totalPages={totalPages} setPage={setPage}/>
            <SerieModal open={openModal} handleClose={handleCloseModal}/>   
        </div>
    );
}            