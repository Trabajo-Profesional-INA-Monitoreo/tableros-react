import { BASE_URL } from "../utils/service";
import { getConfigurationID } from "../utils/storage";
import { getOptions } from "../utils/service";

export default class utilsService {

    async getAllProcedures() {
        const response = await fetch(`${BASE_URL}/filtro/procedimientos?configurationId=${getConfigurationID()}`, getOptions());
        const res = await response.json();
        return res;
    }

    async getAllVariables() {
        const response = await fetch(`${BASE_URL}/filtro/variables?configurationId=${getConfigurationID()}`, getOptions());
        const res = await response.json();
        return res;
    }

    async getAllNodes() {
        const response = await fetch(`${BASE_URL}/filtro/nodos?configurationId=${getConfigurationID()}`, getOptions());
        const res = await response.json();
        return res;
    }

}