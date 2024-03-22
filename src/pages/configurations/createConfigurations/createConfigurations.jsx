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
const SERIES_TYPES = {OBSERVADA: 'Observada', PRONOSTICADA: 'Pronosticada', SIMULADA: 'Simulada'}

export const CreateConfigurations = () => {

    const [configurationName, setConfigurationName] = useState('')
    const [series, setSeries] = useState([]);
    const [nodes, setNodes] = useState([]);
    const [nodeName, setNodeName] = useState('');
    const [idNodeCounter, setIdNodeCounter] = useState(1);
    const [idNode, setIdNode] = useState('');
    const [idSerie, setIdSerie] = useState('');
    const [checkErrors, setCheckErrors] = useState(false);
    const [actualizationFrequency, setActualizationFrequency] = useState('');
    const [redundantSerieID, setRedundantSerieID] = useState('');
    const [redundantSeriesIDs, setRedundantSeriesIDs] = useState([]);
    const [calibrationID, setCalibrationID] = useState('');
    const [serieType, setSerieType] = useState(SERIES_TYPES.OBSERVADA);
    const [lowerThreshold, setLowerThreshold] = useState('');
    const [upperThreshold, setUpperThreshold] = useState('');
    const [metrics, setMetrics] = useState(() => {
        var metrics = {};
        METRICS.forEach((metric) => metrics[metric] = false);
        return metrics;
    })

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
            alert("El ID de la serie es necesario");
        } else if (!serie.idNode) {
            alert("Indiqué a que nodo debe pertenecer esta serie");
        } else if (serie.actualizationFrequency === '') {
            alert("La frecuencia de actualización de la serie es necesaria");
        } else if (serie.serieType === SERIES_TYPES.PRONOSTICADA && serie.calibrationID === '') {
            alert("El ID de calibracion es necesario en las series pronosticadas");
        } else if (Number(serie.lowerThreshold) >= Number(serie.upperThreshold)) {
            alert("El umbral inferior debe ser menor al umbral superior")
        }
        else {
            alert("Serie agregada correctamente");
            setSeries([...series, serie]);
        }
    }

    const handleAddNodo = () => {
        if (nodeName !== '') {
            setNodes([...nodes, {id: idNodeCounter, name: nodeName}]);
            setIdNodeCounter(idNodeCounter + 1);
        } else {
            alert('El nombre del nodo es necesario')
        }
    }

    const handleAddConfiguracion = () => {
        if (configurationName === '') {
            alert("El nombre de la configuración es necesario")
        } else if (nodes.length === 0) {
            alert("Debe agregar nodos a la configuración")
        } else if (series.length === 0) {
            alert("Debe agregar series a la configuración")
        } else {
            alert("Configuración creada exitosamente")
            buildConfigurationJSON()
        }
    }

    const buildConfigurationJSON = () => {
        var configuration = {};
        configuration['name'] = configurationName
        configuration['nodes'] = nodes
        configuration['nodes'].forEach(node => {
            node['series'] = []
            series.forEach(serie => {
                if (node.id === serie.idNode) {
                    node['series'].push({
                        streamId: serie.idSerie,
                        streamType: serie.serieType,
                        updateFrequency: serie.actualizationFrequency,
                        checkErrors: serie.checkErrors,
                        upperThreshold: serie.upperThreshold,
                        lowerThreshold: serie.lowerThreshold,
                        calibrationId: serie.calibrationID,
                        redundanciesIds: serie.redundantSeriesIDs,
                        metrics: serie.metrics
                    })
                }
            })
        })
        console.log(configuration)
    }

    const handleChangeSerieType = (e) => {
        setRedundantSerieID('');
        setRedundantSeriesIDs([]);
        setCalibrationID('');
        setSerieType(e.target.value);
    }

    useEffect(() => {
        setIdSerie('');
        setIdNode('');
        setActualizationFrequency('');
        setRedundantSerieID('');
        setRedundantSeriesIDs([]);
        setCalibrationID('');
        setSerieType(SERIES_TYPES.OBSERVADA);
        setCheckErrors(false);
        var metrics = {};
        METRICS.forEach((metric) => metrics[metric] = false);
        setMetrics(metrics);
        setLowerThreshold('');
        setUpperThreshold('');
      }, [series]);

    return (
        <>
        <TextField label='Nombre de la configuración' value={configurationName} onChange={e => setConfigurationName(e.target.value)}/>
        <div className='button-container'><Button className='button' onClick={() => handleAddConfiguracion()}>Crear configuración</Button></div>
        <Box className='row'>           
            <Box className='form'>
                <h3>Nodos</h3>
                <Line/>                
                <TextField label='Nombre del nodo' onChange={e => setNodeName(e.target.value)}/>
                <div className='button-container'><Button className='button' onClick={() => handleAddNodo()}>Agregar nodo</Button></div>
                <h3>Series</h3>
                <Line/>
                <Box className='row'>
                    <TextField type='number' label='Id Serie' value={idSerie} onChange={e => setIdSerie(e.target.value)}/>
                    <FormControl sx={{minWidth: 220}}>
                        <InputLabel id="nodo">Nodo</InputLabel>
                        <Select label="Nodo" id="nodo" labelId="nodo" value={idNode} onChange={e => setIdNode(e.target.value)} disabled={nodes.length === 0}>
                            {nodes.map(node => <MenuItem key={node.id} value={node.id}>{`${node.id} - ${node.name}`}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Box>
                <TextField type='number' label='Frecuencia de actualización' value={actualizationFrequency} onChange={e => setActualizationFrequency(e.target.value)}/>
                <h4>Tipo de serie</h4>
                <RadioGroup className='row' value={serieType} onChange={e => handleChangeSerieType(e)} >
                    {Object.keys(SERIES_TYPES).map(key => 
                        <FormControlLabel key={SERIES_TYPES[key]} value={SERIES_TYPES[key]} control={<Radio/>} label={SERIES_TYPES[key]}/>)}
                </RadioGroup>
                <Box className='row'>
                    <TextField label='ID Serie Redundante' type='number' value={redundantSerieID} onChange={e => setRedundantSerieID(e.target.value)} disabled={serieType !== SERIES_TYPES.OBSERVADA}/>
                    <IconButton size='large' onClick={() => { setRedundantSeriesIDs([...redundantSeriesIDs, redundantSerieID]); setRedundantSerieID('')}}>
                        <AddCircleOutlineIcon color='primary'/>
                    </IconButton>
                </Box>
                {redundantSeriesIDs.length === 0 ? null : 
                <Box className='row'>
                    <Typography margin={1}>Series redundantes: {redundantSeriesIDs.map(serie => serie + ', ')}</Typography>
                    <IconButton onClick={() => setRedundantSeriesIDs(redundantSeriesIDs.slice(0, -1))}>
                        <RemoveCircleOutlineIcon color='primary'/>
                    </IconButton>
                </Box>}  
                <TextField label='ID Calibrado' placeholder='ID Calibrado' type='number' value={calibrationID} onChange={e => setCalibrationID(e.target.value)} disabled={serieType !== SERIES_TYPES.PRONOSTICADA}/>
                <h4>¿Incluir validación de errores?</h4>
                <RadioGroup className='row' value={checkErrors} onChange={e => setCheckErrors(e.target.value)}>
                    <FormControlLabel label={'No'} value={false} control={<Radio/>}/>
                    <FormControlLabel label={'Sí'} value={true} control={<Radio/>}/>
                </RadioGroup>
                <h4>Métricas</h4>
                <FormGroup className='row'>
                {METRICS.map(metrica => 
                    <FormControlLabel label={metrica} key={metrica} 
                        control={<Checkbox checked={metrics[metrica]} onChange={e => setMetrics((metrics) => ({...metrics, [metrica]: e.target.checked}))}/>}/>)}
                </FormGroup>
                <h4>Umbrales</h4>
                <Box className='row'>
                    <TextField label='Límite inferior' type="number" value={lowerThreshold} onChange={e => setLowerThreshold(e.target.value)}/>
                    <TextField label='Límite superior' type="number" value={upperThreshold} onChange={e => setUpperThreshold(e.target.value)}/>
                </Box>
                <Button onClick={() => {handleAddSerie(serie)}}>Agregar serie</Button>
            </Box>
            <Box className='nodes'>
                <h3>Tus nodos y series</h3>
                <Line/>        
                <CreatedNodesAndSeries nodes={nodes} series={series} setSeries={setSeries} setNodes={setNodes} />
            </Box>
        </Box>
        </>
    );
}

const CreatedNodesAndSeries = ({nodes, series, setSeries, setNodes}) => {
    
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

    const metrics = (serie) => Object.keys(serie.metrics).filter(key => serie.metrics[key]);
    const popOverRow = (text) => <Typography sx={{p: 1}}>{text}</Typography>;

    return (
        <>
        {nodes.length === 0 ? 'Aún no ha agregado nodos. Cuando agregue nodos aparecerán aquí.': null}
        {nodes.map(node => 
        <Box className='node' key={node.id}>
            <h4 style={{margin: 0}}>{`Nodo ${node.id} - ${node.name}`}</h4>
            <Box className='row wrap'>
                {series.filter(serie => serie.idNode === node.id).length !== 0 ? null : 'Aún no ha agregado series a este nodo. Cuando agregue series aparecerán aquí.'}
                {series.map((serie, serieIndex) => serie.idNode !== node.id ? null : 
                <Box>
                    <Box key={serie.idSerie} className='serie' onMouseEnter={e => handlePopoverOpen(e, serie.idSerie)} onMouseLeave={() => handlePopoverClose()}>
                        <Typography>Serie</Typography>
                        <Typography>{serie.idSerie}</Typography>
                        <Button onClick={() => setSeries(series.filter((_, index) => serieIndex !== index))}>Eliminar</Button>
                    </Box>
                    <Popover
                        sx={{pointerEvents: 'none'}}
                        open={serie.idSerie === openedPopOverIndex}
                        anchorEl={anchorEl}
                        anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                        transformOrigin={{vertical: 'top', horizontal: 'left'}}
                        onClose={() => setAnchorEl(null)}
                        disableRestoreFocus
                    >
                        {popOverRow('Frecuencia de actualizacion: ' + serie.actualizationFrequency)}
                        {popOverRow('Tipo de serie: ' + serie.serieType)}
                        {popOverRow('Incluir validacion de errores: ' + (serie.checkErrors ? 'Sí' : 'No'))}
                        {metrics(serie).length > 0 ? popOverRow('Métricas: ' +  metrics(serie)) : null}
                        {serie.redundantSeriesIDs.length > 0? popOverRow('ID Series Redundantes: ' + serie.redundantSeriesIDs) : null}
                        {serie.calibrationID !== '' ? popOverRow('ID Calibrado: ' + serie.calibrationID) : null}
                        {serie.lowerThreshold !== '' && serie.upperThreshold !== '' ? popOverRow('Umbrales: ' + serie.lowerThreshold + ', ' + serie.upperThreshold): null}
                    </Popover>
                </Box>)}
            </Box>
            <Button variant="outlined" 
                onClick={() => {
                    setSeries(series.filter(serie => serie.idNode !== node.id));
                    setNodes(nodes.filter(node_ => node_.id !== node.id));
                }}>Eliminar nodo
            </Button>
        </Box>)}
        </>
    );
}