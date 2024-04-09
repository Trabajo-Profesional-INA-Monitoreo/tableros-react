import React from 'react';
import { Pagination } from '@mui/material';

const PaginationComponent = ({ page, totalPages, setPage}) => {
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handlePrevPage = () => {
        if (page > 1) {
            handlePageChange(page - 1);
        }
    };

    const handleNextPage = () => {
        if (page < totalPages) {
            handlePageChange(page + 1);
        }
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];

        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers.map((number) => {
            if (number === 1) {
                return (
                    <button key={number} onClick={() => handlePageChange(number)}>
                        {number}
                    </button>
                );
        } else if (number === totalPages) {
            return (
                <button key={number} onClick={() => handlePageChange(number)}>
                    ...{number}
                </button>
            );
        } else if (number === page) {
            return (
                <button key={number} className="active">
                    {number}
                </button>
            );
        } else {
            return (
                <button key={number} onClick={() => handlePageChange(number)}>
                    {number}
                </button>
            );
        }
        });
    };

    return (
        <div style={{ display: "flex", justifyContent: "center"}}>
            <Pagination
                count={totalPages}
                sx={{marginTop:6}}
            />
        </div>
    );
};

export default PaginationComponent;