import serieService from "../services/serieService";

export class SeriesPresenter {

    serieService = new serieService()

    getSerieMetadata = async(serieID, configuredSerieID) => {
        return this.serieService.getSerieMetadata(serieID, configuredSerieID);
    }

    getSerieValues = async(serieID, serieType, calibrationID) => {
        switch(serieType){
            case 0:
                return this.serieService.getObservedSerieValues(serieID);
            case 1:
                return this.serieService.getForacastedSerieValues(calibrationID);
            case 2:
                return this.serieService.getCuratedSerieValues(serieID);
        }
    }

    buildGeneralMetrics = (metrics) => {
        if (!metrics) return [];
        const validMetricNames = ["Mediana", "Media", "Maximo", "Minimo"];
        return metrics.filter(metric => validMetricNames.includes(metric.Name));
    }

    buildBehaviourMetrics = (metrics) => {
        if (!metrics) return [];
        const behaviourMetrics = ["AguasAlerta", "AguasEvacuacion", "AguasBajas"];
        return metrics.filter(metric => behaviourMetrics.includes(metric.Name));
    }

    buildNullsMetric = (metrics) => {
        if (!metrics) return [];
        return metrics.filter(metric => metric.Name === "Nulos");
    }

    buildObservationsMetric = (metrics) => {
        if (!metrics) return [];
        return metrics.filter(metric => metric.Name === "Observaciones");
    }

}
