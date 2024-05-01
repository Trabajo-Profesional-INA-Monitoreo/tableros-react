import { BASE_URL } from "../utils/service";
import { getConfigurationID } from "../utils/storage";

export default class serieService {

    async getSerieMetadata(serieID, configuredSerieID, startDate, endDate) {
        const response = await fetch(`${BASE_URL}/series/${serieID}?configuredStreamId=${configuredSerieID}&timeStart=${startDate}&timeEnd=${endDate}`)
        const res = await response.json()
        return res
    }

    async getObservedSerieValues(serieID, startDate, endDate) {
        const response = await fetch(`${BASE_URL}/series/observadas/${serieID}?timeStart=${startDate}&timeEnd=${endDate}`)
        const res = await response.json()
        return res
    }

    async getForacastedSerieValues(calibrationID, serieID) {
        const response = await fetch(`${BASE_URL}/series/pronosticadas/${calibrationID}?serieId=${serieID}`)
        const res = await response.json()
        return res
    }

    async getCuratedSerieValues(serieID, startDate, endDate) {
        const response = await fetch(`${BASE_URL}/series/curadas/${serieID}?timeStart=${startDate}&timeEnd=${endDate}`)
        const res = await response.json()
        return res
    }

    async getSeriePage(page, params) {
        const response = await fetch(`${BASE_URL}/series?page=${page}&` + new URLSearchParams(params))
        const res = await response.json()
        return res
    }

    async getSerieErrors(configuredSerieId, startDate, endDate) {
        const response = await fetch(`${BASE_URL}/errores/${configuredSerieId}?timeStart=${startDate}&timeEnd=${endDate}`)
        const res = await response.json()
        return res
    }

    async getImplicatedSeries(errorType) {
        const response = await fetch(`${BASE_URL}/errores/series-implicadas?configurationId=${getConfigurationID()}&errorType=${errorType}`)
        const res = await response.json()
        return res
    }

    async getSeriesbyIdConfig(id) {
        const response = await fetch(BASE_URL+"/series?configurationId="+id)
        const res = await response.json()
        return res
    }
}
