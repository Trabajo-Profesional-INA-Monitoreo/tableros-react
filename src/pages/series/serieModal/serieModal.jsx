import React from 'react';
import { useState, useEffect } from 'react';
import { SeriesPresenter } from '../../../presenters/seriesPresenter';
import { Box, CircularProgress, Modal, Typography, Tooltip, Button, TextField } from '@mui/material';
import { LineChart, BarChart } from '@mui/x-charts';
import { DatePicker } from '@mui/x-date-pickers';
import { DataGrid } from '@mui/x-data-grid';
import Line from '../../../components/line/line';
import dayjs from 'dayjs';
import './serieModal.css'

const loadingStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  margin: 'auto',
  width: '10vw'
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    height: '90%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  };

  const chartSetting = {
    yAxis: [
      {
        label: 'Horas',
      },
    ],
    height: 300,
  };
  const dataset = [
    {
      retardo: 21,
      month: '2024-04-01',
    },
    {
      retardo: 28,
      month: '2024-04-02',
    },
    {
      retardo: 41,
      month: '2024-04-03',
    },
    {
      retardo: 73,
      month: '2024-04-04',
    },
    {
      retardo: 99,
      month: '2024-04-05',
    },
    {
      retardo: 144,
      month: '2024-04-06',
    },
    {
      retardo: 319,
      month: '2024-04-07',
    }
  ];
  
  const valueFormatter = (value) => `${value}h`;

export const SerieModal = ({open, handleClose, serieId, serieType, calibrationId, configuredSerieId}) => {

  const presenter = new SeriesPresenter();

  const [isLoading, setIsLoading] = useState(true);
  const [serieMetadata, setSerieMetadata] = useState({});
  const [serieValues, setSerieValues] = useState([]);
  const [serieP05Values, setSerieP05Values] = useState([]);
  const [serieP95Values, setSerieP95Values] = useState([]);
  const [observedRelatedValues, setObservedRelatedValues] = useState([]);
  const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day'));
  const [endDate, setEndDate] = useState(dayjs());
  const [redundancies, setRedundancies] = useState([]);
  const [serieErrors, setSerieErrors] = useState({});

  const getSerieMetadataAndValues = async () => {
    if (open) {
      let serieMetadata = await presenter.getSerieMetadata(serieId, configuredSerieId, startDate, endDate);
      let serieValues = await presenter.getSerieValues(serieId, serieType, calibrationId, startDate, endDate);
      let serieErrors = await presenter.getSerieErrors(configuredSerieId, startDate, endDate);
      let redundancies = await presenter.getSerieRedundancies(configuredSerieId);
      if (serieMetadata.ObservedRelatedStreamId) {
        let observedRelatedValues = await presenter.getSerieValues(serieMetadata.ObservedRelatedStreamId, 0, null, startDate, endDate);
        setObservedRelatedValues(observedRelatedValues.Streams);
      }
      switch (serieType) {
        case 0:
        case 2:
          setSerieValues(serieValues.Streams);
          break;
        case 1:
          setSerieValues(serieValues.MainStreams);
          setSerieP05Values(serieValues.P05Streams);
          setSerieP95Values(serieValues.P95Streams);
          if (serieMetadata.ObservedRelatedStreamId) {
            
          }
          break;
        default:
      }  
      setSerieMetadata(serieMetadata);
      setSerieErrors(serieErrors);
      setRedundancies(redundancies.Redundancies ? redundancies.Redundancies : []);
      setIsLoading(false);
    }
  }

  useEffect(() => {
      getSerieMetadataAndValues();
  }, [open]);

  useEffect(() => {
    getSerieMetadataAndValues();
  }, [startDate, endDate]);

  return (
      <Modal open={open} onClose={handleClose}>
      {isLoading ? <Box sx={style}><CircularProgress style={loadingStyle}></CircularProgress></Box>:
      <Box sx={style}>
      <Box className='row'>
        <Typography variant="h6" align='center'sx={{marginLeft: 'auto', marginRight: 'auto'}}><b>{serieMetadata.Station} | {serieId}</b></Typography>
        <DatePicker 
          label="Desde"
          inputFormat="YYYY/MM/DD"
          value={startDate}
          onChange = {value => setStartDate(value)}
          maxDate={dayjs()}
          sx={{maxWidth: '150px'}}
        />
        <DatePicker 
            label="Hasta"
            inputFormat="YYYY/MM/DD"
            value={endDate}
            onChange = {e => setEndDate(e)}
            maxDate={dayjs()}
            sx={{maxWidth: '150px'}}
        />
      </Box>
        <Line/>
        <div style={{height: '100%', overflow: "hidden", overflowY: "scroll", padding: 10, paddingTop: 0}}>
        <Box className={"row space-around wrap"}>
          <TitleAndValue title="Variable" value={serieMetadata.VarName}/>
          <TitleAndValue title="Unidad" value={serieMetadata.Unit}/> 
        </Box>
        <Box className={"row space-around wrap"}>
          <TitleAndValue title="Procedimiento" value={`${serieMetadata.ProcId} - ${serieMetadata.Procedure}`}/>
          <TitleAndValue title="Owner" value={serieMetadata.Owner}/>
        </Box>
        <Line/>
        <Box className={"row space-around wrap"}>
          {presenter.buildObservationsMetric(serieMetadata.Metrics).length > 0 ?
            <TitleAndValue title="Observaciones" value={presenter.buildObservationsMetric(serieMetadata.Metrics)[0].Value}/> : null
          }
          <TitleAndValue title="Estación" value={serieMetadata.Station}/>
        </Box>
        <Box className={"row space-around wrap"}>
          <TitleAndValue title="Última actualización" value={serieMetadata.LastUpdate ? serieMetadata.LastUpdate : 'No informado'}/>
          <TitleAndValue title="Actualización" value={`Cada ${serieMetadata.UpdateFrequency} minutos`}/>
          {serieMetadata.CalibrationId ? <TitleAndValue title="ID Calibración" value={serieMetadata.CalibrationId}/> : null}
        </Box>
        {redundancies.length === 0 ? null : 
          <Box>
            <Line/>
            <Typography variant="h6" align='center'><b>Series redundantes</b></Typography>
            <Box className='row space-around wrap'>        
              {redundancies.map(redundancyId => redundancyBox(redundancyId))}
            </Box>
          </Box>
        }
        {presenter.buildGeneralMetrics(serieMetadata.Metrics).length > 0 ? 
          section('Métricas generales', presenter.buildGeneralMetrics(serieMetadata.Metrics)) : null
        }
        {presenter.buildBehaviourMetrics(serieMetadata.Metrics).length > 0 ? 
          section('Comportamiento', presenter.buildBehaviourMetrics(serieMetadata.Metrics), presenter.getTotalBehaviourMetrics(serieMetadata.Metrics)) : null
        }    
        <SerieValuesChart 
          serieMetadata={serieMetadata} 
          serieValues={serieValues} 
          serieP05Values={serieP05Values} 
          serieP95Values={serieP95Values}
          observedRelatedValues={observedRelatedValues}
          />
        {presenter.buildNullsMetric(serieMetadata.Metrics).length > 0 ? 
          section("Calidad", presenter.buildNullsMetric(serieMetadata.Metrics)) : null
        }
        <Line/>
        <Typography variant="h6" align='center'><b>Retardo acumulado por dia</b></Typography>
        <BarChart
          dataset={dataset}
          xAxis={[{ scaleType: 'band', dataKey: 'month'}]}
          series={[{ dataKey: 'retardo', label: 'Horas acumuladas', valueFormatter }]}
          {...chartSetting}
        />
        <ErrorTable serieErrors={serieErrors}/>
        </div>
      </Box>
      }
    </Modal>
  );
}

const TitleAndValue = ({title, value}) => {
  return (
    <Typography align={'center'} sx={{mt: 2, width: 200}}>
      <b>{title}:</b> {value}
    </Typography>
  )
}

const metricsBox = (title, subtitle, helper) => {
  return (
		<Tooltip title={helper}>
			<Box sx={{height: 100, width: 200, border: '1.5px solid #E0E6ED'}}>
					<Typography align='center' sx={{mt: 2}}> {title} </Typography>
					<Typography align='center' sx={{padding:1}}> {subtitle} </Typography>
			</Box>
		</Tooltip>
  )
}

const redundancyBox = (redundancyId) => {
  return (
			<Box sx={{height: 100, width: 200, border: '1.5px solid #E0E6ED'}}>
					<Typography align='center' sx={{mt: 2}}> Serie </Typography>
					<Typography align='center' sx={{padding:1}}> {redundancyId} </Typography>
			</Box>
  )
}

const section = (title, metrics, total) => {
  return (
    <>
    <Line/>
    <Typography variant="h6" align='center'><b>{title}</b></Typography>
    <Box className='row space-around wrap'>
      {metrics.map(metric => metricsBox(metric.Name, total? (metric.Value/total * 100).toFixed(1)+"%" : metric.Value,total&& `Cantidad: ${metric.Value} - Total:  ${total}`))}
    </Box>
    </>
  )
}

const SerieValuesChart = ({serieMetadata, serieValues, serieP05Values, serieP95Values, observedRelatedValues}) => {

  const [showThresholds, setShowTresholds] = useState(false);
  const [showLevels, setShowLevels] = useState(false);
  const [plotSeries, setPlotSeries] = useState([])
  

  useEffect(() => {
    const _plotSeries = [
      {curve: "linear", dataKey: 'Value', label: 'Valor', valueFormatter: (altura) => altura + 'm', showMark: false},
    ]

    if (serieMetadata.EvacuationLevel && serieMetadata.AlertLevel && serieMetadata.LowWaterLevel && showLevels) {
      _plotSeries.push({curve: "linear", data: Array(serieValues.length).fill(serieMetadata.EvacuationLevel), label: 'Evacuacion', showMark: false, color: '#e15759', valueFormatter: (altura) => altura + 'm'});
      _plotSeries.push({curve: "linear", data: Array(serieValues.length).fill(serieMetadata.AlertLevel), label: 'Alerta', showMark: false, color:'#e15759', valueFormatter: (altura) => altura + 'm'});
      _plotSeries.push({curve: "linear", data: Array(serieValues.length).fill(serieMetadata.LowWaterLevel), label: 'Aguas bajas', showMark: false, color: '#e15759', valueFormatter: (altura) => altura + 'm'});
    }

    if (showThresholds) {
      _plotSeries.push({curve: "linear", data: Array(serieValues.length).fill(serieMetadata.NormalLowerThreshold), label: 'Umbral inferior', showMark: false, color: '#A020F0', valueFormatter: (altura) => altura + 'm'});
      _plotSeries.push({curve: "linear", data: Array(serieValues.length).fill(serieMetadata.NormalUpperThreshold), label: 'Umbral superior', showMark: false, color:'#A020F0', valueFormatter: (altura) => altura + 'm'});
    }
  
    if (serieP05Values && serieP05Values.length > 0) {
      _plotSeries.push({curve: "linear", data: serieP05Values.map(point => point.Value), label: 'P05', valueFormatter: (altura) => altura + 'm', showMark: false, color: '#2E9BFF'})
    }
    if (serieP95Values && serieP95Values.length > 0) {
      _plotSeries.push({curve: "linear", data: serieP95Values.map(point => point.Value), label: 'P95', valueFormatter: (altura) => altura + 'm', showMark: false, color: '#2E9BFF'})
    }

    if (observedRelatedValues && observedRelatedValues.length > 0) {
      //_plotSeries.push({xAxisKey: 'axis2', curve: "linear", data: observedRelatedValues.map(point => point.Value), label: 'Observada relacionada  ', valueFormatter: (altura) => altura + 'm', showMark: false, color: '#2E9BFF'})
    }

    setPlotSeries(_plotSeries);
  }, [showThresholds, showLevels]) 
  

  return (
    <>
    { serieValues && serieValues.length > 0 ? 
      <>
      <Line/>
      <Typography variant="h6" align='center'><b>Valores de la serie</b></Typography>
      <LineChart
        dataset={serieValues}
        xAxis={[{
          id: 'axis1',
          dataKey: 'Time',
          scaleType: 'band',
          valueFormatter: (date) => date.slice(0, 10) + ' \n' + date.slice(11, 16) +'hs'
        },
        {
          id: 'axis2',
          data: observedRelatedValues.map(point => point.Time),
          scaleType: 'band',
          valueFormatter: (date) => date.slice(0, 10) + ' \n' + date.slice(11, 16) +'hs'
        }
      ]}
        series={plotSeries}
        height={300}
        grid={{horizontal: true}}
        //yAxis={[{min: -0.5, max: 7}]}
      />
      <Box className='row space-around wrap'>
        <Button
          onClick={() => setShowTresholds(!showThresholds)}> 
          {!showThresholds ? 'Mostrar umbrales' : 'Ocultar umbrales'}
        </Button>
        <Button sx={{display: serieMetadata.EvacuationLevel && serieMetadata.AlertLevel && serieMetadata.LowWaterLevel ? 'inline' : 'none'}} 
          onClick={() => setShowLevels(!showLevels)}> 
          {!showLevels ? 'Mostrar niveles' : 'Ocultar niveles'} 
        </Button>
      </Box>
      </>
    : null}
      
    </>
  )
}

const ErrorTable = ({serieErrors}) => {

  return (
  <>
      <Line/>
      <Typography variant="h6" align='center' sx={{mb: 2}}><b>Errores detectados</b></Typography>

      {serieErrors.Content.length > 0 ? 
          <DataGrid
          rows= {serieErrors.Content.map((error, index) => ({...error, id:error.ErrorId}))}
          getRowHeight={() => 'auto'} 
          columns={
              [
                  { field: 'ErrorId', headerName: 'ID', width: 25 },
                  { field: 'DetectedDate', headerName: 'Fecha de detección', width: 150},
                  { field: 'ErrorTypeId', headerName: 'Tipo', width: 25},
                  { field: 'ExtraInfo', headerName: 'Informacion extra', minWidth: 150, flex: 1}
              ]
          }
          initialState={{
              pagination: {
                  paginationModel: {
                  pageSize: 15,
                  },
              },
          }}
          pageSizeOptions={[15]}
          disableRowSelectionOnClick
      /> : <Typography align='center'sx={{marginLeft: 'auto', marginRight: 'auto'}}> No se detectaron errores para esta serie </Typography>}
      
    </>
  )
}