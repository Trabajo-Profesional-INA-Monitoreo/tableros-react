import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { Styles } from './Style';
import { CardActionArea } from '@mui/material';

function renderData(description, data, style){
    if (!data){
        data = 0
    }
    return (
        <div style={style.cardInfoContainer}>
            <p>{description+": "+data}</p>
        </div>
    )
}

function SeriesCard({serieData, onClick}) {
    const style = Styles()
    return(
        <Card sx={style.cardContainer}>
            <CardActionArea onClick={onClick}>

            <CardHeader
                title={"Serie Nro "+serieData.StreamId+" | "+serieData.StationName}
                sx={style.cardHeader}
            />
            <CardContent>
                {renderData("Variable de medicion",serieData.VariableName, style)}
                {serieData.CheckErrors? renderData("Errores totales", serieData.TotalErrors, style): <></>}
                {/*renderData("Tiempo de retraso", serieData.tiempoDeRetraso, style)*/}
                {renderData("Procedimiento",serieData.ProcedureName, style)}
                {renderData("Tipo de serie", serieData.tipo, style)}
            </CardContent>
            </CardActionArea>
        </Card>
    )
}

export default(SeriesCard)