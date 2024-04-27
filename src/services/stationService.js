import { BASE_URL } from "../utils/service";

export default class stationService {

    async getStations(configurationId) {
        const response = await fetch(BASE_URL+"/series/estaciones?configurationId="+configurationId);
        const res = await response.json();
        return res;
    }

    async getAllStationsNames() {
        const response = await fetch(`${BASE_URL}/filtro/estaciones`);
        const res = await response.json();
        return res;
    }
    
}
