import React, {useEffect, useState} from 'react';
import {Container, Button, Select, FormControl, InputLabel, MenuItem, TextField} from '@mui/material';
import Line from '../../components/line/line';
import { SerieModal } from './serieModal/serieModal';
import Grid from '@mui/material/Unstable_Grid2';
import SeriesCard from '../../components/seriesCard/seriesCard';
import PaginationComponent from '../../components/pagination/paginationComponent';
import { CurrentConfiguration } from '../../components/currentConfiguration/currentConfiguration';
import CircularProgressLoading from '../../components/circularProgressLoading/circularProgressLoading';
import { SeriesPresenter } from '../../presenters/seriesPresenter';
import { StationPresenter } from '../../presenters/stationPresenter';
import { UtilsPresenter } from '../../presenters/utilsPresenter';
import { getConfigurationID } from '../../utils/storage';
import { useLocation } from "react-router-dom";
import NoResults from '../../components/noResults/noResults';
import NoConectionSplash from '../../components/noConection/noConection';
import { notifyError } from '../../utils/notification';

export const Series = () => {
    const seriesPresenter = new SeriesPresenter();
    const stationsPresenter = new StationPresenter();
    const utilsPresenter = new UtilsPresenter();
    const location = useLocation();
    const [error, setError] = useState(false)

    const [isLoading, setIsLoading] = useState(true);

    const [_streamId, _setStreamId] = useState(location?.state?.streamId ? location?.state?.streamId : '');
    const [streamId, setStreamId] = useState(location?.state?.streamId ? location?.state?.streamId : '');
    const [station, setStation] = useState(location?.state?.stationId ? location?.state?.stationId : null);
    const [node, setNode] = useState(location?.state?.nodeId ? location?.state?.nodeId : null);
    const [procedure, setProcedure] = useState(null);
    const [variable, setVariable] = useState(null);

    const [stations, setStations] = useState([]);
    const [procedures, setProcedures] = useState([]);
    const [variables, setVariables] = useState([]);
    const [nodes, setNodes] = useState([]);

    const [series, setSeries] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const [modalId, setModalId] = useState(null);

    const getAllStationNames = async() => {
        try{
            const stationNames = await stationsPresenter.getAllStationsNames();
            setStations(stationNames);
        } catch(error) {
            notifyError(error)
            setError(true)
        }
    }

    const getAllVariables = async() => {
        try{
            const variables = await utilsPresenter.getAllVariables();
            setVariables(variables);
        } catch(error) {
            notifyError(error)
            setError(true)
        }
    }

    const getAllProcedures = async() => {
        try{
            const procedures = await utilsPresenter.getAllProcedures();
            setProcedures(procedures);
        } catch(error) {
            notifyError(error)
            setError(true)
        }
    }

    const getAllNodes = async() => {
        try{
            const nodes = await utilsPresenter.getAllNodes();
            setNodes(nodes);
        } catch(error) {
            notifyError(error)
            setError(true)
        }
    }

	const getSeriePage = async(params) => {
		try{
            const data = await seriesPresenter.getSeriePage(page, params)
            setSeries(data.Content);
            setTotalPages(data.Pageable.Pages);
        } catch(error) {
            notifyError(error)
            setError(true)
        } finally{
            setIsLoading(false);
        }
	}

    const buildParams = () => {
        return {
			configurationId: getConfigurationID(),
			...(station) && {stationId:station},
			...(procedure) && {procId: procedure},
			...(variable) && {varId: variable},
            ...(node) && {nodeId: node},
            ...(Number(streamId)) && {streamId: streamId},
		}
    }

	useEffect(() => {
		getAllStationNames();
		getAllVariables();
        getAllNodes();
		getAllProcedures();
        const streamId = location?.state?.streamId;
        if (streamId) setStreamId(streamId); 
	}, []);

	useEffect(() => {
		setIsLoading(true);
		getSeriePage(buildParams());
	}, [variable, station, procedure, node, streamId]);

    const handleChangeStreamId = newStreamId => {
        _setStreamId(newStreamId);
    }

    const handleDeleteFilters = () => {
        setStation(null)
        setProcedure(null)
        setVariable(null)
        setNode(null)
        setStreamId('')
        _setStreamId('')
    }

    return (
    <>
		<h1> Series </h1>
        <CurrentConfiguration/>
        <Line/>
            <Container sx={{display:"flex", flexFlow:"wrap", alignItems:"center", justifyContent: 'center', m: 2}}>
                            <TextField 
                                label='Serie ID'
                                value={_streamId}
                                onChange={e => handleChangeStreamId(e.target.value)}
                                onKeyDown={(ev) => {
                                    if (ev.key === 'Enter') {
                                        setStreamId(ev.target.value)
                                    }
                                }}
                                sx={{m: 1}}
                            />
                            <SelectComponent 
                                label={'Variable'} 
                                currentValue={variable} 
                                setCurrentValue={setVariable} 
                                possibleValues={variables}/>
                            <SelectComponent 
                                label={'Procedimiento'} 
                                currentValue={procedure} 
                                setCurrentValue={setProcedure} 
                                possibleValues={procedures}/>
                            <SelectComponent 
                                label={'Estacion'} 
                                currentValue={station} 
                                setCurrentValue={setStation} 
                                possibleValues={stations}/>
                            <SelectComponent 
                                label={'Nodos'} 
                                currentValue={node} 
                                setCurrentValue={setNode} 
                                possibleValues={nodes}/>
							<Button sx={{alignSelf: 'center'}} variant="contained" onClick={()=>handleDeleteFilters()}>
                                Borrar filtros
                            </Button>
                    </Container>
            {isLoading ?
                <CircularProgressLoading />
            :(error? <NoConectionSplash/> : 
            (series.length>0? 
                <>
                    
                    <Container>
                        <Grid
                            container
                            spacing={5}
                            style={{justifyContent: "center", alignItems:"center"}}
                        >
                            {series.map((serie, index) => (
                                <Grid item key={index}>
                                    <SeriesCard serieData={serie} onClick={() => setModalId(serie.ConfiguredStreamId)}/>  
                                </Grid>))}
                        </Grid>
                    </Container>
                    {series.map((serie) => (
                        <SerieModal
                            open={serie.ConfiguredStreamId === modalId}
                            handleClose={() => setModalId(null)}
                            serieId={serie.StreamId}
                            configuredSerieId={serie.ConfiguredStreamId}
                            serieType={serie.StreamType}
                            calibrationId={serie.CalibrationId}
                            checkErrors={serie.CheckErrors}
                            />
                    ))}
                <PaginationComponent totalPages={totalPages} func={seriesPresenter.getSeriePage} params={buildParams()} setterData={setSeries} isStation={false}/>
            </>:
                    <NoResults textNoResults="series"/>
                )
            )}
        </>
    );
}

const SelectComponent = ({label, currentValue, setCurrentValue, possibleValues}) => {
	const formControlStyle = { m: 1, minWidth: 200, maxWidth: 300 };
	return (
		<FormControl sx={formControlStyle}>
			<InputLabel id={label}>{label}</InputLabel>
			<Select
					labelId={label}
					value={currentValue}
					label={label}
					onChange={(event) => setCurrentValue(event.target.value)}
			>
				{possibleValues.map((value) => (
						<MenuItem value={value.Id}>{value.Name}</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}