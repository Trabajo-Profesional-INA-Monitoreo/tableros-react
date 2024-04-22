import serieService from "../services/serieService";
import { dayjsToString } from "../utils/dates";

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
            case 0:
                return this.serieService.getObservedSerieValues(serieID, _startDate, _endDate);
            case 1:
                return this.serieService.getForacastedSerieValues(calibrationID, _startDate, _endDate);
            case 2:
                return this.serieService.getCuratedSerieValues(serieID, _startDate, _endDate);
        }
    }

    getSeriePage = async(page, params) => {
        return this.serieService.getSeriePage(page, params);
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

}
