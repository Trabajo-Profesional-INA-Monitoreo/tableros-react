import { BASE_URL } from "../utils/service";
import { getConfigurationID } from "../utils/storage";
import { getOptions } from "../utils/service";

export default class serieService {

    async getSerieMetadata(serieID, configuredSerieID, startDate, endDate) {
        const response = await fetch(`${BASE_URL}/series/${serieID}?configuredStreamId=${configuredSerieID}&timeStart=${startDate}&timeEnd=${endDate}`, getOptions())
        const res = await response.json()
        return res
    }

    async getObservedSerieValues(serieID, startDate, endDate) {
        const response = await fetch(`${BASE_URL}/series/observadas/${serieID}?timeStart=${startDate}&timeEnd=${endDate}`, getOptions())
        const res = await response.json()
        return res
    }

    async getForacastedSerieValues(calibrationID, serieID) {
        const response = await fetch(`${BASE_URL}/series/pronosticadas/${calibrationID}?serieId=${serieID}`, getOptions())
        const res = await response.json()
        return res
    }

    async getCuratedSerieValues(serieID, startDate, endDate) {
        const response = await fetch(`${BASE_URL}/series/curadas/${serieID}?timeStart=${startDate}&timeEnd=${endDate}`, getOptions())
        const res = await response.json()
        return res
    }

    async getSeriePage(page, params) {
        const response = await fetch(`${BASE_URL}/series?page=${page}&` + new URLSearchParams(params), getOptions())
        const res = await response.json()
        return res
    }

    async getSerieErrors(configuredSerieId, startDate, endDate, page, pageSize) {
        const response = await fetch(`${BASE_URL}/errores/${configuredSerieId}?timeStart=${startDate}&timeEnd=${endDate}&page=${page}&pageSize=${pageSize}`, getOptions())
        const res = await response.json()
        return res
    }

    async getSerieDelays(configuredSerieId, startDate, endDate) {
        const response = await fetch(`${BASE_URL}/errores/retardo-promedio/por-dia?configuredStreamId=${configuredSerieId}&timeStart=${startDate}&timeEnd=${endDate}`, getOptions())
        const res = await response.json()
        return res
    }

    async getImplicatedSeries(errorType) {
        const response = await fetch(`${BASE_URL}/errores/series-implicadas?configurationId=${getConfigurationID()}&errorType=${errorType}`, getOptions())
        const res = await response.json()
        return res
    }

    async getSeriesbyIdConfig(id) {
        const response = await fetch(BASE_URL+"/series?configurationId="+id, getOptions())
        const res = await response.json()
        return res
    }

    async getSerieRedundancies(configuredSerieID) {
        const response = await fetch(BASE_URL+"/series/redundancias/"+configuredSerieID, getOptions())
        const res = await response.json()
        return res
    }
}
