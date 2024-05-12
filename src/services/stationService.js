import { BASE_URL } from "../utils/service";
import { getConfigurationID } from "../utils/storage";

export default class stationService {

    async getStations(configurationId) {
        const response = await fetch(`${BASE_URL}/series/estaciones?configurationId=${getConfigurationID()}`);
        const res = await response.json();
        return res;
    }

    async getAllStationsNames() {
        const response = await fetch(`${BASE_URL}/filtro/estaciones?configurationId=${getConfigurationID()}`);
        const res = await response.json();
        return res;
    }
    
}
