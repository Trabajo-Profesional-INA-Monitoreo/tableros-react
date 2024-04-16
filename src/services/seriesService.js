import { BASE_URL } from "../utils/service";

export default class configurationService{

    async getSeriesbyIdConfig(id) {
        const response = await fetch(BASE_URL+"/series?configurationId="+id)
        const res = await response.json()
        return res
    }
}