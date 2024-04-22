import React from 'react';
import { useState, useEffect } from 'react';
import { Box, CircularProgress, Modal, Typography, TextField, Button } from '@mui/material';
import { LineChart, BarChart } from '@mui/x-charts';
import { DatePicker } from '@mui/x-date-pickers';
import { SeriesPresenter } from '../../../presenters/seriesPresenter';
import Line from '../../../components/line/line';
import dayjs from 'dayjs';
import './serieModal.css'
import { dayjsToString } from '../../../utils/dates';

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
  const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day'));
  const [endDate, setEndDate] = useState(dayjs());

  const getSerieMetadataAndValues = async () => {
    if (open) {
      let serieMetadata = await presenter.getSerieMetadata(serieId, configuredSerieId, startDate, endDate);
      let serieValues = await presenter.getSerieValues(serieId, serieType, calibrationId, startDate, endDate);
      switch (serieType) {
        case 0:
        case 2:
          setSerieValues(serieValues.Streams);
          break;
        case 1:
          setSerieValues(serieValues.MainStreams);
          setSerieP05Values(serieValues.P05Streams);
          setSerieP95Values(serieValues.P95Streams);
          break;
      }
      setSerieMetadata(serieMetadata);
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
          <TitleAndValue title="Última actualización" value={"XXXXXXX"}/>
          <TitleAndValue title="Actualización" value={`Cada ${serieMetadata.UpdateFrequency} minutos`}/>
          {serieMetadata.CalibrationId ? <TitleAndValue title="ID Calibración" value={serieMetadata.CalibrationId}/> : null}
        </Box>
        {presenter.buildGeneralMetrics(serieMetadata.Metrics).length > 0 ? 
          section('Métricas generales', presenter.buildGeneralMetrics(serieMetadata.Metrics)) : null
        }
        {presenter.buildBehaviourMetrics(serieMetadata.Metrics).length > 0 ? 
          section('Comportamiento', presenter.buildBehaviourMetrics(serieMetadata.Metrics)) : null
        }
        
        <Line/>
        <Typography variant="h6" align='center'><b>Valores de la serie</b></Typography>
        <SerieValuesChart 
          serieMetadata={serieMetadata} 
          serieValues={serieValues} 
          serieP05Values={serieP05Values} 
          serieP95Values={serieP95Values}
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

const metricsBox = (title, subtitle) => {
  return (
   <Box sx={{height: 100, width: 200, border: '1.5px solid #E0E6ED',}}>
      <Typography align='center' sx={{mt: 2}}> {title} </Typography>
      <Typography align='center' sx={{mt: 2}}> {subtitle} </Typography>
   </Box>
  )
}

const section = (title, metrics) => {
  return (
    <>
    <Line/>
    <Typography variant="h6" align='center'><b>{title}</b></Typography>
    <Box className='row space-around wrap'>
      {metrics.map(metric => metricsBox(metric.Name, metric.Value))}
    </Box>
    </>
  )
}

const SerieValuesChart = ({serieMetadata, serieValues, serieP05Values, serieP95Values, startDate, endDate, setStartDate, setEndDate}) => {

  const plotSeries = [
    {curve: "linear", dataKey: 'Value', label: 'Valor', valueFormatter: (altura) => altura + 'm', showMark: false},
  ]

  if (serieValues && serieValues.length > 0) {
    plotSeries.push({curve: "linear", data: Array(serieValues.length).fill(serieMetadata.EvacuationLevel), label: 'Evacuacion', showMark: false, color: '#e15759', valueFormatter: (altura) => altura + 'm'});
    plotSeries.push({curve: "linear", data: Array(serieValues.length).fill(serieMetadata.AlertLevel), label: 'Alerta', showMark: false, color:'#e15759', valueFormatter: (altura) => altura + 'm'});
    plotSeries.push({curve: "linear", data: Array(serieValues.length).fill(serieMetadata.LowWaterLevel), label: 'Aguas bajas', showMark: false, color: '#e15759', valueFormatter: (altura) => altura + 'm'});
  }

  if (serieP05Values && serieP05Values.length > 0) {
    plotSeries.push({curve: "linear", data: serieP05Values.map(point => point.Value), label: 'P05', valueFormatter: (altura) => altura + 'm', showMark: false, color: '#2E9BFF'})
  }
  if (serieP95Values && serieP95Values.length > 0) {
    plotSeries.push({curve: "linear", data: serieP95Values.map(point => point.Value), label: 'P95', valueFormatter: (altura) => altura + 'm', showMark: false, color: '#2E9BFF'})
  }
  
  return (
    <>
    { serieValues && serieValues.length > 0 ? 
      <>
      <LineChart
        dataset={serieValues}
        xAxis={[{
          dataKey: 'Time',
          scaleType: 'band',
          valueFormatter: (date) => date.slice(0, 10) + ' \n' + date.slice(11, 16) +'hs'
        }]}
        series={plotSeries}
        height={300}
        grid={{vertical: true, horizontal: true}}
        yAxis={[{min: -0.5, max: 4}]}
      />
      </>
    : null}
      
    </>
  )
}