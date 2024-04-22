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
import { CONFIGURATION_VIEWS } from "../configuraciones";
import { CreateConfigurationPresenter } from "../../../presenters/createConfigurationPresenter";
import { METRICS, SERIES_TYPES } from "../../../utils/constants";
import './createConfigurations.css';
import { notifySuccess } from "../../../utils/notification";

export const CreateConfigurations = ({setCurrentView, configurationID, editable}) => {

    const presenter = new CreateConfigurationPresenter();

    const [configurationName, setConfigurationName] = useState('');
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
    const [relatedObservedStreamID, setRelatedObservedStreamID] = useState('');
    const [serieType, setSerieType] = useState(SERIES_TYPES.OBSERVADA);
    const [lowerThreshold, setLowerThreshold] = useState('');
    const [upperThreshold, setUpperThreshold] = useState('');
    const [metrics, setMetrics] = useState(() => {
        var metrics = {};
        METRICS.forEach((metric) => metrics[metric] = false);
        return metrics;
    })

    const [notificaciones, setNotificaciones] = useState(false)

    const serie = {
        idSerie: idSerie,
        idNode: idNode, 
        actualizationFrequency: actualizationFrequency,
        serieType: serieType,
        calibrationID: calibrationID,
        relatedObservedStreamID: relatedObservedStreamID,
        redundantSeriesIDs: redundantSeriesIDs,
        metrics: metrics,
        checkErrors: checkErrors,
        lowerThreshold: lowerThreshold,
        upperThreshold: upperThreshold
    }

    const handleAddSerie = () => {
        if (presenter.isValidStream(serie)) {
            notifySuccess('Serie agregada exitosamente');
            setSeries([...series, serie]);
        }
    }

    const handleAddNodo = () => {
        if (presenter.isValidNode(nodeName)) {
            notifySuccess('Nodo agregado exitosamente');
            setNodes([...nodes, {id: idNodeCounter, name: nodeName}]);
            setIdNodeCounter(idNodeCounter + 1);
        }
    }

    const handleAddConfiguracion = () => {
        if (presenter.isValidConfiguration(configurationName, nodes, series)) {
            const body = presenter.buildConfigurationBody(configurationName, nodes, series, notificaciones);
            if (configurationID & editable) {
                presenter.putConfiguration(body).then(_ => notifySuccess("Configuración modificada exitosamente"));
            } else {
                presenter.postConfiguration(body).then(_ => notifySuccess('Configuración creada exitosamente'));
            }  
        }
    }

    const handleChangeSerieType = (e) => {
        setRedundantSerieID('');
        setRedundantSeriesIDs([]);
        setCalibrationID('');
        setRelatedObservedStreamID('');
        setSerieType(e.target.value);
    }

    const getConfiguration = async () => {
        if (configurationID) {
            const response = await presenter.getConfiguration(configurationID);
            setNotificaciones(response.SendNotifications)
            setNodes(presenter.buildNodesFromConfiguration(response));
            setSeries(presenter.buildSeriesFromConfiguration(response));
            setConfigurationName(response.Name);
        }    
    }

    useEffect(() => {
        getConfiguration();
      }, [configurationID]);

    useEffect(() => {
        setIdSerie('');
        setIdNode('');
        setActualizationFrequency('');
        setRedundantSerieID('');
        setRedundantSeriesIDs([]);
        setCalibrationID('');
        setRelatedObservedStreamID('');
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
        <Box className='row'>
            <TextField label='Nombre de la configuración' value={configurationName} disabled={!editable} onChange={e => setConfigurationName(e.target.value)}/>
            <FormControlLabel label={"Notificarme en Telegram"} disabled={!editable} sx={{marginRight: 'auto'}}
                control={
                    <Checkbox
                    checked={notificaciones}
                    onChange={e =>setNotificaciones(e.target.checked)}
                    inputProps={{ 'aria-label': 'controlled' }}
                    />
                }
            />
            <Button className='button' onClick={() => setCurrentView(CONFIGURATION_VIEWS.LIST)}>Volver a lista de configuraciones</Button>
        </Box>
        <div className='button-container add-config' style={{display: editable ? 'block' : 'none'}}>
            <Button className='button' color='success' variant='contained' onClick={() => handleAddConfiguracion()}>Confirmar configuración</Button>
        </div>
        <Box className={editable ? 'row' : null}>           
            <Box className='form' style={{display: editable ? 'block' : 'none'}}>
                <h3>Nodos</h3>
                <Line/>
                <TextField label='Nombre del nodo' onChange={e => setNodeName(e.target.value)}/>
                <div className='button-container'><Button className='button' variant='outlined' color='success' onClick={() => handleAddNodo()}>Agregar nodo</Button></div>
                <h3>Series</h3>
                <Line/>
                <Box className='column-textfields'>
                <TextField type='number' label='Id Serie' value={idSerie} onChange={e => setIdSerie(e.target.value)}/>
                <FormControl sx={{minWidth: 220}}>
                    <InputLabel id="nodo">Nodo</InputLabel>
                    <Select label="Nodo" id="nodo" labelId="nodo" value={idNode} onChange={e => setIdNode(e.target.value)} disabled={nodes.length === 0}>
                        {nodes.map((node, index) => <MenuItem key={node.id} value={node.id}>{`${index+1} - ${node.name}`}</MenuItem>)}
                    </Select>
                </FormControl>
                <TextField type='number' label='Frecuencia de actualización' value={actualizationFrequency} onChange={e => setActualizationFrequency(e.target.value)} helperText="En minutos"/>
                </Box>
                <h4>Tipo de serie</h4>
                <RadioGroup value={serieType} onChange={e => handleChangeSerieType(e)} >
                    {Object.keys(SERIES_TYPES).map(key => 
                        <FormControlLabel key={SERIES_TYPES[key]} value={SERIES_TYPES[key]} control={<Radio/>} label={SERIES_TYPES[key]}/>)}
                </RadioGroup>
                <Box className='row'>
                    <TextField label='ID Serie Redundante' type='number' value={redundantSerieID} onChange={e => setRedundantSerieID(e.target.value)} disabled={serieType !== SERIES_TYPES.OBSERVADA}/>
                    <IconButton style={{display: serieType === SERIES_TYPES.OBSERVADA ? 'block' : 'none'}} size='large' onClick={() => { setRedundantSeriesIDs([...redundantSeriesIDs, redundantSerieID]); setRedundantSerieID('')}}>
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
                <Box className='column-textfields'>
                    <TextField label='ID Calibrado' placeholder='ID Calibrado' type='number' value={calibrationID} onChange={e => setCalibrationID(e.target.value)} disabled={serieType !== SERIES_TYPES.PRONOSTICADA}/>
                    <TextField label='ID Serie Observada asociada' placeholder='ID Serie Observada asociada' type='number' value={relatedObservedStreamID} onChange={e => setRelatedObservedStreamID(e.target.value)} disabled={serieType !== SERIES_TYPES.PRONOSTICADA}/>
                </Box>
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
                <Button variant='outlined' color='success' onClick={() => {handleAddSerie(serie)}}>Agregar serie</Button>
            </Box>
            <Box className='nodes'>
                <h3>Nodos y series en esta configuración</h3>
                <Line/>        
                <CreatedNodesAndSeries nodes={nodes} series={series} setSeries={setSeries} setNodes={setNodes} editable={editable}/>
            </Box>
        </Box>
        </>
    );
}



const CreatedNodesAndSeries = ({nodes, series, setSeries, setNodes, editable}) => {
    
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
        {nodes.map((node, index) => 
        <Box className='node' key={node.id}>
            <h4 style={{margin: 0}}>{`Nodo ${index + 1} - ${node.name}`}</h4>
            <Box className='row wrap'>
                {series.filter(serie => serie.idNode === node.id).length !== 0 ? null : 'Aún no ha agregado series a este nodo. Cuando agregue series aparecerán aquí.'}
                {series.map((serie, serieIndex) => serie.idNode !== node.id ? null : 
                <Box>
                    <Box key={serie.idSerie} className='serie' onMouseEnter={e => handlePopoverOpen(e, serie.idSerie)} onMouseLeave={() => handlePopoverClose()}>
                        <Typography  sx={{marginTop:1}} >Serie</Typography>
                        <Typography >{serie.idSerie}</Typography>
                        <Button style={{display: editable ? 'block' : 'none'}} onClick={() => setSeries(series.filter((_, index) => serieIndex !== index))}>Eliminar</Button>
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
                        {serie.relatedObservedStreamID !== '' ? popOverRow('ID Serie Observada asociada: ' + serie.relatedObservedStreamID) : null}
                        {serie.lowerThreshold !== '' && serie.upperThreshold !== '' ? popOverRow('Umbrales: ' + serie.lowerThreshold + ', ' + serie.upperThreshold): null}
                    </Popover>
                </Box>)}
            </Box>
            <Button variant="outlined" style={{display: editable ? 'block' : 'none'}}
                onClick={() => {
                    setSeries(series.filter(serie => serie.idNode !== node.id));
                    setNodes(nodes.filter(node_ => node_.id !== node.id));
                }}>Eliminar nodo
            </Button>
        </Box>)}
        </>
    );
}
