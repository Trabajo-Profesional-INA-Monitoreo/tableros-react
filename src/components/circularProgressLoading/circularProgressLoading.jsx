import { CircularProgress } from '@mui/material';

const STYLE = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    margin: 'auto',
    width: '10vw'
}

const CircularProgressLoading = () => {
    return (
        <CircularProgress style={STYLE}/>
    );
};

export default CircularProgressLoading;