import { BASE_URL } from '../utils/service';

export default class OutputService{

    async getIndicatorsbyConfigID(id){
        const response = await fetch(BASE_URL+`/errores/indicadores?configurationId=${id}`);
        const res = await response.json()
        return res
    }
}