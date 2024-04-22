import configurationService from "../services/configurationService";
import { STREAM_TYPE_CODE, SERIES_TYPES, METRICS_CODE, INITIAL_METRICS_STATE, METRICS_CODE_INVERSE } from "../utils/constants"
import { notifyError } from "../utils/notification";

export class CreateConfigurationPresenter {

    configurationService = new configurationService()
    
    postConfiguration = async(body) => {
        return this.configurationService.postConfiguration(body);
    }

    putConfiguration = async(body) => {
        return this.configurationService.putConfiguration(body);
    }

    isValidStream = (stream) => {
        var isValidStream = true;
        if (stream.idSerie === '') {
            notifyError("El ID de la serie es necesario");
            isValidStream = false;
        } else if (!stream.idNode) {
            notifyError("Indiqué a que nodo debe pertenecer la serie");
            isValidStream = false;
        } else if (stream.actualizationFrequency === '') {
            notifyError("La frecuencia de actualización de la serie es necesaria");
            isValidStream = false;
        } else if (stream.serieType === SERIES_TYPES.PRONOSTICADA && stream.calibrationID === '') {
            notifyError("El ID de calibracion es necesario en las series pronosticadas");
            isValidStream = false;
        } else if (stream.lowerThreshold !== '' && stream.upperThreshold !== '' && Number(stream.lowerThreshold) >= Number(stream.upperThreshold)) {
            notifyError("El umbral inferior debe ser menor al umbral superior");
            isValidStream = false;
        }
        return isValidStream;
    }

    isValidNode = (nodeName) => {
        var isValidNode = true;
        if (nodeName === '') {
            notifyError("El nombre del nodo es necesario");
            isValidNode = false;
        }
        return isValidNode;
    }

    isValidConfiguration = (configurationName, nodes, series) => {
        var isValidConfiguration = true;
        if (configurationName === '') {
            notifyError("El nombre de la configuración es necesario");
            isValidConfiguration = false;
        } else if (nodes.length === 0) {
            notifyError("Debe agregar nodos a la configuración");
            isValidConfiguration = false;
        } else if (series.length === 0) {
            notifyError("Debe agregar series a la configuración");
            isValidConfiguration = false;
        } else if (!this.allNodesHaveSeries(nodes, series)) {
            notifyError("Todos los nodos deben tener series");
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
    
    buildConfigurationBody = (configurationName, nodes, series, notificaciones) => {
        var configuration = {};
        configuration['name'] = configurationName
        configuration['nodes'] = nodes.map(node => ({name: node.name, _id: node.id}) )
        console.log('hola: ', nodes);
        configuration['sendNotifications'] = notificaciones
        configuration['nodes'].forEach(node => {
            node['configuredStreams'] = []
            series.forEach(serie => {
                if (node._id === serie.idNode) {
                    node['configuredStreams'].push({
                        streamId: Number(serie.idSerie),
                        streamType: STREAM_TYPE_CODE[serie.serieType],
                        updateFrequency: Number(serie.actualizationFrequency),
                        checkErrors: Boolean(serie.checkErrors),
                        upperThreshold: Number(serie.upperThreshold) ? Number(serie.calibrationID) : null,
                        lowerThreshold: Number(serie.lowerThreshold) ? Number(serie.calibrationID) : null,
                        calibrationId: Number(serie.calibrationID) ? Number(serie.calibrationID) : null,
                        relatedObservedStreamId: Number(serie.relatedObservedStreamID) ? Number(serie.relatedObservedStreamID) : null,
                        redundanciesIds: serie.redundantSeriesIDs,
                        metrics: Object.keys(serie.metrics).filter(key => serie.metrics[key]).map(key => METRICS_CODE[key])
                    })
                }
            })
        })
        return configuration;
    }

    getConfiguration = async(id) => {
        return id ? this.configurationService.getConfiguration(id) : null;
    }

    buildNodesFromConfiguration = (configuration) => {
        let nodes = [];
        configuration.Nodes.forEach(node => nodes.push({"name": node.Name, "id": node.Id}))
        return nodes;
    }

    buildSeriesFromConfiguration = (configuration) => {
        let series = [];

        const buildMetricsFromConfiguration = (metricIDs) => {
            let metrics = INITIAL_METRICS_STATE;
            metricIDs.forEach(metricID => metrics[METRICS_CODE_INVERSE[metricID]] = true);
            return metrics;
        }

        configuration.Nodes.forEach(node => {
            
            series = series.concat(node.ConfiguredStreams.map(serie => (
                {
                    idSerie: String(serie.StreamId),
                    idNode: Number(node.Id),
                    actualizationFrequency: String(serie.UpdateFrequency),
                    serieType: String(serie.StreamType),
                    calibrationID: serie.CalibrationId !== 0 ? String(serie.CalibrationId) : '',
                    redundantSeriesIDs: serie.redundanciesIds ? serie.redundanciesIds : [],
                    metrics: serie.Metrics ? buildMetricsFromConfiguration(serie.Metrics) : INITIAL_METRICS_STATE,
                    checkErrors: serie.CheckErrors,
                    lowerThreshold: serie.LowerThreshold ? String(serie.LowerThreshold) : '',
                    upperThreshold: serie.upperThreshold ? String(serie.UpperThreshold) : ''
                }
            )
            ));

        })

        return series;
    }
}
