import React from 'react';
import { Box, CircularProgress, Button} from '@mui/material';
import CircularProgressWithLabel from '../../components/circularProgressWithLabel/circularProgressWithLabel';
import { useEffect } from 'react';
import Line from '../../components/line/line';
import { HomePresenter } from '../../presenters/inputsPresenter';
import { CurrentConfiguration } from '../../components/currentConfiguration/currentConfiguration';


export const Home = () => {

    return (    
        <div>
            <h1> Home </h1>
            <Line/>
        </div>
    )
}