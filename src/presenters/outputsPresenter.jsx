import OutputsService from "../services/outputsService";
import { getConfigurationID } from "../utils/storage";

export class OutputsPresenter {

    service = new OutputsService();
    configId = getConfigurationID();

    getBehaviors = async(params)=>{
        if(params){
            params={params}
        }
        params = {"configurationId": this.configId}
        const behaviorResponse = await this.service.getBehaviors(params)

        const behaviors={
        "alertLevel": (behaviorResponse.TotalValuesCount? (behaviorResponse.CountAlertLevel*100)/behaviorResponse.TotalValuesCount:0),
        "evacuationLevel": (behaviorResponse.TotalValuesCount? (behaviorResponse.CountEvacuationLevel*100)/behaviorResponse.TotalValuesCount:0),
        "lowWaterLevel":(behaviorResponse.TotalValuesCount? (behaviorResponse.CountLowWaterLevel*100)/behaviorResponse.TotalValuesCount:0)
        }
        return behaviors
    }
    getErroresPorDia = async(params) => {
        if(params){
            params={params}
        }
        params = {"configurationId": this.configId}
        return await this.service.getErroresPorDia(params)
    }

    getIndicators = async(metrics)=>{
        const response = await this.service.getIndicatorsbyConfigID(this.configId)
        this.map_metrics(metrics, response)
    }

    getFilteredIndicators = async(params, metrics)=>{
        params["configurationId"]= this.configId
        const response = await this.service.getFilteredIndicators(params)
        this.map_metrics(metrics, response)
    }

    updateObjectInArray(arr, nameValue, updatedValue){
        const index = arr.findIndex(obj => obj.name === nameValue);
        if (index !== -1) {
            arr[index] = { ...arr[index], ...updatedValue };
        }
        return arr;
    };

    map_metrics(metrics, errores){
        if(errores?.length === 0){
            this.updateObjectInArray(metrics, "Valores nulos", { value: 0 }  )
            this.updateObjectInArray(metrics, "Errores de falta de horizonte", { value: 0}  )
            this.updateObjectInArray(metrics, "Valores fuera de banda de errores", { value: 0 }  )
            this.updateObjectInArray(metrics, "Errores de falta de pronostico", { value: 0 }  )
            this.updateObjectInArray(metrics, "Outliers observados", { value: 0 }  )
            this.updateObjectInArray(metrics, "Pronosticos fuera de umbrales", { value: 0 }  )
        }
        for (const errorobj of errores) {
            if(errorobj.ErrorType === 'NullValue'){
                this.updateObjectInArray(metrics, "Valores nulos", { value: errorobj.Count })
                this.updateObjectInArray(metrics, "Valores nulos", { id: errorobj.ErrorId })
            }else if(errorobj.ErrorType === 'Missing4DaysHorizon'){
                this.updateObjectInArray(metrics, "Errores de falta de horizonte", { value: errorobj.Count })
                this.updateObjectInArray(metrics, "Errores de falta de horizonte", { id: errorobj.ErrorId })
            }else if(errorobj.ErrorType === 'OutsideOfErrorBands'){
                this.updateObjectInArray(metrics, "Valores fuera de banda de errores", { value: errorobj.Count })
                this.updateObjectInArray(metrics, "Valores fuera de banda de errores", { id: errorobj.ErrorId })
            }else if(errorobj.ErrorType === "ForecastMissing"){
                this.updateObjectInArray(metrics, "Errores de falta de pronostico", { value: errorobj.Count })
                this.updateObjectInArray(metrics, "Errores de falta de pronostico", { id: errorobj.ErrorId })
            }else if(errorobj.ErrorType === "ObservedOutlier"){
                this.updateObjectInArray(metrics, "Outliers observados", { value: errorobj.Count })
                this.updateObjectInArray(metrics, "Outliers observados", { id: errorobj.ErrorId })
            }else if(errorobj.ErrorType === "ForecastOutOfBounds"){
                this.updateObjectInArray(metrics, "Pronosticos fuera de umbrales", { value: errorobj.Count })
                this.updateObjectInArray(metrics, "Pronosticos fuera de umbrales", { id: errorobj.ErrorId })
            }
        }
    }
    
    dateParser(date){
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
        const day = date.getDate().toString().padStart(2, '0');
        return`${year}-${month}-${day}`;
    }

    calcularDias(desde, hasta){
        const days = [];
        const offset = -3 * 60 * 60 * 1000; // GMT-3 offset in milliseconds

        for (let day = desde; day <= hasta; day.setDate(day.getDate() + 1)) {
            const gmt3Date = new Date(day.getTime() + offset);
            const dayDate = gmt3Date.toISOString().split('T')[0]
            days.push(dayDate);
        }
        return days
    }
    
    formatDates(arr) {
        arr.forEach(obj => {
            obj.Date = obj.Date.substring(0, 10);
        });
        return arr;
    }

    groupErrors(dates, desde, hasta) {
        dates = this.formatDates(dates)
        const grouped = Object.groupBy(dates, ({ ErrorType }) => ErrorType);
        const errorsGrouped = {}
        for (const [ErrorType, errors] of Object.entries(grouped)) {
            errorsGrouped[ErrorType] = []
            const byDate = new Map(errors.map((obj) => [obj.Date, obj]));
            for (let day = new Date(desde); day <= hasta; day.setDate(day.getDate() + 1)) {
                const parsedDate = day.toISOString().split('T')[0];
                const dateErrors = byDate.get(parsedDate);
                if (dateErrors) {
                    errorsGrouped[ErrorType].push(dateErrors.Total);
                } else {
                    errorsGrouped[ErrorType].push(0);
                }
            }
        }
        return errorsGrouped;
    }

    getInitialMetrics(){
        const metrics=  [
            {name: "Valores nulos", value: 0, id: -1},
            {name: "Errores de falta de horizonte", value: 0, id: -1},
            {name: "Valores fuera de banda de errores", value: 0, id: -1},
            {name: "Errores de falta de pronostico", value: 0, id: -1},
            {name: "Outliers observados", value: 0, id: -1},
            {name: "Pronosticos fuera de umbrales", value: 0, id: -1},
        ]
        return metrics
    }
}
