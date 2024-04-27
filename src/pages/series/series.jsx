import React, {useEffect, useState} from 'react';
import {Container, Button, Select, FormControl, InputLabel, MenuItem, Box, TextField} from '@mui/material';
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

export const Series = () => {

    const seriesPresenter = new SeriesPresenter();
    const stationsPresenter = new StationPresenter();
    const utilsPresenter = new UtilsPresenter();
    const location = useLocation();
    
    const [isLoading, setIsLoading] = useState(true);

    const [streamId, setStreamId] = useState('');
    const [station, setStation] = useState(null);
    const [procedure, setProcedure] = useState(null);
    const [variable, setVariable] = useState(null);

    const [stations, setStations] = useState([]);
    const [procedures, setProcedures] = useState([]);
    const [variables, setVariables] = useState([]);

    const [series, setSeries] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const [modalId, setModalId] = useState(null);

    const getAllStationNames = async() => {
        const stationNames = await stationsPresenter.getAllStationsNames();
        setStations(stationNames);
    }

    const getAllVariables = async() => {
        const variables = await utilsPresenter.getAllVariables();
        setVariables(variables);
    }
    const getAllProcedures = async() => {
        const procedures = await utilsPresenter.getAllProcedures();
        setProcedures(procedures);
    }

	const getSeriePage = async(params) => {
		const data = await seriesPresenter.getSeriePage(page, params)
		setSeries(data.Content);
		setTotalPages(data.Pageable.Pages);
		setIsLoading(false);
	}

	useEffect(() => {
		getAllStationNames();
		getAllVariables();
		getAllProcedures();
        const streamId = location?.state?.streamId;
        if (streamId) setStreamId(streamId); 
	}, []);

	useEffect(() => {
		const params = {
			configurationId: getConfigurationID(),
			...(station) && {stationId:station},
			...(procedure) && {procId: procedure},
			...(variable) && {varId: variable},
            ...(Number(streamId)) && {streamId: streamId},
		}
		setIsLoading(true);
		getSeriePage(params);
	}, [variable, station, procedure, streamId]);

    return (
      <>
		<h1> Series </h1>
        <CurrentConfiguration/>
        <Line/>
            {isLoading ? <CircularProgressLoading /> : 
                <>
                    <Container sx={{display:"flex", flexFlow:"wrap", alignItems:"center", justifyContent: 'center', m: 2}}>
                            <TextField 
                                label='Serie ID'
                                value={streamId}
                                onChange={e => setStreamId(e.target.value)}
                                autoFocus
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
							<Button sx={{alignSelf: 'center'}} variant="contained" onClick={()=>{
                                setStation(null)
                                setProcedure(null)
                                setVariable(null)
                                setStreamId('')
                            }}>
                                Borrar filtros
                            </Button>
                    </Container>
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
                            calibrationId={serie.CalibrationId}/>
                    ))}
            
                <PaginationComponent page={page} setPage={setPage} totalPages={totalPages}/>
            </>
            }
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