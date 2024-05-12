import { BASE_URL } from "../utils/service";
import { getConfigurationID } from "../utils/storage";

export default class utilsService {

    async getAllProcedures() {
        const response = await fetch(`${BASE_URL}/filtro/procedimientos?configurationId=${getConfigurationID()}`);
        const res = await response.json();
        return res;
    }

    async getAllVariables() {
        const response = await fetch(`${BASE_URL}/filtro/variables?configurationId=${getConfigurationID()}`);
        const res = await response.json();
        return res;
    }

}