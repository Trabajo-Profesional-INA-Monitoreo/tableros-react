import { BASE_URL } from "../utils/service";

export default class serieService {

    async getSerieMetadata(serieID, configuredSerieID) {
        const response = await fetch(BASE_URL+"/series/"+serieID+"?configuredStreamId="+configuredSerieID)
        const res = await response.json()
        return res
    }

    async getObservedSerieValues(serieID) {
        const response = await fetch(BASE_URL+"/series/observadas/"+serieID)
        const res = await response.json()
        return res
    }

    async getForacastedSerieValues(calibrationID) {
        const response = await fetch(BASE_URL+"/series/pronosticadas/"+calibrationID)
        const res = await response.json()
        return res
    }

    async getCuratedSerieValues(serieID) {
        const response = await fetch(BASE_URL+"/series/curadas/"+serieID)
        const res = await response.json()
        return res
    }
}
