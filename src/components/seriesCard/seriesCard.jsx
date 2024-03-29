import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import { Styles } from './Style';

function renderData(description, data, style){
    return (
        <div style={style.cardInfoContainer}>
            <p>{description+": "+data}</p>
        </div>
    )
}

function SeriesCard({serieData}) {
    const style = Styles()
    return(
        <Card sx={style.cardContainer}>
            <CardHeader
                title={"Serie Nro "+serieData.id+" - "+serieData.nameVar+" | "+serieData.estacion}
                sx={style.cardHeader}
            />
            <CardContent>
                {renderData("Errores", serieData.CantErrores, style)}
                {renderData("Tiempo de retraso", serieData.tiempoDeRetraso, style)}
                {renderData("Procedimiento",serieData.procedimiento, style)}
                {renderData("Tipo de serie", serieData.tipo, style)}
            </CardContent>
        </Card>
    )
}

export default(SeriesCard)