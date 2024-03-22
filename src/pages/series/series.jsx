import React, {useState} from 'react';
import {Box, Container, TextField, Button, Select, FormControl, InputLabel, MenuItem} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Line from '../../components/line/line';

export const Series = () => {
    const [idSerie, setIdSerie] = useState('');
    const [desde, setDesde] = useState('');
    const [hasta, setHasta] = useState('');
    const [procedimiento, setProcedimiento] = useState('');
    const [idEstacion, setIdEstacion] = useState('');
    const [tipoSerie, setTipoSerie] = useState('');
    const [variable, setVariable] = useState('');
    const [red, setRed] = useState('');

    async function aplicarFiltros(){}

    return (
        <div style={{maxWidth: "100%"}}>
            <h1> Series </h1>
            <Line/>
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
                                label = "Red"
                                type = "text"
                                placeholder = "Red"
                                name = "Red"
                                className={"inputStyle"}
                                value={red}
                                onChange = {(event) => setRed(event.target.value)}
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
                                    <MenuItem value={30}>Redundante</MenuItem>
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
        </div>
    );
}