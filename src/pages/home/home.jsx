import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

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

            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress variant="determinate" value={60} size={200} />

                <Box
                    sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    }}
                >
                    <Typography
                    variant="caption"
                    component="div"
                    color="text.secondary"
                    >series no tuvieron retrasos</Typography>
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