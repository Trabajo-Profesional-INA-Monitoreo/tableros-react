import { BASE_URL } from '../utils/service';

export default class OutputService{

    async getIndicatorsbyConfigID(id){
        const response = await fetch(BASE_URL+`/errores/indicadores?configurationId=${id}`);
        const res = await response.json()
        return res
    }
    async getFilteredIndicators(params){
        console.log(params)
        const response = await fetch(BASE_URL+`/errores/indicadores?`+ new URLSearchParams(params));
        const res = await response.json()
        return res
    }

    async getBehaviorByConfigId(id){
        const response = await fetch(BASE_URL+`/series/comportamiento?configurationId=${id}`);
        const res = await response.json()
        return res
    }

    async getErroresPorDia(params){
        const response = await fetch(BASE_URL+`/errores/por-dia`+ new URLSearchParams(params));
        const res = await response.json()
        return res
    }
}