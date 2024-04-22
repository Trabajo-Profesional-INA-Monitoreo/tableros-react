import InputsService from "../services/inputsService"

export class InputsPresenter {
    
    service = new InputsService()
    
    getNulosEnSeries= async(params) => {
        return this.service.getNullsInSeries(params)
    }
    getMetricas= async(configId) => {
        return this.service.getMetricas(configId)
    }
}