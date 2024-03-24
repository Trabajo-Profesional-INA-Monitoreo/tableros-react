import configurationService from "../services/configurationService"

export const METRICS = ['Mediana', 'Media', 'Máximo', 'Mínimo', '% Nulos']
export const SERIES_TYPES = {OBSERVADA: 'Observada', PRONOSTICADA: 'Pronosticada', SIMULADA: 'Simulada'}
export const STREAM_TYPE_CODE = {'Observada': 0, 'Pronosticada': 1, 'Simulada': 2}
export const METRICS_CODE = {'Mediana': 0, 'Media': 1, 'Máximo': 2, 'Mínimo': 3, '% Nulos': 4}

export class CreateConfigurationPresenter {

    configurationService = new configurationService()
    
    postConfiguration = async(body) => {
        return this.configurationService.postConfiguration(body);
    }

    isValidStream = (stream) => {
        var isValidStream = true;
        if (stream.idSerie === '') {
            alert("El ID de la serie es necesario");
            isValidStream = false;
        } else if (!stream.idNode) {
            alert("Indiqué a que nodo debe pertenecer esta serie");
            isValidStream = false;
        } else if (stream.actualizationFrequency === '') {
            alert("La frecuencia de actualización de la serie es necesaria");
            isValidStream = false;
        } else if (stream.serieType === SERIES_TYPES.PRONOSTICADA && stream.calibrationID === '') {
            alert("El ID de calibracion es necesario en las series pronosticadas");
            isValidStream = false;
        } else if (stream.lowerThreshold !== '' && stream.upperThreshold !== '' && Number(stream.lowerThreshold) >= Number(stream.upperThreshold)) {
            alert("El umbral inferior debe ser menor al umbral superior");
            isValidStream = false;
        }
        return isValidStream;
    }

    isValidNode = (nodeName) => {
        var isValidNode = true;
        if (nodeName === '') {
            alert("El nombre del nodo es necesario");
            isValidNode = false;
        }
        return isValidNode;
    }

    isValidConfiguration = (configurationName, nodes, series) => {
        var isValidConfiguration = true;
        if (configurationName === '') {
            alert("El nombre de la configuración es necesario");
            isValidConfiguration = false;
        } else if (nodes.length === 0) {
            alert("Debe agregar nodos a la configuración");
            isValidConfiguration = false;
        } else if (series.length === 0) {
            alert("Debe agregar series a la configuración");
            isValidConfiguration = false;
        } else if (!this.allNodesHaveSeries(nodes, series)) {
            alert("Todos los nodos deben tener series");
            isValidConfiguration = false;
        } 
        return isValidConfiguration;
    }

    allNodesHaveSeries = (nodes, series) => {
        var allNodesHaveSeries = true;
        nodes.forEach(node => {
            if (series.filter(serie => serie.idNode === node.id).length === 0){
                allNodesHaveSeries = false
            } 
        })
        return allNodesHaveSeries;
    }
    
    buildConfigurationBody = (configurationName, nodes, series) => {
        var configuration = {};
        configuration['name'] = configurationName
        configuration['nodes'] = nodes
        configuration['nodes'].forEach(node => {
            node['series'] = []
            series.forEach(serie => {
                if (node.id === serie.idNode) {
                    node['series'].push({
                        streamId: Number(serie.idSerie),
                        streamType: STREAM_TYPE_CODE[serie.serieType],
                        updateFrequency: Number(serie.actualizationFrequency),
                        checkErrors: serie.checkErrors,
                        upperThreshold: Number(serie.upperThreshold) ? Number(serie.calibrationID) : null,
                        lowerThreshold: Number(serie.lowerThreshold) ? Number(serie.calibrationID) : null,
                        calibrationId: Number(serie.calibrationID) ? Number(serie.calibrationID) : null,
                        redundanciesIds: serie.redundantSeriesIDs,
                        metrics: Object.keys(serie.metrics).filter(key => serie.metrics[key]).map(key => METRICS_CODE[key])
                    })
                }
            })
        })
        return configuration
    }
}
