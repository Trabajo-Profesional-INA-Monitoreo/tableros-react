import React from 'react';
import { CircularProgress } from '@mui/material';

import { useEffect, useState } from 'react';


export const Home = () => {

    useEffect( () => {
    }, []);
    let loading= true;
    return (    
        loading ? 
        <h1> Tablero de inputs </h1>
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