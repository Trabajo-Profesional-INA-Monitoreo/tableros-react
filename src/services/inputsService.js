import { BASE_URL } from '../utils/service';

export default class InputsService{

    async getNullsInSeries(params){
        const response = await fetch(BASE_URL+`/inputs/series-con-nulos?`+ new URLSearchParams(params));
        const res = await response.json()
        return res
    }
    
    async getMetricas(configId){
        const response = await fetch(BASE_URL+`/inputs/metricas-generales?configurationId=${configId}`);
        const res = await response.json()
        return res
    }

    async getOutliers(params){
        const response = await fetch(BASE_URL+`/inputs/series-fuera-umbral?`+ new URLSearchParams(params));
        const res = await response.json()
        return res
    }
}