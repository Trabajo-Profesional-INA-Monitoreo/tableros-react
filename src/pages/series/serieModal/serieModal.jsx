import React from 'react';
import { useEffect } from 'react';
import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import './serieModal.css'
import Line from '../../../components/line/line';

const years = [
  new Date(2024, 2, 1),
  new Date(2024, 2, 2),
  new Date(2024, 2, 3),
  new Date(2024, 2, 4),
  new Date(2024, 2, 5),
  new Date(2024, 2, 6),
  new Date(2024, 2, 7),
];

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

export const SerieModal = ({open, handleClose, serieId}) => {
    useEffect(() => {}, []);
    let loading = false;
    return (    
        <Modal
        open={open}
        onClose={handleClose}
      >
        <Box sx={style}>
        <Typography variant="h6" align='center'><b>Serie | 103371 | Altura hidrométrica</b></Typography>
          <Line/>
          <div style={{height: '100%', overflow: "hidden", overflowY: "scroll", padding: 10, paddingTop: 0}}>
          <Box className={"row space-around"}>
            <Typography sx={{mt: 2, width: '35%'}}>
              <b>Procedimiento:</b> Medición directa
            </Typography>
            <Typography sx={{mt: 2, width: '35%'}}>
              <b>Unidad:</b> Metros
            </Typography>
          </Box>
          <Box className={"row space-around"}>
            <Typography sx={{mt: 2, width: '35%'}}>
              <b>Red:</b> Medición directa
            </Typography>
            <Typography sx={{mt: 2, width: '35%'}}>
              <b>Actualización:</b> Cada 4hs
            </Typography>
          </Box>
          <Line/>
          <Box className={"row space-around"}>
            <Typography sx={{mt: 2, width: '35%'}}>
              <b>Ultima actualización:</b> 18:32 9/11/2023
            </Typography>
            <Typography sx={{mt: 2, width: '35%'}}>
              <b>Tiempo de retraso:</b> 1 hora
            </Typography>
          </Box>
          <Box className={"row space-around"}>
            <Typography sx={{mt: 2, width: '35%'}}>
              <b>Observaciones:</b> 103419
            </Typography>
            <Typography sx={{mt: 2, width: '35%'}}>
              <b>Estacíon:</b> San Fernando
            </Typography>
          </Box>
          <Line/>
          <Typography variant="h6" align='center'><b>Métricas generales</b></Typography>
          <Box className='row space-around'>
            { metricsBox('Observaciones', '50') }
            { metricsBox('Media', '3') }
            { metricsBox('Moda', '3') }
            { metricsBox('Mediana', '3') }
          </Box>
          <Line/>
          <Typography variant="h6" align='center'><b>Comportamiento</b></Typography>
          <Box className='row space-around'>
            { metricsBox('Sobre nivel alerta', '50%') }
            { metricsBox('Sobre nivel de evacuación', '0%') }
            { metricsBox('Debajo aguas bajas', '3%') }
          </Box>
          <Line/>
          <Typography variant="h6" align='center'><b>Valores promedio por día</b></Typography>
          <LineChart
            xAxis={[
              {
                id: 'Years',
                data: years,
                scaleType: 'time',
                valueFormatter: (date) => date.toISOString().slice(0, 10),
                ticks: {
                  autoSkip: false,
                  maxRotation: 90,
                  minRotation: 90
              }
              },
            ]}
            series={[
              { curve: "linear", data: [1.8, 2.1, 4.3, 4, 6, 2.5, 2], label: 'Promedio', valueFormatter: (altura) => altura + 'm'},
              { curve: "linear", data: [7.9, 7.9, 7.9, 7.9, 7.9, 7.9, 7.9], label: 'Evacuacion', showMark: false, color: '#e15759', valueFormatter: (altura) => altura + 'm'},
              { curve: "linear", data: [6.5, 6.5, 6.5, 6.5, 6.5, 6.5, 6.5], label: 'Alerta', showMark: false, color:'#e15759', valueFormatter: (altura) => altura + 'm'},
              { curve: "linear", data: [1.9, 1.9, 1.9, 1.9, 1.9, 1.9, 1.9], label: 'Aguas bajas', showMark: false, color: '#e15759', valueFormatter: (altura) => altura + 'm'},
            ]}
            height={300}
            grid={{ vertical: true, horizontal: true }}
            yAxis={[
              {
                min: 0,
                max: 10
              },
            ]}

          />
          <Line/>
          <Typography variant="h6" align='center'><b>Calidad</b></Typography>
          <Box className='row space-around'>
            { metricsBox('Faltantes', '2%') }
          </Box>
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
      </Modal>
    );
}

const metricsBox = (title, subtitle) => {
  return (
   <Box sx={{height: 100, width: 200, border: '1.5px solid #E0E6ED',}}>
      <Typography align='center' sx={{mt: 2}}> {title} </Typography>
      <Typography align='center' sx={{mt: 2}}> {subtitle} </Typography>
   </Box> 
  )    
}