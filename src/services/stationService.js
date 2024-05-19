import { BASE_URL } from "../utils/service";
import { getConfigurationID } from "../utils/storage";
import { getOptions } from "../utils/service";

export default class stationService {

    async getStations(page) {
        const response = await fetch(`${BASE_URL}/series/estaciones?page=${page}&pageSize=10&configurationId=${getConfigurationID()}`, getOptions());
        const res = await response.json();
        return res;
    }

    async getAllStationsNames() {
        const response = await fetch(`${BASE_URL}/filtro/estaciones?configurationId=${getConfigurationID()}`, getOptions());
        const res = await response.json();
        return res;
    }
    
}
