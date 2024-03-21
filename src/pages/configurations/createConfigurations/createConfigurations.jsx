import { useState, useEffect } from "react";
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
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import './createConfigurations.css'

const METRICS = ['Mediana', 'Media', 'Máximo', 'Mínimo', '% Nulos']
const SERIES_TYPES = {
    OBSERVADA: 'Observada',
    PRONOSTICADA: 'Pronosticada',
    SIMULADA: 'Simulada'
}

export const CreateConfigurations = () => {

    const [series, setSeries] = useState([]);
    const [nodes, setNodes] = useState([]);
    const [nameNode, setNameNode] = useState('');
    const [idNodeCounter, setIdNodeCounter] = useState(1);
    const [idNode, setIdNode] = useState(null);
    const [idSerie, setIdSerie] = useState('');
    const [checkErrors, setCheckErrors] = useState(false);
    const [actualizationFrequency, setActualizationFrequency] = useState('');
    const [redundantSerieID, setRedundantSerieID] = useState('');
    const [redundantSeriesIDs, setRedundantSeriesIDs] = useState([]);
    const [calibrationID, setCalibrationID] = useState('');
    const [metrics, setMetrics] = useState(() => {
        var metrics = {};
        METRICS.forEach((metric) => metrics[metric] = false);
        return metrics;
    })
    const [serieType, setSerieType] = useState(SERIES_TYPES.OBSERVADA);
    const [lowerThreshold, setLowerThreshold] = useState('');
    const [upperThreshold, setUpperThreshold] = useState('');

    const serie = {
        idSerie: idSerie, 
        idNode: idNode, 
        actualizationFrequency: actualizationFrequency, 
        serieType: serieType,
        calibrationID: calibrationID,
        redundantSeriesIDs: redundantSeriesIDs,
        metrics: metrics,
        checkErrors: checkErrors,
        lowerThreshold: lowerThreshold,
        upperThreshold: upperThreshold
    }

    const handleAddSerie = () => {
        if (serie.idSerie === '') {
            alert("El ID de la serie es necesario")
        } else if (serie.idNode === null) {
            alert("Indiqué a que nodo debe pertenecer esta serie")
        } 
        else if (serie.actualizationFrequency === '') {
            alert("La frecuencia de actualización de la serie es necesaria")
        } else if (serie.serieType === SERIES_TYPES.PRONOSTICADA && serie.calibrationID === '') {
            alert("El ID de calibracion es necesario en las series pronosticadas")
        }
        else {
            alert("Serie creada correctamente")
            setSeries([...series, serie]);
        }
    }

    useEffect(() => {
        setIdSerie('');
        setIdNode(null);
        setActualizationFrequency('');
        setRedundantSerieID('');
        setRedundantSeriesIDs([]);
        setCalibrationID('');
        setSerieType(SERIES_TYPES.OBSERVADA);
        setCheckErrors(false);
        var metrics = {};
        METRICS.forEach((metric) => metrics[metric] = false)
        setMetrics(metrics);
        setLowerThreshold('');
        setUpperThreshold('')
      }, [series]);

    return (
        <Box>
            <Box className='row'><TextField label='Nombre de la configuración'/></Box>
            <Button onClick={() => {}}>Crear configuración</Button>
            <Box className='row'>           
                <Box className='form'>
                <h3>Nodos</h3>
                <Line/>                
                    <Box className='row'>
                        <TextField label='Nombre del nodo' onChange={e => setNameNode(e.target.value)}/>
                    </Box>
                    <Button onClick={() => {
                            setNodes([...nodes, {id: idNodeCounter, name: nameNode}]);
                            setIdNodeCounter(idNodeCounter + 1);
                        }}>Agregar nodo
                    </Button>
                    <h3>Series</h3>
                    <Line/>
                    <Box className='row'>
                        <TextField type="number" label='Id Serie' value={idSerie} onChange={e => setIdSerie(e.target.value)}/>
                        <SelectNode nodes={nodes} idNode={idNode} setIdNode={setIdNode}/>
                    </Box>
                    <Box className='row'>
                        <TextField 
                            label='Frecuencia de actualización'
                            value={actualizationFrequency}
                            type="number"
                            onChange={e => setActualizationFrequency(e.target.value)}/>
                    </Box>
                    <h4>Tipo de serie</h4>
                    <RadioGroup 
                        value={serieType}
                        onChange={e => {
                            setRedundantSerieID('');
                            setRedundantSeriesIDs([]);
                            setCalibrationID('');
                            setSerieType(e.target.value);
                        }}
                        style={{display:'flex', flexDirection:'row'}} >
                        {Object.keys(SERIES_TYPES).map(key => 
                            <FormControlLabel
                                key={SERIES_TYPES[key]}
                                value={SERIES_TYPES[key]}
                                control={<Radio />}
                                label={SERIES_TYPES[key]}/>
                            )}
                    </RadioGroup>
                    <Box className='row-nogap'>
                        <TextField
                            label='Id Serie Redundante'
                            type='number'
                            inputProps={{min:0}}
                            value={redundantSerieID}
                            onChange={e => setRedundantSerieID(e.target.value) }
                            disabled={serieType !== SERIES_TYPES.OBSERVADA}/>
                        <IconButton aria-label='add' size='large' onClick={() => {
                            setRedundantSeriesIDs([...redundantSeriesIDs, redundantSerieID]);
                            setRedundantSerieID('');
                        }}>
                            <AddCircleOutlineIcon color="primary"/>
                        </IconButton>
                    </Box>
                    
                        {redundantSeriesIDs.length === 0 ? null :  
                            <Box className='row-nogap'>
                                <Typography margin={1}>Series redundantes: {redundantSeriesIDs.map(serie => serie + ', ')} </Typography>
                                <IconButton onClick={() => setRedundantSeriesIDs(redundantSeriesIDs.slice(0, -1))}>
                                    <RemoveCircleOutlineIcon color="primary"/>
                                </IconButton>
                            </Box>
                        }
                    
                    <TextField 
                            label='Id Calibrado'
                            value={calibrationID}
                            placeholder="Id Calibrado"
                            type='number'
                            onChange={e => setCalibrationID(e.target.value)}
                            disabled={serieType !== SERIES_TYPES.PRONOSTICADA}/>
                    <h4>¿Incluir validación de errores?</h4>
                    <RadioGroup
                        value={checkErrors}
                        onChange={e => setCheckErrors(e.target.value)}
                        style={{display:'flex', flexDirection:'row'}} >
                            <FormControlLabel
                                value={false}
                                control={<Radio />}
                                label={'No'}/>
                            <FormControlLabel
                                value={true}
                                control={<Radio />}
                                label={'Sí'}/>
                    </RadioGroup>
                    <h4>Métricas</h4>
                    <FormGroup className='row'>
                        {METRICS.map(metrica => <FormControlLabel
                            
                            key={metrica} 
                            control={<Checkbox checked={metrics[metrica]} onChange={e => setMetrics((metrics) => ({...metrics, [metrica]: e.target.checked}))}/>} 
                            label={metrica} />)}
                    </FormGroup>
                    <h4>Umbrales</h4>
                    <Box className='row'>
                        <TextField value={lowerThreshold} label='Límite inferior' onChange={e => setLowerThreshold(e.target.value)} type="number"/>
                        <TextField value={upperThreshold} label='Límite superior' onChange={e => setUpperThreshold(e.target.value)} type="number"/>
                    </Box>
                    <Button onClick={() => {handleAddSerie(serie)}}>Agregar serie</Button>
                </Box>
                <Box className='nodes'>
                    <h3>Tus nodos y series</h3>
                    <Line/>        
                    <CreatedNodes nodes={nodes} series={series} setSeries={setSeries} setNodes={setNodes} />
                </Box>
            </Box>
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
                    {nodes.map(node => <MenuItem key={node.id} value={node.id}>{`${node.id} - ${node.name}`}</MenuItem>)}
                </Select>
            </FormControl>
        </Box>
    );
}

const CreatedNodes = ({nodes, series, setSeries, setNodes}) => {
    
    const [openedPopOverIndex, setOpenedPopOverIndex] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);

    const handlePopoverOpen = (e, serieIndex) => {
        setOpenedPopOverIndex(serieIndex);
        setAnchorEl(e.target);
    }

    const handlePopoverClose = () => {
        setOpenedPopOverIndex(null);
        setAnchorEl(null);
    }

    return (
        <Box>
            {nodes.length === 0 ? 'Aún no ha agregado nodos. Cuando agregue nodos aparecerán aquí.': null}
            {nodes.map(node => 
                <Box className='node' key={node.id}>
                    <h4 style={{margin: 0}}>{`Nodo ${node.id} - ${node.name}`}</h4>
                    <Box className='row wrap'>
                        {series.filter(serie => serie.idNode === node.id).length === 0 ? 'Aún no ha agregado series a este nodo. Cuando agregue series aparecerán aquí.': null}
                        {series.map((serie, serieIndex) => serie.idNode === node.id ? 
                            <Box>
                                <Box 
                                    onMouseEnter={e => handlePopoverOpen(e, serie.idSerie)}
                                    onMouseLeave={() => handlePopoverClose()} 
                                    className='serie' 
                                    key={serie.idSerie}>
                                    <div>Serie</div>
                                    <div>{serie.idSerie}</div>
                                    <Button onClick={() => setSeries(series.filter((s, index) => serieIndex !== index))}>Eliminar</Button>
                                </Box>
                                <Popover
                                    //id="mouse-over-popover"
                                    sx={{pointerEvents: 'none'}}
                                    open={serie.idSerie === openedPopOverIndex}
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    onClose={() => setAnchorEl(null)}
                                    disableRestoreFocus
                                >
                                    <Typography sx={{ p: 1 }}>{'Frecuencia de actualizacion: ' + serie.actualizationFrequency}</Typography>
                                    <Typography sx={{ p: 1 }}>{'Tipo de serie: ' + serie.serieType}</Typography>
                                    <Typography sx={{ p: 1 }}>{'Incluir validacion de errores: ' + (serie.checkErrors ? 'Sí' : 'No')}</Typography>
                                    <Typography sx={{ p: 1 }}>{'Métricas: ' + Object.keys(serie.metrics).filter(key => serie.metrics[key])}</Typography>
                                    <Typography sx={{ p: 1 }}>{'ID Calibrado: ' + serie.calibrationID}</Typography>
                                    <Typography sx={{ p: 1 }}>{'Umbrales: ' + serie.lowerThreshold + ' ' + serie.upperThreshold}</Typography>
                                </Popover>
                            </Box>
                            
                            : 
                            null)}
                    </Box>
                    <Button variant="outlined" 
                        onClick={() => {
                            setSeries(series.filter(serie => serie.idNode !== node.id));
                            setNodes(nodes.filter(node_ => node_.id !== node.id));
                        }}>Eliminar nodo</Button>
                </Box>)}
        </Box>
    );
}