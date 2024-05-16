import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { Styles } from './Style';
import { CardActionArea } from '@mui/material';
import { STREAM_TYPE_CODE_INVERSE } from '../../utils/constants';

function renderData(description, data, style){
    if (!data){
        data = 0
    }
    return (
        <div style={style.cardInfoContainer}>
            <p style={{width: '100%'}}><b>{description+': '}</b>{data}</p>
        </div>
    )
}

function SeriesCard({serieData, onClick}) {
    const style = Styles()
    return(
        <Card >
            <CardActionArea onClick={onClick} sx={style.cardContainer}>
                <CardHeader
                    title={serieData.StationName + " | "+ serieData.StreamId}
                    sx={style.cardHeader}>              
                </CardHeader>
                <CardContent>
                    {renderData("Variable de medicion",serieData.VariableName, style)}
                    {serieData.CheckErrors? renderData("Errores última semana", serieData.TotalErrors, style): <></>}
                    {/*renderData("Tiempo de retraso", serieData.tiempoDeRetraso, style)*/}
                    {renderData("Procedimiento",serieData.ProcedureName, style)}
                    {renderData("Tipo de serie", STREAM_TYPE_CODE_INVERSE[serieData.StreamType], style)}
                </CardContent>
            </CardActionArea>          
        </Card>
    )
}

export default(SeriesCard)