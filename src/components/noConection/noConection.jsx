import WifiOffIcon from '@mui/icons-material/WifiOff'
import { NoConectionStyles } from './Style'

const NoConectionSplash = () => {
    const styles= NoConectionStyles()
    return (
        <>
            <div style={styles.mainContainer}>
                <WifiOffIcon sx={styles.icon}/>
                <h1 style={styles.text}>Error de conexión</h1>
            </div>
        </>
    )
}

export default NoConectionSplash