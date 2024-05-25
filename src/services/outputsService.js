import { BASE_URL } from '../utils/service';
import { getOptions } from "../utils/service";

export default class OutputService{

    async getErroresPorDia(id){
        const response = await fetch(BASE_URL+`/errores/por-dia?configurationId=${id}`, getOptions());
        let dataPorDia = await response.json();
        return dataPorDia
    }

    async getIndicatorsbyConfigID(id){
        const response = await fetch(BASE_URL+`/errores/indicadores?configurationId=${id}`, getOptions());
        const res = await response.json()
        return res
    }
    async getFilteredIndicators(params){
        const response = await fetch(BASE_URL+`/errores/indicadores?`+ new URLSearchParams(params), getOptions());
        const res = await response.json()
        return res
    }

    async getBehaviorByConfigId(id){
        const response = await fetch(BASE_URL+`/series/comportamiento?configurationId=${id}`, getOptions());
        const res = await response.json()
        return res
    }

    async getBehaviorFilterd(params){
        const response = await fetch(BASE_URL+`/series/comportamiento?` + new URLSearchParams(params), getOptions());
        const res = await response.json()
        return res
    }
}