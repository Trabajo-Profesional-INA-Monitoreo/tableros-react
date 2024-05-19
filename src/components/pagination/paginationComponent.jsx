import React from 'react';
import { Pagination } from '@mui/material';

const PaginationComponent = ({totalPages, func, params, setterData, isStation, setLoading}) => {
    return (
        <div style={{ display: "flex", justifyContent: "center"}}>
            <Pagination
                count={totalPages}
                sx={{marginTop:6}}
                onChange={async (event, page) =>  {
                    setLoading(true)
                    const data = await func( page, params)
                    isStation? setterData(data.Stations): setterData(data.Content)
                    setLoading(false)
                }}
            />
        </div>
    );
};

export default PaginationComponent;