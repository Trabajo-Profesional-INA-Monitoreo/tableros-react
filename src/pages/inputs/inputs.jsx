import React from 'react';
import { Box, CircularProgress, Button} from '@mui/material';
import { useEffect } from 'react';
import { InputsPresenter } from '../../presenters/inputsPresenter';
import { CurrentConfiguration } from '../../components/currentConfiguration/currentConfiguration';
import Line from '../../components/line/line';
import CircularProgressWithLabel from '../../components/circularProgressWithLabel/circularProgressWithLabel';


export const Inputs = () => {

    const presenter = new InputsPresenter();
    
    useEffect( () => {
    }, []);

    let loading= true;

    return (    
        loading ? (
        <div>
            <h1> Tablero de inputs </h1>
            <CurrentConfiguration/>
            <Line/>
            <h2> Metricas </h2>

            <Box sx={{ display:"flex", flexDirection: 'row', justifyContent:"space-around", alignContent:"center", alignItems:"center", marginBottom:"5%"}}>
                <Box sx={{display:"flex", flexDirection: 'column', alignItems:"center"}}>

                <h3>Actualizaciones</h3>
                <CircularProgressWithLabel text="series no tuvieron retrasos" percentage={90} color="success"/>
                </Box>
                <Box sx={{display:"flex", flexDirection: 'column', alignItems:"center"}}>

                <h3>Datos Nulos</h3>
                <CircularProgressWithLabel text="series no tuvieron datos nulos" percentage={80} color="warning"/>
                </Box>
                <Box sx={{display:"flex", flexDirection: 'column', alignItems:"center"}}>

                <h3>Curaciones</h3>
                <CircularProgressWithLabel text="series fueron curadas correctamente" percentage={70} color="error"/>
                </Box>

            </Box>
            
            <Line/>

            <h2> Monitoreo </h2>

            <Box sx={{ display:"flex", flexDirection: 'row', justifyContent:"space-around", alignContent:"center", alignItems:"center", marginBottom:"5%"}}>
            <Box sx={{display:"flex", flexDirection: 'column', alignItems:"center"}}>

                <h3>Nivel de alerta</h3>
                <CircularProgressWithLabel text=" observaciones por debajo del nivel de alerta " percentage={90} color="success"/>
                </Box>
                <Box sx={{display:"flex", flexDirection: 'column', alignItems:"center"}}>

                <h3>Nivel de evacuación</h3>
                <CircularProgressWithLabel text="observaciones  debajo del nivel de evacuacion" percentage={80} color="warning"/>
                </Box>
                <Box sx={{display:"flex", flexDirection: 'column', alignItems:"center"}}>

                <h3>Nivel de aguas bajas</h3>
                <CircularProgressWithLabel text="observaciones supera el nivel de aguas bajas" percentage={70} color="error"/>
                </Box>

            </Box>

            <Line/>
            
            <h2> Informacion General </h2>
            <box style={{display:"flex", justifyContent: "space-around", margin: "5%" }}>
                <Button variant="outlined" size="large">{presenter.getCantSeries() + " Series"}</Button>
                <Button variant="outlined" size="large">{presenter.getCantEstaciones() + " Estaciones"}</Button>
                <Button variant="outlined" size="large">{presenter.getCantRedes() + " Redes"}</Button>
            </box>


        </div>
        ) : <CircularProgress 
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                margin: 'auto',
                width: '10vw'
            }}
        />
    ) ;
}