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
                        variant="h4"
                        component="div"
                        color="text.primary"
                        align='center'
                        sx={{fontWeight:"bold"}}
                        >{percentage}%</Typography>
                        
                        <Typography
                        variant="caption"
                        component="div"
                        color="text.primary"
                        align='center'
                        width={120}
                        >{text}</Typography>
                    </Box>
                </Box>
        )        
    }

export default CircularProgressWithLabel