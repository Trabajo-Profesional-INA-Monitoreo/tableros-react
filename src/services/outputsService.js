import { BASE_URL } from '../utils/service';
import { getOptions } from "../utils/service";

export default class OutputService{


    async getErroresPorDia(params){
        const response = await fetch(BASE_URL+`/errores/por-dia?`+ new URLSearchParams(params), getOptions());
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


    async getBehaviors(params){
        const response = await fetch(BASE_URL+`/series/comportamiento?` + new URLSearchParams(params), getOptions());
        const res = await response.json()
        return res
    }
}