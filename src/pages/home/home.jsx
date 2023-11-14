import React from 'react';
import { Box, CircularProgress} from '@mui/material';
import CircularProgressWithLabel from '../../components/circularProgressWithLabel/circularProgressWithLabel';
import { useEffect, useState } from 'react';


export const Home = () => {

    useEffect( () => {
    }, []);
    let loading= true;
    return (    
        loading ? 
        <div>
            <h1> Tablero de inputs </h1>

            <h2> Metricas </h2>
            <Box sx={{ display:"flex", flexDirection: 'row', justifyContent:"space-around", alignContent:"center", alignItems:"center"}}>
                <Box>

                <h3>Actualizaciones</h3>
                <CircularProgressWithLabel text="series no tuvieron retrasos" percentage={90} color="success"/>
                </Box>
                <Box>

                <h3>Datos Nulos</h3>
                <CircularProgressWithLabel text="series no tuvieron datos nulos" percentage={80} color="warning"/>
                </Box>
                <Box>

                <h3>Curaciones</h3>
                <CircularProgressWithLabel text="series fueron curadas correctamente" percentage={70} color="error"/>
                </Box>

            </Box>
            

        </div>
        : <CircularProgress 
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