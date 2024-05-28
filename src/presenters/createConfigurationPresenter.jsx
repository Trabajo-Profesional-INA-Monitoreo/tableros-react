import configurationService from "../services/configurationService";
import { STREAM_TYPE_CODE, STREAM_TYPE_CODE_INVERSE, SERIES_TYPES, METRICS_CODE, INITIAL_METRICS_STATE, METRICS_CODE_INVERSE } from "../utils/constants"
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
        } else if (!stream._idNode) {
            notifyError("Indiqué a que nodo debe pertenecer la serie");
            isValidStream = false;
        } else if (stream.actualizationFrequency === 0) {
            notifyError("La frecuencia de actualización de la serie es necesaria");
            isValidStream = false;
        } else if (stream.serieType === SERIES_TYPES.PRONOSTICADA && stream.calibrationID === '') {
            notifyError("El ID de calibracion es necesario en las series pronosticadas");
            isValidStream = false;
        } else if (stream.serieType === SERIES_TYPES.PRONOSTICADA && stream.forecastedRangeHours === 0) {
            notifyError("El ID rango de pronóstico es necesario en las series pronosticadas");
            isValidStream = false;
        } else if (stream.lowerThreshold !== '' && stream.upperThreshold !== '' && Number(stream.lowerThreshold) >= Number(stream.upperThreshold)) {
            notifyError("El umbral inferior debe ser menor al umbral superior");
            isValidStream = false;
        } else if (stream.lowerThreshold === '' || stream.upperThreshold === '') {
            notifyError("Los umbrales son necesarios");
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
            if (series.filter(serie => serie._idNode === node._id).length === 0){
                allNodesHaveSeries = false
            } 
        })
        return allNodesHaveSeries;
    }
    
    buildConfigurationBody = (configurationName, nodes, series, notificaciones, configurationId, isPut) => {
        var configuration = {};
        configuration['name'] = configurationName;
        if (isPut && configurationId) {
            configuration['Id'] = configurationId;
            configuration['nodes'] = nodes.map(node => ({name: node.name, _id: node._id, id: node.id}))
        }
        else
            configuration['nodes'] = nodes.map(node => ({name: node.name, _id: node._id}));
        configuration['sendNotifications'] = notificaciones
        configuration['nodes'].forEach(node => {
            node['configuredStreams'] = [];
            series.forEach(serie => {
                if (node._id === serie._idNode) {
                    const _serie = {
                        streamId: Number(serie.idSerie),
                        streamType: STREAM_TYPE_CODE[serie.serieType],
                        updateFrequency: Number(serie.actualizationFrequency),
                        forecastedRangeHours: Number(serie.forecastedRangeHours) === 0 ? null : Number(serie.forecastedRangeHours),
                        checkErrors: Boolean(serie.checkErrors),
                        upperThreshold: Number(serie.upperThreshold) ? Number(serie.calibrationID) : null,
                        lowerThreshold: Number(serie.lowerThreshold) ? Number(serie.calibrationID) : null,
                        calibrationId: Number(serie.calibrationID) ? Number(serie.calibrationID) : null,
                        relatedObservedStreamId: Number(serie.relatedObservedStreamID) ? Number(serie.relatedObservedStreamID) : null,
                        redundanciesIds: serie.redundantSeriesIDs,
                        metrics: Object.keys(serie.metrics).filter(key => serie.metrics[key]).map(key => METRICS_CODE[key])
                    }
                    if (serie.ConfiguredStreamId) {
                        _serie['ConfiguredStreamId'] = serie.ConfiguredStreamId
                    }
                    node['configuredStreams'].push(_serie)
                }
            })
        })
        console.log(configuration)
        //return configuration;
    }

    getConfiguration = async(id) => {
        return id ? this.configurationService.getConfiguration(id) : null;
    }

    buildNodesFromConfiguration = (configuration) => {
        let nodes = [];
        configuration.Nodes.forEach((node, index) => nodes.push({"name": node.Name, "id": node.Id, "_id": index+1}))
        return nodes;
    }

    buildSeriesFromConfiguration = (configuration) => {
        let series = [];

        const buildMetricsFromConfiguration = (metricIDs) => {
            let metrics = INITIAL_METRICS_STATE();
            metricIDs.forEach(metricID => metrics[METRICS_CODE_INVERSE[metricID]] = true);
            return metrics;
        }

        configuration.Nodes.forEach((node, index) => {
            series = series.concat(node.ConfiguredStreams.map(serie => (
                {
                    idSerie: String(serie.StreamId),
                    ConfiguredStreamId: serie.ConfiguredStreamId,
                    idNode: Number(node.Id),
                    _idNode: index + 1,
                    actualizationFrequency: String(serie.UpdateFrequency),
                    forecastedRangeHours: serie.ForecastedRangeHours ? Number(serie.ForecastedRangeHours) : null,
                    serieType: STREAM_TYPE_CODE_INVERSE[serie.StreamType],
                    calibrationID: serie.CalibrationId !== 0 ? String(serie.CalibrationId) : '',
                    redundantSeriesIDs: serie.RedundanciesIds ? serie.RedundanciesIds : [],
                    metrics: serie.Metrics ? buildMetricsFromConfiguration(serie.Metrics) : INITIAL_METRICS_STATE(),
                    checkErrors: serie.CheckErrors,
                    lowerThreshold: serie.LowerThreshold ? String(serie.LowerThreshold) : '',
                    upperThreshold: serie.upperThreshold ? String(serie.UpperThreshold) : ''
                }
            )
            ));

        })
        console.log(series);
        return series;
    }
}
