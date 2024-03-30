import React from 'react';
import { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import Line from '../../components/line/line';
import { SeriesPresenter } from '../../presenters/seriesPresenter';
import { SerieModal } from './serieModal/serieModal';


export const Series = () => {
    useEffect(() => {}, []);
    let loading = true;
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (    
        loading ? 
        <Box>
            <h1>Series</h1>
            <Line/>
            <Button onClick={handleOpen}>Open modal</Button>
            <SerieModal open={open} handleClose={handleClose}/>      
        </Box>
        : null
    );
}




