import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import { NoResultStyles } from './Style';

const NoResults = ({textNoResults}) => {
    const styles= NoResultStyles()
    return (
        <>
            <div style={styles.mainContainer}>
                <ManageSearchIcon sx={styles.icon}/>
                <h1 style={styles.text}>No se encontraron {textNoResults}</h1>
            </div>
        </>
    )
}

export default NoResults

                    