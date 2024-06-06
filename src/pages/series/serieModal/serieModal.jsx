import React from 'react';
import { useState, useEffect } from 'react';
import { SeriesPresenter } from '../../../presenters/seriesPresenter';
import { Box, Modal, Typography, Tooltip, Button } from '@mui/material';
import { BarChart, LineChart } from '@mui/x-charts';
import { DatePicker } from '@mui/x-date-pickers';
import { DataGrid } from '@mui/x-data-grid';
import { union } from '../../../utils/functions';
import { formatMinutes } from '../../../utils/dates';
import { ERROR_TYPE_CODE } from '../../../utils/constants'
import { notifyError } from '../../../utils/notification';
import NoConectionSplash from '../../../components/noConection/noConection';
import CircularProgressLoading from '../../../components/circularProgressLoading/circularProgressLoading';
import Line from '../../../components/line/line';
import dayjs from 'dayjs';
import './serieModal.css'

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

export const SerieModal = ({open, handleClose, serieId, serieType, calibrationId, configuredSerieId, checkErrors}) => {

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
  const [error, setError] = useState(false)

  const getSerieMetadataAndValues = async () => {
    if (open) {
      try{
        let serieMetadata = await presenter.getSerieMetadata(serieId, configuredSerieId, startDate, endDate);
        let serieValues = await presenter.getSerieValues(serieId, serieType, calibrationId, startDate, endDate);
        let serieErrors = await presenter.getSerieErrors(configuredSerieId, startDate, endDate, 1, 15);
        let serieDelays = checkErrors ? await presenter.getSerieDelays(configuredSerieId, startDate, endDate) : [];
        let redundancies = await presenter.getSerieRedundancies(configuredSerieId);
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
              let observedRelatedValues = await presenter.getSerieValues(serieMetadata.ObservedRelatedStreamId, 0, null, startDate, endDate);
              setObservedRelatedValues(observedRelatedValues.Streams);
            }
            break;
          default:
        }  
        setSerieMetadata(serieMetadata);
        setSerieErrors(serieErrors);
        setSeriesDelays(serieDelays.sort((a, b) => new Date(a.Date) - new Date(b.Date)));
        setRedundancies(redundancies.Redundancies ? redundancies.Redundancies : []);
    } catch(error) {
      notifyError(error)
      setError(true)
  } finally{
      setIsLoading(false);
  }
    }
  }

  useEffect(() => {
      getSerieMetadataAndValues();
  }, [open, startDate, endDate]);

  return (
      <Modal open={open} onClose={handleClose}>
      {isLoading ? <Box sx={style}><CircularProgressLoading /></Box>
      :(error? <Box sx={style}> <NoConectionSplash/> </Box>: 
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
          <TitleAndValue title="Última actualización" value={serieMetadata.LastUpdate ? serieMetadata.LastUpdate.replace('T', ' ').replace('Z', '') : 'No informado'}/>
          <TitleAndValue title="Actualización" value={`Cada ${formatMinutes(serieMetadata.UpdateFrequency)}`}/>
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
        {checkErrors ?
          <>
            <Line/>
            <Typography variant="h6" align='center'><b>Retardo acumulado por dia</b></Typography>
            <BarChart
              dataset={serieDelays}
              xAxis={[{ scaleType: 'band', dataKey: 'Date'}]}
              series={[{ dataKey: 'Average', label: 'Horas acumuladas', valueFormatter }]}
              yAxis = {[{label: 'Horas'}]}
              height = {300}
            /> 
          </> : null
        }
        
        <ErrorTable 
          serieErrors={serieErrors} 
          getErrors={async(page, pageSize) => {
            const _serieErrors = await presenter.getSerieErrors(configuredSerieId, startDate, endDate, page + 1, pageSize);
            setSerieErrors(_serieErrors);
          }}
          checkErrors={checkErrors}/>
        </div>
      </Box>
      )}
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
      {metrics.map(metric => metricsBox(
          metric.Name, 
          total ? (metric.Value/total * 100).toFixed(2)+ "%" : metric.Value.toFixed(2), 
          total && `Cantidad: ${metric.Value} - Total:  ${total}`
      ))}
    </Box>
    </>
  )
}

const SerieValuesChart = ({serieMetadata, serieValues, serieP05Values, serieP95Values, observedRelatedValues}) => {

  const [showThresholds, setShowTresholds] = useState(false);
  const [showErrorBands, setShowErrorBands] = useState(false);
  const [showLevels, setShowLevels] = useState(false);
  const [plotSeries, setPlotSeries] = useState([]);
  const [dataset, setDataset] = useState([]);
  const [xAxis, setXAxis] = useState([]);

  useEffect(() => {
    const _plotSeries = [];
    let unionSeries = [];
    let xAxisLength = serieValues?.length;
    const _valueFormatter = (altura) => (altura || altura === 0) ? altura + 'm' : 'No data';

    if (observedRelatedValues && observedRelatedValues.length > 0) {
      unionSeries = union(serieValues, observedRelatedValues, 'ValueObs');
      xAxisLength = unionSeries.length;
      _plotSeries.push({curve: "linear", dataKey: 'Value', label: 'Pronóstico', valueFormatter: _valueFormatter, showMark: false})
      _plotSeries.push({curve: "linear", dataKey: 'ValueObs', label: `Observado (${serieMetadata.ObservedRelatedStreamId})`, valueFormatter: _valueFormatter, showMark: true, color: '#222222', id: 'related'})
    } else if (serieValues && serieValues.length > 0){
      if (serieMetadata.StreamType === 0){
        _plotSeries.push({curve: "linear", dataKey: 'Value', label: 'Observado', valueFormatter: _valueFormatter, id: 'observed', color: '#222222'})
      } else if (serieMetadata.StreamType === 1){
        _plotSeries.push({curve: "linear", dataKey: 'Value', label: 'Pronosticado', valueFormatter: _valueFormatter, showMark: false})
      } else if (serieMetadata.StreamType === 2){
        _plotSeries.push({curve: "linear", dataKey: 'Value', label: 'Curado', valueFormatter: _valueFormatter, showMark: false})
      } 
    }

    if (serieP05Values && (serieP05Values.length > 0) && showErrorBands) {
      if (observedRelatedValues && observedRelatedValues.length > 0) {
        unionSeries = union(unionSeries, serieP05Values, 'ValueP05');
        xAxisLength = unionSeries.length;
        _plotSeries.push({curve: "linear", dataKey: 'ValueP05', label: 'P05', valueFormatter: _valueFormatter, showMark: false, color: '#2E9BFF'})
      } else {
        _plotSeries.push({curve: "linear", data: serieP05Values.map(point => point.Value), label: 'P05', _valueFormatter, showMark: false, color: '#2E9BFF'})
      }
    }

    if (serieP95Values && (serieP95Values.length > 0) && showErrorBands) {
      if (observedRelatedValues && observedRelatedValues.length > 0) {
        unionSeries = union(unionSeries, serieP95Values, 'ValueP95');
        xAxisLength = unionSeries.length;
        _plotSeries.push({curve: "linear", dataKey: 'ValueP95', label: 'P95', valueFormatter: _valueFormatter, showMark: false, color: '#2E9BFF'})
      } else {
        _plotSeries.push({curve: "linear", data: serieP95Values.map(point => point.Value), label: 'P95', valueFormatter: _valueFormatter, showMark: false, color: '#2E9BFF'})
      }
    }
    
    if (serieMetadata.EvacuationLevel && serieMetadata.AlertLevel && serieMetadata.LowWaterLevel && showLevels) {
      _plotSeries.push({curve: "linear", data: Array(xAxisLength).fill(serieMetadata.EvacuationLevel), label: 'Evacuación', showMark: false, color: '#e15759', valueFormatter: _valueFormatter});
      _plotSeries.push({curve: "linear", data: Array(xAxisLength).fill(serieMetadata.AlertLevel), label: 'Alerta', showMark: false, color:'#E6B855', valueFormatter: _valueFormatter});
      _plotSeries.push({curve: "linear", data: Array(xAxisLength).fill(serieMetadata.LowWaterLevel), label: 'Aguas bajas', showMark: false, color: '#45E0CC', valueFormatter: _valueFormatter});
    }

    if (showThresholds) {
      _plotSeries.push({curve: "linear", data: Array(xAxisLength).fill(serieMetadata.NormalLowerThreshold), label: 'Umbral inferior', showMark: false, color: '#8386FA', valueFormatter: _valueFormatter});
      _plotSeries.push({curve: "linear", data: Array(xAxisLength).fill(serieMetadata.NormalUpperThreshold), label: 'Umbral superior', showMark: false, color:'#A020F0', valueFormatter: _valueFormatter});
    }


    if (observedRelatedValues && observedRelatedValues.length > 0) {
      setXAxis(unionSeries.map(point => new Date(point.Time)))
      setDataset(unionSeries);
    } else if (serieValues && serieValues.length > 0) {
      setXAxis(serieValues.map(point => new Date(point.Time)))
      setDataset(serieValues);
    }

    setPlotSeries(_plotSeries);
  }, [showThresholds, showLevels, showErrorBands, observedRelatedValues, serieValues, serieP95Values, serieP05Values]) 
  

  return (
    <>
    { serieValues && serieValues.length > 0 ? 
      <>
      <Line/>
      <Typography variant="h6" align='center'><b>Valores de la serie</b></Typography>
      <LineChart
        dataset={dataset}
        xAxis={[{
          data: xAxis,
          scaleType: 'time',
          valueFormatter: (dateObject) => dateObject.toISOString().replace('T', ' ').slice(0, -8) + 'hs'
        }
      ]}
        series={plotSeries}
        height={300}
        grid={{horizontal: true}}
        sx={
          {
          '.MuiLineElement-series-related': { strokeWidth: 0 },
          '.MuiLineElement-series-observed': { strokeWidth: 0 },
          '.MuiLineElement-series-curated': { strokeWidth: 0 },
          '.MuiMarkElement-root': { scale: '0.5'}
        }
        }
        yAxis={[{min: -0.1}]}
        slotProps={{
          legend: {
            itemGap: 5,
            labelStyle: {
              fontSize: 12.5,
            },
          },
        }}
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
        <Button sx={{display: ((serieP05Values && serieP05Values.length > 0) || (serieP95Values && serieP95Values.length > 0)) ?  'inline' : 'none'}} 
          onClick={() => setShowErrorBands(!showErrorBands)}> 
          {!showErrorBands ? 'Mostrar bandas de error' : 'Ocultar bandas de error'} 
        </Button>
      </Box>
      </>
    : null}
      
    </>
  )
}

const ErrorTable = ({serieErrors, getErrors, checkErrors}) => {

  const [paginationModel, setPaginationModel] = useState({page: 0, pageSize: 15})

  useEffect(() => {
    getErrors(paginationModel.page, paginationModel.pageSize);
}, [paginationModel]);

  return (
  <>
    {checkErrors && (serieErrors.Content.length > 0) ?
      <>
        <Line/>
        <Typography variant="h6" align='center' sx={{mb: 2}}><b>Errores detectados</b></Typography>
        <DataGrid
          rows= {serieErrors.Content.map(error => ({...error, id:error.ErrorId}))}
          getRowHeight={() => 'auto'} 
          columns={
              [
                { field: 'ErrorTypeName', headerName: 'Tipo', width: 100, renderCell: (params) => {
                  return ERROR_TYPE_CODE[params.value];
                }},
                { field: 'DetectedDate', headerName: 'Fecha', width: 100, renderCell: (params) => {
                  return params.value.replace('T', ' ').slice(0, 16);
                }},
                { field: 'ExtraInfo', headerName: 'Informacion extra', minWidth: 250, flex: 1}
              ]
          }
          rowCount={serieErrors.Pageable.TotalElements}
          pageSizeOptions={[15]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          paginationMode="server"
          disableRowSelectionOnClick
      />
    </>
    : checkErrors && (serieErrors.Content.length === 0) ?
      <>
        <Line/>
        <Typography variant="h6" align='center' sx={{mb: 2}}><b>Errores detectados</b></Typography>
        <Typography align='center'sx={{marginLeft: 'auto', marginRight: 'auto'}}> No se detectaron errores para esta serie </Typography>
      </>
    : null
    }
  </>
  )
}