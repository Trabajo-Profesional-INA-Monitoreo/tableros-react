import InputsService from "../services/inputsService"

export class InputsPresenter {
    service = new InputsService()
    
    getRetardados= async(params) => {
        return this.service.getRetardos(params)
    }

    getNulosEnSeries= async(params) => {
        return this.service.getNullsInSeries(params)
    }
    
    getMetricas= async(configId) => {
        return this.service.getMetricas(configId)
    }

    getOutliers = async(params) => {
        return this.service.getOutliers(params)
    }
    onClickStreams(navigate) {
        navigate('/monitoreo/series')
    }

    onClickStations(navigate) {
        navigate('/monitoreo/estaciones')
    }
}