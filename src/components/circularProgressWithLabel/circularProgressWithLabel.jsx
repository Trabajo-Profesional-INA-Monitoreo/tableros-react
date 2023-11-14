import { CircularProgress, Box, Typography } from '@mui/material';

const CircularProgressWithLabel = ( {text, percentage, color}) => {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <CircularProgress variant="determinate" value={percentage} size={200} color={color} />

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
                        flexDirection:"column"
                        }}
                    >
                        <Typography
                        variant="h2"
                        component="div"
                        color="text.primary"
                        >{percentage}%</Typography>

                        <Typography
                        variant="body"
                        component="div"
                        color="text.secondary"
                        >{text}</Typography>
                    </Box>
                </Box>
        )        
    }

export default CircularProgressWithLabel