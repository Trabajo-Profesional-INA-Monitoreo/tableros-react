import { React, useState, useEffect } from "react";
import { Box, Button, TextField, FormGroup, FormControlLabel, Checkbox, Radio, RadioGroup, InputLabel, MenuItem, FormControl, Select, Popover, Typography, IconButton } from '@mui/material';
import Line from '../../../components/line/line';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import EditIcon from '@mui/icons-material/Edit';
import { CONFIGURATION_VIEWS } from "../configuraciones";
import { CreateConfigurationPresenter } from "../../../presenters/createConfigurationPresenter";
import { METRICS, SERIES_TYPES, INITIAL_METRICS_STATE } from "../../../utils/constants";
import { notifySuccess } from "../../../utils/notification";
import { formatMinutes, convertToMinutes, convertToHours, convertMinutes } from "../../../utils/dates";
import './createConfigurations.css';
import CircularProgressLoading from "../../../components/circularProgressLoading/circularProgressLoading";

export const CreateConfigurations = ({setCurrentView, configurationID, editable}) => {

    const presenter = new CreateConfigurationPresenter();

    const [configurationName, setConfigurationName] = useState('');
    const [shouldNotify, setShouldNotify] = useState(false)
    const [series, setSeries] = useState([]);
    const [nodes, setNodes] = useState([]);
    const [nodeName, setNodeName] = useState('');
    const [_idNodeCounter, _setIdNodeCounter] = useState(1);
    const [_idNode, _setIdNode] = useState('');
    const [idSerie, setIdSerie] = useState('');
    const [checkErrors, setCheckErrors] = useState(false);
    const [days, setDays] = useState(0);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [redundantSerieID, setRedundantSerieID] = useState('');
    const [redundantSeriesIDs, setRedundantSeriesIDs] = useState([]);
    const [calibrationID, setCalibrationID] = useState('');
    const [relatedObservedStreamID, setRelatedObservedStreamID] = useState('');
    const [forecastDays, setForecastDays] = useState(0);
    const [forecastHours, setForecastHours] = useState(0);
    const [serieType, setSerieType] = useState(SERIES_TYPES.OBSERVADA);
    const [lowerThreshold, setLowerThreshold] = useState('');
    const [upperThreshold, setUpperThreshold] = useState('');
    const [metrics, setMetrics] = useState(INITIAL_METRICS_STATE());
    const [indexSerieOnFocus, setIndexSerieOnFocus] = useState(null);
    const [loading, setLoading] = useState(false);

    const serie = {
        idSerie: idSerie,
        _idNode: _idNode, 
        actualizationFrequency: convertToMinutes(days, hours, minutes),
        serieType: serieType,
        calibrationID: calibrationID,
        relatedObservedStreamID: relatedObservedStreamID,
        redundantSeriesIDs: redundantSeriesIDs,
        forecastedRangeHours: convertToHours(forecastDays, forecastHours),
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

    const handleModifySerie = () => {
        if (presenter.isValidStream(serie)) {
            notifySuccess('Serie modificada exitosamente');
            const modifiedSeries = series.slice();
            modifiedSeries[indexSerieOnFocus] = serie;
            setSeries(modifiedSeries);
            setIndexSerieOnFocus(null);
        }
    }

    const handleAddNodo = () => {
        if (presenter.isValidNode(nodeName)) {
            notifySuccess('Nodo agregado exitosamente');
            setNodes([...nodes, {_id: _idNodeCounter, name: nodeName, mainStreamId: null}]);
            _setIdNodeCounter(_idNodeCounter + 1);
        }
    }

    const handleSetMainStream = (_idNode, serieId) => {
        const modifiedNodes = nodes.map(a => ({...a}));
        const modifiedNode = modifiedNodes.filter(node => node._id === _idNode)[0];
        if (modifiedNode['mainStreamId'] !== serieId){
            modifiedNode['mainStreamId'] = serieId;
        } else {
            modifiedNode['mainStreamId'] = null;
        }
        setNodes(modifiedNodes);
    }

    const handleAddConfiguracion = () => {
        if (presenter.isValidConfiguration(configurationName, nodes, series)) {
            const isPut = configurationID && editable;
            const body = presenter.buildConfigurationBody(configurationName, nodes, series, shouldNotify, configurationID, isPut);
            if (isPut) {
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
        setForecastDays(0);
        setForecastHours(0);
        if (e.target.value === SERIES_TYPES.SIMULADA) {
            setCheckErrors(false);
        }
    }

    const getConfiguration = async () => {
        if (configurationID) {
            setLoading(true);
            const response = await presenter.getConfiguration(configurationID);
            const nodes = await presenter.buildNodesFromConfiguration(response);
            const series = await presenter.buildSeriesFromConfiguration(response);
            setLoading(false);
            setShouldNotify(response.SendNotifications);
            setNodes(nodes);
            _setIdNodeCounter(nodes.length + 1);
            setSeries(series);
            setConfigurationName(response.Name);
        }    
    }

    useEffect(() => {
        getConfiguration();
      }, [configurationID]);

    useEffect(() => {
        clearFields();
      }, [series]);

    const clearFields = () => {
        setIdSerie('');
        _setIdNode('');
        setDays(0);
        setHours(0);
        setMinutes(0);
        setRedundantSerieID('');
        setRedundantSeriesIDs([]);
        setForecastDays(0);
        setForecastHours(0);
        setCalibrationID('');
        setRelatedObservedStreamID('');
        setSerieType(SERIES_TYPES.OBSERVADA);
        setCheckErrors(false);
        setMetrics(INITIAL_METRICS_STATE());
        setLowerThreshold('');
        setUpperThreshold('');
    }

    const setFocusOnSerie = (serie) => {
        setIdSerie(serie.idSerie);
        _setIdNode(serie._idNode);
        setDays(convertMinutes(serie.actualizationFrequency).days);
        setHours(convertMinutes(serie.actualizationFrequency).hours);
        setMinutes(convertMinutes(serie.actualizationFrequency).minutes);
        setRedundantSeriesIDs(serie.redundantSeriesIDs);
        setForecastDays(serie.forecastedRangeHours ? convertMinutes(serie.forecastedRangeHours * 60).days : 0);
        setForecastHours(serie.forecastedRangeHours ? convertMinutes(serie.forecastedRangeHours * 60).hours : 0);
        setCalibrationID(serie.calibrationID);
        setRelatedObservedStreamID(serie.relatedObservedStreamID);
        setSerieType(serie.serieType);
        setCheckErrors(serie.checkErrors);
        setMetrics(serie.metrics);
        setLowerThreshold(serie.lowerThreshold);
        setUpperThreshold(serie.upperThreshold);
    }

    const setIfValueInRange = (value, min, max, set) => {
        if (min <= Number(value) && Number(value) <= max) {
            set(String(Number(value)));
        } else if (Number(value) > max) {
            set(max);
        } else {
            set(min);
        }
    }

    return (
        <>
        <Box className='row'>
            <TextField label='Nombre de la configuración' value={configurationName} disabled={!editable} onChange={e => setConfigurationName(e.target.value)}/>
            <FormControlLabel label={"Notificarme en Telegram"} disabled={!editable} sx={{marginRight: 'auto'}}
                control={
                    <Checkbox
                    checked={shouldNotify}
                    onChange={e => setShouldNotify(e.target.checked)}/>
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
                <Box className='row-textfields'>
                    <Box sx={{minWidth: 220}}><TextField fullWidth type='number' label='Id Serie' value={idSerie} onChange={e => setIdSerie(e.target.value)}/></Box>
                    <FormControl sx={{minWidth: 220}}>
                        <InputLabel id="nodo">Nodo</InputLabel>
                        <Select label="Nodo" id="nodo" labelId="nodo" value={_idNode} onChange={e => _setIdNode(e.target.value)} disabled={nodes.length === 0}>
                            {nodes.map((node, index) => <MenuItem key={node._id} value={node._id}>{`${index+1} - ${node.name}`}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Box>
                <h4>Frecuencia de actualización</h4>
                <Box className='row-textfields'>
                    <TextField style={{minWidth: '100px', width: '30%'}}
                        inputProps={{min: 0, max: 365}} 
                        type='number'
                        label='Días'
                        value={days}
                        onChange={e => setDays(e.target.value >= 0 ? e.target.value : 0)} 
                        onBlur={e => setIfValueInRange(e.target.value, 0, 365, setDays)}
                    />
                    <TextField style={{minWidth: '100px', width: '30%'}}
                        inputProps={{min: 0, max: 23}}
                        type='number'
                        label='Horas'
                        value={hours}
                        onChange={e => setHours(e.target.value >= 0 ? e.target.value : 0)} 
                        onBlur={e => setIfValueInRange(e.target.value, 0, 23, setHours)}
                    />
                    <TextField style={{minWidth: '100px', width: '30%'}}
                        inputProps={{min: 0, max: 59}}
                        type='number'
                        label='Minutos'
                        value={minutes}
                        onChange={e => setMinutes(e.target.value >= 0 ? e.target.value : 0)} 
                        onBlur={e => setIfValueInRange(e.target.value, 0, 59, setMinutes)}
                    />
                </Box>
                <h4>Tipo de serie</h4>
                <RadioGroup className='row' value={serieType} onChange={e => handleChangeSerieType(e)}>
                    {Object.keys(SERIES_TYPES).map(key =>
                        <FormControlLabel key={SERIES_TYPES[key]} value={SERIES_TYPES[key]} control={<Radio/>} label={SERIES_TYPES[key]}/>)}
                </RadioGroup>
                <Box className='row'>
                    <TextField label='ID Serie Redundante' type='number' value={redundantSerieID} onChange={e => setRedundantSerieID(e.target.value)} disabled={serieType !== SERIES_TYPES.OBSERVADA}/>
                    <IconButton style={{display: serieType === SERIES_TYPES.OBSERVADA ? 'block' : 'none'}} size='large' onClick={() => { setRedundantSeriesIDs([...redundantSeriesIDs, parseInt(redundantSerieID)]); setRedundantSerieID('')}}>
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
                <Box className='row-textfields'>
                    <TextField label='ID Calibrado' placeholder='ID Calibrado' type='number' value={calibrationID} onChange={e => setCalibrationID(e.target.value)} disabled={serieType !== SERIES_TYPES.PRONOSTICADA}/>
                    <TextField label='ID Serie Observada asociada' placeholder='ID Serie Observada asociada' type='number' value={relatedObservedStreamID} onChange={e => setRelatedObservedStreamID(e.target.value)} disabled={serieType !== SERIES_TYPES.PRONOSTICADA}/>
                </Box>
                <h4>¿Incluir validación de errores?</h4>
                <RadioGroup className='row' value={checkErrors} onChange={e => setCheckErrors(e.target.value)}>
                    <FormControlLabel label={'No'} value={false} control={<Radio/>} disabled={serieType === SERIES_TYPES.SIMULADA}/>
                    <FormControlLabel label={'Sí'} value={true} control={<Radio/>} disabled={serieType === SERIES_TYPES.SIMULADA}/>
                </RadioGroup>
                <h4>Rango de pronóstico</h4>
                <Box className='row-textfields'>
                    <TextField style={{minWidth: '100px', width: '48%'}}
                        inputProps={{min: 0, max: 365}} 
                        type='number'
                        label='Días'
                        value={forecastDays}
                        disabled={serieType !== SERIES_TYPES.PRONOSTICADA}
                        onChange={e => setForecastDays(e.target.value >= 0 ? e.target.value : 0)} 
                        onBlur={e => setIfValueInRange(e.target.value, 0, 365, setForecastDays)}
                    />
                    <TextField style={{minWidth: '100px', width: '48%'}}
                        inputProps={{min: 0, max: 23}}
                        type='number'
                        label='Horas'
                        value={forecastHours}
                        disabled={serieType !== SERIES_TYPES.PRONOSTICADA}
                        onChange={e => setForecastHours(e.target.value >= 0 ? e.target.value : 0)} 
                        onBlur={e => setIfValueInRange(e.target.value, 0, 23, setForecastHours)}
                    />
                </Box>
                <h4>Métricas</h4>
                <FormGroup className='row'>
                {METRICS.map(metric => 
                    <FormControlLabel label={metric} key={metric} 
                        control={<Checkbox checked={metrics[metric]} onClick={e => setMetrics({...metrics, [metric]: e.target.checked})}/>}/>)}
                </FormGroup>
                <h4>Umbrales</h4>
                <Box className='row'>
                    <TextField label='Límite inferior' type="number" value={lowerThreshold} onChange={e => setLowerThreshold(e.target.value)}/>
                    <TextField label='Límite superior' type="number" value={upperThreshold} onChange={e => setUpperThreshold(e.target.value)}/>
                </Box>
                {indexSerieOnFocus === null ?
                    <Button variant='outlined' color='success' onClick={() => {handleAddSerie(serie)}}>Agregar serie</Button> :
                    <Box className='row'>
                        <Button variant='outlined' color='success' onClick={() => {handleModifySerie(serie)}}>Confirmar cambios</Button>
                        <Button variant='outlined' color='error' onClick={() => {clearFields(); setIndexSerieOnFocus(null);}}>Cancelar modificación</Button>
                    </Box>
                }
            </Box>
            <Box className='nodes' sx={editable ? null : {width: '100% !important'}}   >
                <h3>Nodos y series en esta configuración</h3>
                <Line/>        
                <CreatedNodesAndSeries
                    nodes={nodes} 
                    series={series} 
                    setSeries={setSeries} 
                    setNodes={setNodes} 
                    editable={editable} 
                    setFocusOnSerie={setFocusOnSerie}
                    setIndexSerieOnFocus={setIndexSerieOnFocus}
                    indexSerieOnFocus={indexSerieOnFocus}
                    clearFields={clearFields}
                    handleSetMainStream={handleSetMainStream}
                    loading={loading}
                    />
            </Box>
        </Box>
        </>
    );
}

const CreatedNodesAndSeries = ({nodes, series, setSeries, setNodes, editable, setFocusOnSerie, setIndexSerieOnFocus, clearFields, indexSerieOnFocus, handleSetMainStream, loading}) => {
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
        {loading ? <CircularProgressLoading /> : null}
        {(nodes.length === 0 && !loading) ? 'Aún no ha agregado nodos. Cuando agregue nodos aparecerán aquí.': null}
        {nodes.map((node, index) => 
        <Box key={node._id}>
            <h4 style={{margin: 0}}>{`Nodo ${index + 1} - ${node.name}`}</h4>
            <Box className='row wrap'>
                {series.filter(serie => serie._idNode === node._id).length !== 0 ? null : 'Aún no ha agregado series a este nodo. Cuando agregue series aparecerán aquí.'}
                {series.map((serie, serieIndex) => serie._idNode !== node._id ? null : 
                <Box>
                    <Box key={serie.idSerie} className={'serie '+ (indexSerieOnFocus===serieIndex ? 'blue-border':'')}>
                        <Typography sx={{marginTop:1}} onMouseEnter={e => handlePopoverOpen(e, serie.idSerie)} onMouseLeave={() => handlePopoverClose()}><b>{serie.idSerie}</b></Typography>
                        <Box className='row'>
                            <IconButton style={{display: editable ? 'block' : 'none'}} onClick={() => {setSeries(series.filter((_, index) => serieIndex !== index)); setIndexSerieOnFocus(null); clearFields()}}>
                                <DeleteOutlineIcon color='primary'/>
                            </IconButton>
                            <IconButton style={{display: editable ? 'block' : 'none'}} onClick={() => {setFocusOnSerie(serie); setIndexSerieOnFocus(serieIndex)}}>
                                <EditIcon color='primary'/>
                            </IconButton>
                            <IconButton disabled={!editable} onClick={() => {if (editable) { handleSetMainStream(serie._idNode, serie.idSerie) }}}>
                                {node.mainStreamId === serie.idSerie ? <StarIcon color={editable ? 'primary' : 'disabled'}/> : <StarOutlineIcon color={editable ? 'primary' : 'disabled'}/>}
                            </IconButton>
                        </Box>
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
                        {popOverRow('Frecuencia de actualización: ' + formatMinutes(Number(serie.actualizationFrequency)) )}
                        {popOverRow('Tipo de serie: ' + serie.serieType)}
                        {popOverRow('Incluir validación de errores: ' + (serie.checkErrors ? 'Sí' : 'No'))}
                        {serie.forecastedRangeHours ? popOverRow('Rango de pronóstico: ' + formatMinutes(Number(serie.forecastedRangeHours * 60)) ) : null}
                        {metrics(serie).length > 0 ? popOverRow('Métricas: ' +  metrics(serie)) : null}
                        {serie.redundantSeriesIDs.length > 0? popOverRow('ID Series Redundantes: ' + serie.redundantSeriesIDs) : null}
                        {serie.calibrationID !== '' ? popOverRow('ID Calibrado: ' + serie.calibrationID) : null}
                        {!!serie.relatedObservedStreamID ? popOverRow('ID Serie Observada asociada: ' + serie.relatedObservedStreamID) : null}
                        {serie.lowerThreshold !== '' && serie.upperThreshold !== '' ? popOverRow('Umbrales: ' + serie.lowerThreshold + ', ' + serie.upperThreshold): null}
                        {serie.RedundanciesIds && serie.popOverRow(`Series redundantes: ' + ${serie.RedundanciesIds}`)}
                    </Popover>
                </Box>)}
            </Box>
            <Button variant="outlined" style={{display: editable ? 'block' : 'none'}}
                onClick={() => {
                    setSeries(series.filter(serie => serie._idNode !== node._id));
                    setNodes(nodes.filter(_node => _node._id !== node._id));
                    setIndexSerieOnFocus(null);
                }}>Eliminar nodo
            </Button>
            <Line />    
        </Box>)}
        </>
    );
}
