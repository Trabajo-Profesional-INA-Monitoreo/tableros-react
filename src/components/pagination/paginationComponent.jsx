import React, { useState } from 'react';
import { Pagination } from '@mui/material';

const PaginationComponent = ({ page, totalPages, setPage, func, params, setterData}) => {
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };
    return (
        <div style={{ display: "flex", justifyContent: "center"}}>
            <Pagination
                count={totalPages}
                sx={{marginTop:6}}
                onChange={async (event, page) =>  {
                    const data = await func( page, params,)
                    setterData(data.Content)

                }}
            />
        </div>
    );
};

export default PaginationComponent;