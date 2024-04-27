import { BASE_URL } from "../utils/service";
import { getConfigurationID } from "../utils/storage";

export default class nodeService {

    async getNodes() {
        const response = await fetch(`${BASE_URL}/series/nodos?configurationId=${getConfigurationID()}`);
        const res = await response.json();
        return res;
    }

}
