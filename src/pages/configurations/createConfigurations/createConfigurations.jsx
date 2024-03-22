import { useState } from "react";
import { Box, Button, TextField } from '@mui/material';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import React from 'react';
import Line from '../../../components/line/line';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import './createConfigurations.css'

const METRICS = ['Mediana', 'Media', 'Máximo', 'Mínimo', '% Nulos', 'Tasa de cambio']
const SERIES_TYPES = {
    OBSERVADA: 'Observada',
    PRONOSTICADA: 'Pronosticada',
    SIMULADA: 'Simulada'
}

export const CreateConfigurations = () => {

    const [series, setSeries] = useState([]);
    const [nodes, setNodes] = useState([]);

    const [idSerie, setIdSerie] = useState(null);
    const [idNode, setIdNode] = useState(1);
    const [nameNode, setNameNode] = useState(null);
    const [serieType, setSerieType] = useState(SERIES_TYPES.OBSERVADA);

    return (
        <Box>
            <TextField label='Nombre de la configuración'/>
            <h3>Nodos</h3>
            <Line/>
            <Box className='row'>
                <TextField label='Nombre' onChange={e =>  setNameNode(e.target.value)}/>
                <TextField label='Id nodo' disabled value={idNode}/>
            </Box>
            <Button onClick={() => {
                    setNodes([...nodes, {id: idNode, name: nameNode}]);
                    setIdNode(idNode + 1);
                }}>Agregar nodo
            </Button>
            <h3>Series</h3>
            <Line/>
            <Box className='row'>
                <TextField label='Id Serie' value={idSerie} onChange={e => setIdSerie(e.target.value)}/>
                <SelectNode nodes={nodes} idNode={idNode} setIdNode={setIdNode}/>
            </Box>
            <Box className='row'>
                <TextField label='Frecuencia de actualización'/>
                <TextField label='Retardo esperado'/>
            </Box>
            <h4>Tipo de serie</h4>
            <RadioGroup 
                value={serieType}
                onChange={e => setSerieType(e.target.value)}
                style={{display:'flex', flexDirection:'row'}} >
                {Object.keys(SERIES_TYPES).map(key => 
                    <FormControlLabel
                        value={SERIES_TYPES[key]}
                        control={<Radio />}
                        label={SERIES_TYPES[key]}/>
                    )}
            </RadioGroup>
            <Box className='row'>
                <TextField label='Id Series Redundante' disabled={serieType !== SERIES_TYPES.OBSERVADA}/>
                <TextField label='Id Calibrado' disabled={serieType === SERIES_TYPES.OBSERVADA}/>
                <TextField label='Id Series Input' disabled={serieType !== SERIES_TYPES.SIMULADA}/>
            </Box>
            <h4>Métricas</h4>
            <FormGroup className='row'>
                {METRICS.map(metrica => <FormControlLabel control={<Checkbox />} label={metrica} />)}
            </FormGroup>
            <h4>Umbrales</h4>
            <Box className='row'>
                <TextField label='Intervalo normal' />
                <TextField label='Intervalo inusual' />
            </Box>
            <Button onClick={() => setSeries([...series, idSerie])}>Agregar serie</Button>
        </Box>
    );
}

const SelectNode = ({nodes, idNode, setIdNode}) => {
    return (
        <Box sx={{ minWidth: 220 }}>
            <FormControl fullWidth>
                <InputLabel id="nodo">Nodo</InputLabel>
                <Select
                    labelId="nodo"
                    id="nodo"
                    value={idNode}
                    label="Nodo"
                    onChange={e => setIdNode(e.target.value)}
                >
                    {nodes.map(node => <MenuItem value={node.id}>{`${node.id} - ${node.name}`}</MenuItem>)}
                </Select>
            </FormControl>
        </Box>
    );
}
