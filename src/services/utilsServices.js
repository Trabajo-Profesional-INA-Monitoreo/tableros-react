import { BASE_URL } from "../utils/service";

export default class utilsService {

    async getAllProcedures() {
        const response = await fetch(`${BASE_URL}/filtro/procedimientos`);
        const res = await response.json();
        return res;
    }

    async getAllVariables() {
        const response = await fetch(`${BASE_URL}/filtro/variables`);
        const res = await response.json();
        return res;
    }

}