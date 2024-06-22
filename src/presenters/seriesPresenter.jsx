import serieService from "../services/serieService";
import { dayjsToString } from "../utils/dates";
import { STREAM_TYPE_CODE } from "../utils/constants";
import dayjs from 'dayjs';

export class SeriesPresenter {

    serieService = new serieService()

    getSerieMetadata = async(serieID, configuredSerieID, startDate, endDate) => {
        const _startDate = dayjsToString(startDate);
        const _endDate = dayjsToString(endDate);
        return this.serieService.getSerieMetadata(serieID, configuredSerieID, _startDate, _endDate);
    }

    getSerieValues = async(serieID, serieType, calibrationID, startDate, endDate) => {
        const _startDate = dayjsToString(startDate);
        const _endDate = dayjsToString(endDate);
        switch(serieType){
            case STREAM_TYPE_CODE.Observada:
                return this.serieService.getObservedSerieValues(serieID, _startDate, _endDate);
            case STREAM_TYPE_CODE.Pronosticada:
            case STREAM_TYPE_CODE.Simulada:
                return this.serieService.getForacastedSerieValues(calibrationID, serieID);
            default:
                return this.serieService.getObservedSerieValues(serieID, _startDate, _endDate);
        }
    }

    getSerieErrors = async(configuredSerieId, startDate, endDate, page, pageSize) => {
        return this.serieService.getSerieErrors(configuredSerieId, dayjsToString(startDate), dayjsToString(endDate), page, pageSize);
    }

    getSerieDelays = async(configuredSerieId, startDate, endDate) => {
        return this.serieService.getSerieDelays(configuredSerieId, dayjsToString(startDate), dayjsToString(endDate));
    }

    getImplicatedSeries = async(errorType) => {
        return this.serieService.getImplicatedSeries(errorType);
    }

    getSeriePage = async(page, params) => {
        return this.serieService.getSeriePage(page, params);
    }

    getSerieRedundancies =  (configuredSerieID) => {
        return this.serieService.getSerieRedundancies(configuredSerieID);
    }

    buildGeneralMetrics = (metrics) => {
        if (!metrics) return [];
        const validMetricNames = ["Mediana", "Media", "Máximo", "Mínimo"];
        return metrics.filter(metric => validMetricNames.includes(metric.Name));
    }

    buildBehaviourMetrics = (metrics) => {
        if (!metrics) return [];
        const behaviourMetrics = ["Cantidad bajo nivel de Aguas Bajas", "Cantidad sobre nivel de Alerta", "Cantidad sobre nivel de Evacuación"];
        return metrics.filter(metric => behaviourMetrics.includes(metric.Name));
    }

    buildNullsMetric = (metrics) => {
        if (!metrics) return [];
        return metrics.filter(metric => metric.Name === "Cantidad de Nulos");
    }

    buildObservationsMetric = (metrics) => {
        if (!metrics) return [];
        return metrics.filter(metric => metric.Name === "Observaciones");
    }

    getTotalBehaviourMetrics = (metrics) => {
        return metrics.filter( metric => metric.Name === 'Observaciones')[0].Value
    }

    buildDelaysDataset = (data, startDate, endDate) => {

        const dateExists = (date, array) => {
            return array.some(item => item.Date.substring(0, 10) === dayjsToString(date));
        }

        data = data.map(item => ({
            "Average": item.Average,
            "Date": item.Date.substring(0, 10)
        }))
          
        for (let date = startDate; date.isBefore(endDate) || date.isSame(endDate, 'day'); date = date.add(1, 'day')) {
            if (!dateExists(date, data)) {
                data.push({
                    "Average": 0,
                    "Date": date.toISOString().substring(0, 10)
                });
            }
        }
        
        data.sort((a, b) => dayjs(a.Date).diff(dayjs(b.Date)));

        return data;
    }
}
